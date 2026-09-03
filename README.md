# StockAI Pulse (AlgoScan) 📈🤖

An end-to-end predictive algorithmic trading and financial sentiment analysis platform combining real-time NLP financial sentiment extraction with time-series algorithmic backtesting and risk metrics.

---

## 🏛️ Architecture & Tech Stack

- **Backend & REST API**: Python 3.11+, FastAPI, Pydantic v2, Uvicorn
- **NLP Sentiment Engine**: Hugging Face Transformers with **FinBERT** (`ProsusAI/finbert`), concurrent async news scraping (NewsAPI, Alpha Vantage) with exponential backoff and LRU SHA-256 caching
- **Market Data & Technicals**: Yahoo Finance (`yfinance`) for equities/ETFs, `CCXT` (Binance) for cryptocurrencies, and 10+ vectorized indicators (SMA, EMA, WMA, RSI, MACD, Bollinger Bands, ATR, VWAP, Stochastic)
- **ML Forecasting Engine**: Feature matrix builder with strict lag shifts (`shift(1)`) to avoid lookahead bias, XGBoost classifier/regressor with time-series CV, Bidirectional LSTM with Attention (PyTorch), and weighted Ensemble predictor
- **Quantitative Risk & Backtest Engine**: Simulation engine with realistic slippage, commissions, benchmark comparison, and metrics: **Cumulative ROI**, **Annualized ROI**, **Sharpe Ratio**, **Sortino Ratio**, **Max Drawdown (MDD)**, **Calmar Ratio**, **Win Rate**, and **Profit Factor**

---

## 📁 Repository Structure

```
StockAI_Pulse/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint & lifespan
│   │   ├── config.py                # Pydantic Settings & environment configuration
│   │   ├── dependencies.py          # Shared dependency injection
│   │   ├── api/
│   │   │   ├── router.py            # Top-level API router
│   │   │   └── v1/
│   │   │       ├── sentiment.py     # /api/v1/sentiment/*
│   │   │       ├── market.py        # /api/v1/market/*
│   │   │       ├── forecast.py      # /api/v1/forecast/*
│   │   │       ├── backtest.py      # /api/v1/backtest/*
│   │   │       └── risk.py          # /api/v1/risk/*
│   │   ├── core/
│   │   │   ├── sentiment/           # FinBERT analyzer, news fetcher, aggregator
│   │   │   ├── market/              # Data fetcher (stocks+crypto), indicators, feature engineering
│   │   │   ├── ml/                  # XGBoost, Bi-LSTM, Ensemble, Model Registry
│   │   │   ├── backtest/            # Strategies, BacktestEngine, Reporting
│   │   │   └── risk/                # Quantitative risk metrics calculations
│   │   ├── models/                  # Pydantic DTOs for requests & responses
│   │   └── utils/                   # Structured logging, custom errors, LRU cache
│   ├── tests/                       # Pytest unit & integration test suites
│   ├── pyproject.toml               # Project metadata & dependency specs
│   ├── requirements.txt             # Pip dependencies
│   └── .env.example                 # Example configuration
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Set Up Virtual Environment

```bash
git clone https://github.com/aggarwalatiksha/StockAI_Pulse.git
cd StockAI_Pulse/backend

python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and provide your optional API keys:

```bash
copy .env.example .env
```

```ini
NEWSAPI_KEY=your_key_here
ALPHA_VANTAGE_KEY=your_key_here
FINBERT_MODEL_NAME=ProsusAI/finbert
```

### 4. Run the API Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Access the interactive API docs at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 Key API Endpoints

### 📰 Sentiment Engine
- `GET /api/v1/sentiment/analyze/{ticker}`: Scrapes news and scores normalized FinBERT sentiment (`[-1, +1]`), rolling decay, and signal (Bullish/Bearish/Neutral).
- `POST /api/v1/sentiment/analyze/headlines`: Batch score raw financial headlines.

### 📊 Market Data & Technicals
- `GET /api/v1/market/data/{ticker}`: Fetch standardized OHLCV data with optional indicators.
- `GET /api/v1/market/indicators/{ticker}`: Computes RSI, MACD, Bollinger Bands, ATR, VWAP, Stochastic.

### 🧠 Machine Learning Forecasting
- `POST /api/v1/forecast/train`: Trains XGBoost direction/return prediction model with time-series CV.
- `GET /api/v1/forecast/predict/{ticker}`: Generates forward predictions with feature importance rankings.
- `GET /api/v1/forecast/models`: Lists persisted model artifacts in the registry.

### 📈 Backtesting & Risk Engine
- `POST /api/v1/backtest/run`: Runs historical strategy backtest with custom commission, slippage, and parameters.
- `GET /api/v1/backtest/strategies`: Catalog of available strategies (`SMA_CROSSOVER`, `RSI_MOMENTUM`, `MACD_CROSSOVER`, `SENTIMENT_ENHANCED`, `BOLLINGER_BREAKOUT`).
- `POST /api/v1/risk/evaluate`: Standalone evaluation of Sharpe, Sortino, Max Drawdown, Calmar, Win Rate, and Profit Factor.

---

## 🧪 Testing

Run the test suite with pytest:

```bash
pytest tests/ -v
```
