"""Financial news fetching from NewsAPI and Alpha Vantage.

Provides async HTTP clients with retry logic and rate limiting.
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from typing import TYPE_CHECKING, Any, Final

import httpx

from app.utils.errors import ExternalAPIError
from app.utils.logging import get_logger

if TYPE_CHECKING:
    from app.config import Settings

logger = get_logger(__name__)

# ── Constants ────────────────────────────────────────────────
NEWSAPI_BASE: Final[str] = "https://newsapi.org/v2/everything"
ALPHA_VANTAGE_BASE: Final[str] = "https://www.alphavantage.co/query"
DEFAULT_LOOKBACK_DAYS: Final[int] = 7
MAX_RETRIES: Final[int] = 3
BACKOFF_FACTOR: Final[float] = 1.5
REQUEST_TIMEOUT: Final[float] = 15.0


class NewsArticle:
    """Normalized news article container."""

    __slots__ = ("title", "source", "published_at", "url", "description")

    def __init__(
        self,
        title: str,
        source: str,
        published_at: datetime,
        url: str = "",
        description: str = "",
    ) -> None:
        self.title = title
        self.source = source
        self.published_at = published_at
        self.url = url
        self.description = description

    def to_dict(self) -> dict[str, Any]:
        return {
            "title": self.title,
            "source": self.source,
            "published_at": self.published_at.isoformat(),
            "url": self.url,
            "description": self.description,
        }


class NewsFetcher:
    """Async news fetcher aggregating NewsAPI and Alpha Vantage results."""

    def __init__(self, settings: Settings) -> None:
        self._newsapi_key = settings.newsapi_key
        self._alpha_vantage_key = settings.alpha_vantage_key

    async def fetch(self, ticker: str, lookback_days: int = DEFAULT_LOOKBACK_DAYS) -> list[NewsArticle]:
        """Fetch news articles for a ticker from all configured sources.

        Args:
            ticker: Stock ticker symbol (e.g., 'AAPL').
            lookback_days: Number of days to look back.

        Returns:
            Deduplicated and sorted (newest-first) list of NewsArticle.
        """
        tasks: list[asyncio.Task[list[NewsArticle]]] = []

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            if self._newsapi_key:
                tasks.append(
                    asyncio.create_task(self._fetch_newsapi(client, ticker, lookback_days))
                )
            if self._alpha_vantage_key:
                tasks.append(
                    asyncio.create_task(self._fetch_alpha_vantage(client, ticker))
                )

            if not tasks:
                logger.warning("No API keys configured — returning empty news list.")
                return []

            results = await asyncio.gather(*tasks, return_exceptions=True)

        articles: list[NewsArticle] = []
        for result in results:
            if isinstance(result, Exception):
                logger.error("News fetch failed: %s", result)
            else:
                articles.extend(result)

        # Deduplicate by title, sort newest first
        seen: set[str] = set()
        unique: list[NewsArticle] = []
        for article in articles:
            key = article.title.strip().lower()
            if key not in seen:
                seen.add(key)
                unique.append(article)

        unique.sort(key=lambda a: a.published_at, reverse=True)
        logger.info("Fetched %d unique articles for %s.", len(unique), ticker)
        return unique

    # ── NewsAPI ─────────────────────────────────────────────

    async def _fetch_newsapi(
        self, client: httpx.AsyncClient, ticker: str, lookback_days: int
    ) -> list[NewsArticle]:
        """Fetch from NewsAPI with retry + exponential backoff."""
        from_date = (datetime.now(tz=timezone.utc) - timedelta(days=lookback_days)).strftime("%Y-%m-%d")
        params = {
            "q": ticker,
            "from": from_date,
            "sortBy": "publishedAt",
            "language": "en",
            "pageSize": 50,
            "apiKey": self._newsapi_key,
        }
        data = await self._request_with_retry(client, NEWSAPI_BASE, params, "NewsAPI")
        articles: list[NewsArticle] = []

        for item in data.get("articles", []):
            try:
                published = datetime.fromisoformat(
                    item["publishedAt"].replace("Z", "+00:00")
                )
                articles.append(
                    NewsArticle(
                        title=item.get("title", ""),
                        source=item.get("source", {}).get("name", "NewsAPI"),
                        published_at=published,
                        url=item.get("url", ""),
                        description=item.get("description", ""),
                    )
                )
            except (KeyError, ValueError) as exc:
                logger.debug("Skipping malformed NewsAPI article: %s", exc)

        return articles

    # ── Alpha Vantage ───────────────────────────────────────

    async def _fetch_alpha_vantage(
        self, client: httpx.AsyncClient, ticker: str
    ) -> list[NewsArticle]:
        """Fetch from Alpha Vantage News Sentiment endpoint."""
        params = {
            "function": "NEWS_SENTIMENT",
            "tickers": ticker,
            "limit": 50,
            "apikey": self._alpha_vantage_key,
        }
        data = await self._request_with_retry(client, ALPHA_VANTAGE_BASE, params, "AlphaVantage")
        articles: list[NewsArticle] = []

        for item in data.get("feed", []):
            try:
                # AV format: "20240115T143000"
                raw_time = item.get("time_published", "")
                published = datetime.strptime(raw_time, "%Y%m%dT%H%M%S").replace(
                    tzinfo=timezone.utc
                )
                articles.append(
                    NewsArticle(
                        title=item.get("title", ""),
                        source=item.get("source", "AlphaVantage"),
                        published_at=published,
                        url=item.get("url", ""),
                        description=item.get("summary", ""),
                    )
                )
            except (KeyError, ValueError) as exc:
                logger.debug("Skipping malformed AV article: %s", exc)

        return articles

    # ── HTTP helper ─────────────────────────────────────────

    @staticmethod
    async def _request_with_retry(
        client: httpx.AsyncClient,
        url: str,
        params: dict[str, Any],
        service_name: str,
    ) -> dict[str, Any]:
        """Make an HTTP GET with exponential backoff retry."""
        last_exc: Exception | None = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()  # type: ignore[no-any-return]
            except (httpx.HTTPStatusError, httpx.RequestError) as exc:
                last_exc = exc
                wait = BACKOFF_FACTOR ** attempt
                logger.warning(
                    "%s request failed (attempt %d/%d): %s — retrying in %.1fs",
                    service_name, attempt, MAX_RETRIES, exc, wait,
                )
                await asyncio.sleep(wait)

        raise ExternalAPIError(service_name, str(last_exc))
