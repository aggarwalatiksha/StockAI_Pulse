"""Sentiment analysis API endpoints.

Provides:
  - GET  /analyze/{ticker}  — fetch news & score sentiment for a ticker
  - POST /analyze/headlines — score user-provided headlines
  - GET  /health            — sentiment engine health check
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Request

from app.config import Settings, get_settings
from app.core.sentiment.aggregator import aggregate_sentiment, compute_current_sentiment
from app.core.sentiment.finbert import FinBERTAnalyzer
from app.core.sentiment.news_fetcher import NewsFetcher
from app.core.sentiment.preprocessor import preprocess_headlines
from app.models.sentiment import (
    HeadlineScore,
    HeadlineSentimentResponse,
    ResponseMeta,
    SentimentAggregation,
    SentimentRequest,
    TickerSentimentData,
    TickerSentimentResponse,
)
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


def _get_finbert(request: Request) -> FinBERTAnalyzer:
    """Extract FinBERT analyzer from app state."""
    analyzer: FinBERTAnalyzer | None = getattr(request.app.state, "finbert", None)
    if analyzer is None or not analyzer.is_loaded:
        raise HTTPException(status_code=503, detail="FinBERT model not loaded.")
    return analyzer


def _compound_to_signal(score: float) -> str:
    """Map compound score to a discrete trading signal."""
    if score >= 0.15:
        return "Bullish"
    elif score <= -0.15:
        return "Bearish"
    return "Neutral"


@router.get(
    "/analyze/{ticker}",
    response_model=TickerSentimentResponse,
    summary="Analyze sentiment for a ticker",
)
async def analyze_ticker(
    request: Request,
    ticker: Annotated[str, Path(min_length=1, max_length=10, description="Stock ticker symbol")],
    lookback_days: Annotated[int, Query(ge=1, le=30, description="Days to look back")] = 7,
    settings: Settings = Depends(get_settings),
) -> TickerSentimentResponse:
    """Fetch recent news for a ticker and return scored sentiment analysis."""
    analyzer = _get_finbert(request)
    ticker = ticker.upper()

    # 1. Fetch news
    fetcher = NewsFetcher(settings)
    articles = await fetcher.fetch(ticker, lookback_days=lookback_days)

    if not articles:
        raise HTTPException(status_code=404, detail=f"No news articles found for {ticker}.")

    # 2. Preprocess
    raw_headlines = [a.title for a in articles]
    cleaned = preprocess_headlines(raw_headlines, ticker=None)  # Don't filter by ticker — already fetched for it

    if not cleaned:
        raise HTTPException(status_code=404, detail=f"No valid headlines after preprocessing for {ticker}.")

    # 3. Score with FinBERT
    scores = analyzer.predict(cleaned)
    score_dicts = [s.to_dict() for s in scores]

    # 4. Match timestamps (use article timestamps for cleaned headlines)
    headline_to_time: dict[str, datetime] = {}
    for article in articles:
        headline_to_time[article.title] = article.published_at

    timestamps: list[datetime] = []
    for headline in cleaned:
        # Try exact match first, fallback to now
        ts = headline_to_time.get(headline, datetime.now(tz=timezone.utc))
        timestamps.append(ts)

    # 5. Aggregate
    rolling = aggregate_sentiment(score_dicts, timestamps)
    current = compute_current_sentiment(score_dicts, timestamps)

    # 6. Build response
    headline_scores = [HeadlineScore(**sd) for sd in score_dicts]

    return TickerSentimentResponse(
        status="ok",
        data=TickerSentimentData(
            ticker=ticker,
            current_score=current,
            signal=_compound_to_signal(current),
            headline_scores=headline_scores,
            rolling_sentiment=[
                SentimentAggregation(timestamp=dp.timestamp, compound_score=dp.compound_score, headline_count=dp.headline_count)
                for dp in rolling
            ],
            total_articles=len(cleaned),
        ),
        meta=ResponseMeta(
            timestamp=datetime.now(tz=timezone.utc),
            ticker=ticker,
            cached_items=analyzer.cache_stats["cached_items"],
        ),
    )


@router.post(
    "/analyze/headlines",
    response_model=HeadlineSentimentResponse,
    summary="Analyze custom headlines",
)
async def analyze_headlines(
    body: SentimentRequest,
    request: Request,
) -> HeadlineSentimentResponse:
    """Score a list of user-provided financial headlines."""
    analyzer = _get_finbert(request)

    # Preprocess
    cleaned = preprocess_headlines(body.headlines, deduplicate=True)
    if not cleaned:
        raise HTTPException(status_code=422, detail="No valid headlines after preprocessing.")

    # Score
    scores = analyzer.predict(cleaned)
    headline_scores = [HeadlineScore(**s.to_dict()) for s in scores]

    return HeadlineSentimentResponse(
        status="ok",
        data=headline_scores,
        meta=ResponseMeta(
            timestamp=datetime.now(tz=timezone.utc),
            cached_items=analyzer.cache_stats["cached_items"],
        ),
    )


@router.get("/health", summary="Sentiment engine health")
async def sentiment_health(request: Request) -> dict[str, object]:
    """Check FinBERT model status and cache stats."""
    analyzer = _get_finbert(request)
    return {
        "status": "ok",
        "model_loaded": analyzer.is_loaded,
        "cache": analyzer.cache_stats,
    }
