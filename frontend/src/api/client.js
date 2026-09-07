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
  fetchMarketData: (ticker, period = '1y', interval = '1d', include_indicators = true) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.get(`/market/data/${encodeURIComponent(ticker)}`, {
          params: { period, interval, include_indicators }
        });
        return res.data;
      },
      null
    );
  },

  fetchIndicators: (ticker, period = '1y', interval = '1d') => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.get(`/market/indicators/${encodeURIComponent(ticker)}`, {
          params: { period, interval }
        });
        return res.data;
      },
      null
    );
  },

  fetchSentiment: (ticker, lookback_days = 7) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.get(`/sentiment/analyze/${encodeURIComponent(ticker)}`, {
          params: { lookback_days }
        });
        return res.data;
      },
      null
    );
  },

  analyzeHeadlines: (headlines) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.post(`/sentiment/analyze/headlines`, { headlines });
        return res.data;
      },
      null
    );
  },

  runBacktest: ({ ticker, strategy = 'SMA_CROSSOVER', params = {}, period = '1y', interval = '1d', initial_capital = 10000, commission_pct = 0.001, slippage_pct = 0.0005 }) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.post(`/backtest/run`, {
          ticker,
          strategy,
          params,
          period,
          interval,
          initial_capital,
          commission_pct,
          slippage_pct
        });
        return res.data;
      },
      null
    );
  },

  fetchStrategies: () => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.get(`/backtest/strategies`);
        return res.data;
      },
      null
    );
  },

  fetchForecast: (ticker, days = 5) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.get(`/forecast/predict/${encodeURIComponent(ticker)}`, {
          params: { days }
        });
        return res.data;
      },
      null
    );
  },

  trainForecastModel: ({ ticker, period = '2y', task = 'classification', forecast_horizon = 1 }) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.post(`/forecast/train`, {
          ticker,
          period,
          task,
          forecast_horizon
        });
        return res.data;
      },
      null
    );
  },

  evaluateRisk: (returns, risk_free_rate = 0.02) => {
    return requestWithFallback(
      async () => {
        const res = await apiClient.post(`/risk/evaluate`, {
          returns,
          risk_free_rate
        });
        return res.data;
      },
      null
    );
  }
};

