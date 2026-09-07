import axios from 'axios';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Helper to handle API requests with mock fallbacks
const requestWithFallback = async (requestFn, mockData) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.warn('API request failed, using mock data fallback:', error.message);
    return mockData;
  }
};

export const api = {
  fetchMarketData: (ticker, period, interval, include_indicators) => {
    return requestWithFallback(
      () => apiClient.get(`/market-data`, { params: { ticker, period, interval, include_indicators } }),
      {
        ticker,
        prices: [
          { time: '2023-01-01', open: 150, high: 155, low: 149, close: 154, volume: 1000000 },
          { time: '2023-01-02', open: 154, high: 158, low: 152, close: 157, volume: 1200000 },
          { time: '2023-01-03', open: 157, high: 160, low: 155, close: 159, volume: 1100000 },
          { time: '2023-01-04', open: 159, high: 162, low: 158, close: 161, volume: 1300000 },
          { time: '2023-01-05', open: 161, high: 165, low: 160, close: 164, volume: 1500000 },
        ]
      }
    );
  },

  fetchIndicators: (ticker, period, interval) => {
    return requestWithFallback(
      () => apiClient.get(`/indicators`, { params: { ticker, period, interval } }),
      {
        ticker,
        indicators: {
          rsi: [45, 50, 55, 60, 65],
          macd: { macd: [0.1, 0.2, 0.3, 0.4, 0.5], signal: [0.05, 0.15, 0.25, 0.35, 0.45], histogram: [0.05, 0.05, 0.05, 0.05, 0.05] }
        }
      }
    );
  },

  fetchSentiment: (ticker, lookback_days) => {
    return requestWithFallback(
      () => apiClient.get(`/sentiment`, { params: { ticker, lookback_days } }),
      {
        ticker,
        sentiment_score: 0.75,
        bullish_percent: 80,
        bearish_percent: 20,
        recent_news: [
          { title: "Company reports strong earnings", sentiment: "positive", date: "2023-01-05" },
          { title: "New product launch announced", sentiment: "positive", date: "2023-01-04" },
        ]
      }
    );
  },

  analyzeHeadlines: (headlines) => {
    return requestWithFallback(
      () => apiClient.post(`/sentiment/analyze`, { headlines }),
      {
        results: headlines.map(h => ({ headline: h, sentiment: "neutral", score: 0.5 }))
      }
    );
  },

  runBacktest: ({ ticker, strategy, params, period, interval, initial_capital, commission_pct, slippage_pct }) => {
    return requestWithFallback(
      () => apiClient.post(`/backtest`, { ticker, strategy, params, period, interval, initial_capital, commission_pct, slippage_pct }),
      {
        strategy,
        ticker,
        total_return: 15.5,
        annualized_return: 22.1,
        max_drawdown: -5.4,
        sharpe_ratio: 1.8,
        win_rate: 65,
        trades: 42,
        equity_curve: [
          { time: '2023-01-01', equity: 10000 },
          { time: '2023-01-05', equity: 10500 },
          { time: '2023-01-10', equity: 11550 },
        ]
      }
    );
  },

  fetchStrategies: () => {
    return requestWithFallback(
      () => apiClient.get(`/strategies`),
      {
        strategies: [
          { id: "sma_crossover", name: "SMA Crossover", description: "Simple Moving Average Crossover" },
          { id: "rsi_mean_reversion", name: "RSI Mean Reversion", description: "RSI Based Mean Reversion" },
          { id: "macd_trend", name: "MACD Trend", description: "MACD Trend Following" }
        ]
      }
    );
  },

  fetchForecast: (ticker, days) => {
    return requestWithFallback(
      () => apiClient.get(`/forecast`, { params: { ticker, days } }),
      {
        ticker,
        forecast: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          predicted_price: 150 + i * 2,
          confidence_lower: 145 + i * 1.5,
          confidence_upper: 155 + i * 2.5
        }))
      }
    );
  },

  trainForecastModel: ({ ticker, period, task, forecast_horizon }) => {
    return requestWithFallback(
      () => apiClient.post(`/forecast/train`, { ticker, period, task, forecast_horizon }),
      {
        status: "success",
        message: "Model training initiated successfully.",
        job_id: "job-12345"
      }
    );
  },

  evaluateRisk: (returns, risk_free_rate) => {
    return requestWithFallback(
      () => apiClient.post(`/risk/evaluate`, { returns, risk_free_rate }),
      {
        volatility: 0.15,
        var_95: -0.02,
        cvar_95: -0.03,
        beta: 1.1,
        sortino_ratio: 2.1
      }
    );
  }
};
