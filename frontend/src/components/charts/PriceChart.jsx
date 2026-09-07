import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Maximize2, Settings, BarChart2, Wifi } from 'lucide-react';
import { api } from '../../api/client';


const generateDummyData = () => {
  let basePrice = 150;
  const data = [];
  const volumeData = [];
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const time = new Date(now.getTime() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const open = basePrice + (Math.random() - 0.5) * 5;
    const high = open + Math.random() * 5;
    const low = open - Math.random() * 5;
    const close = low + Math.random() * (high - low);
    basePrice = close;
    
    data.push({ time, open, high, low, close });
    volumeData.push({ 
      time, 
      value: Math.random() * 10000 + 5000, 
      color: close > open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)' 
    });
  }
  return { data, volumeData };
};

// Map timeframe to period/interval for API
const getTimeframeParams = (timeframe) => {
  switch (timeframe) {
    case '1D':   return { period: '5d',  interval: '5m' };
    case '1W':   return { period: '1mo', interval: '15m' };
    case '1M':   return { period: '3mo', interval: '1d' };
    case '6M':   return { period: '6mo', interval: '1d' };
    case '1Y':   return { period: '1y',  interval: '1d' };
    case 'LIVE': return { period: '1d',  interval: '5m' };
    default:     return { period: '1y',  interval: '1d' };
  }
};

const PriceChart = ({ ticker, timeframe }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [showMAs, setShowMAs] = useState(true);
  const [lastPrice, setLastPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#64748b', style: 3 },
        horzLine: { color: '#64748b', style: 3 },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candleSeriesRef.current = candlestickSeries;

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    volumeSeriesRef.current = volumeSeries;

    let isMounted = true;

    async function loadChartData() {
      try {
        const { period, interval } = getTimeframeParams(timeframe);
        const res = await api.fetchMarketData(ticker, period, interval, true);
        if (res && res.data && res.data.ohlcv && res.data.ohlcv.length > 0 && isMounted) {
          const isIntraday = interval.includes('m') || interval.includes('h');
          
          const candleData = res.data.ohlcv.map(b => ({
            time: isIntraday 
              ? Math.floor(new Date(b.timestamp).getTime() / 1000)
              : b.timestamp.split('T')[0],
            open: Number(b.open),
            high: Number(b.high),
            low: Number(b.low),
            close: Number(b.close)
          }));
          const volData = res.data.ohlcv.map(b => ({
            time: isIntraday
              ? Math.floor(new Date(b.timestamp).getTime() / 1000)
              : b.timestamp.split('T')[0],
            value: Number(b.volume),
            color: b.close >= b.open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'
          }));
          candlestickSeries.setData(candleData);
          volumeSeries.setData(volData);
          chart.timeScale().fitContent();

          // Update price info
          const latest = res.data.ohlcv[res.data.ohlcv.length - 1];
          const prev = res.data.ohlcv.length > 1 ? res.data.ohlcv[res.data.ohlcv.length - 2] : latest;
          setLastPrice(Number(latest.close).toFixed(2));
          setPriceChange(((Number(latest.close) - Number(prev.close)) / Number(prev.close) * 100).toFixed(2));
          return;
        }
      } catch (e) {
        console.warn('API fetchMarketData failed, falling back to simulated data:', e);
      }

      if (isMounted) {
        const { data, volumeData } = generateDummyData();
        candlestickSeries.setData(data);
        volumeSeries.setData(volumeData);
        chart.timeScale().fitContent();
      }
    }

    loadChartData();

    // LIVE mode: auto-refresh every 30 seconds
    let liveInterval = null;
    if (timeframe === 'LIVE') {
      setIsLive(true);
      liveInterval = setInterval(() => {
        if (isMounted) loadChartData();
      }, 30000);
    } else {
      setIsLive(false);
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      if (liveInterval) clearInterval(liveInterval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker, timeframe]);


  return (
    <div className="h-full w-full flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-white">{ticker}</h2>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            isLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-700 text-slate-300'
          }`}>
            {isLive ? '● LIVE' : timeframe}
          </span>
          {lastPrice && (
            <span className="text-white font-semibold text-lg">${lastPrice}</span>
          )}
          {priceChange && (
            <span className={`text-sm font-medium ${Number(priceChange) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {Number(priceChange) >= 0 ? '+' : ''}{priceChange}%
            </span>
          )}
          {isLive && (
            <span className="flex items-center space-x-1 text-xs text-emerald-400">
              <Wifi className="w-3 h-3" />
              <span>5m candles • auto-refresh 30s</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowMAs(!showMAs)}
            className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${showMAs ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>MAs (20, 50, 12)</span>
          </button>
          <button className="text-slate-400 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
          <button className="text-slate-400 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 relative w-full h-full" />
    </div>
  );
};

export default PriceChart;
