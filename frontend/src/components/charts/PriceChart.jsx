import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Maximize2, Settings, BarChart2 } from 'lucide-react';

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

const PriceChart = ({ ticker, timeframe }) => {
  const chartContainerRef = useRef(null);
  const [showMAs, setShowMAs] = useState(true);

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
        mode: 1, // Magnet
        vertLine: { color: '#64748b', style: 3 },
        horzLine: { color: '#64748b', style: 3 },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const { data, volumeData } = generateDummyData();
    candlestickSeries.setData(data);
    volumeSeries.setData(volumeData);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);
    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker, timeframe]);

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-white">{ticker}</h2>
          <span className="px-2 py-0.5 rounded bg-slate-700 text-xs font-medium text-slate-300">{timeframe}</span>
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
