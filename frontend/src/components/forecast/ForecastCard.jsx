import React from 'react';
import { Cpu, ChevronUp, ChevronDown, RefreshCw, BarChart } from 'lucide-react';

const FeatureBar = ({ name, weight, color }) => (
  <div className="flex items-center space-x-4 mb-3">
    <span className="text-xs text-slate-400 w-24 truncate">{name}</span>
    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${weight * 100}%` }} />
    </div>
    <span className="text-xs font-mono text-slate-300 w-12 text-right">{(weight * 100).toFixed(0)}%</span>
  </div>
);

const ForecastCard = () => {
  const isBullish = true;
  const confidence = 82;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl h-full overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-bold text-lg">ML Directional Forecast</h3>
          </div>
          <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-[10px] font-mono text-indigo-300">XGBoost + Bi-LSTM Ensemble</span>
          </div>
        </div>
        <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center items-center relative">
        {/* Glow effect */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-20 rounded-full ${isBullish ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg ${
            isBullish ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-2 border-red-500 text-red-400'
          }`}>
            {isBullish ? <ChevronUp className="w-12 h-12" /> : <ChevronDown className="w-12 h-12" />}
          </div>
          
          <h2 className={`text-3xl font-black uppercase tracking-wider mb-2 ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>
            {isBullish ? 'Bullish' : 'Bearish'} Signal
          </h2>
          
          <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <span className="text-slate-400 text-sm">Confidence:</span>
            <span className="text-white font-bold">{confidence}%</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-800/30 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center mb-4">
          <BarChart className="w-3 h-3 mr-1" /> Feature Importance Weights
        </h4>
        <div className="space-y-1">
          <FeatureBar name="Sentiment EWM" weight={0.35} color="bg-indigo-500" />
          <FeatureBar name="RSI (14)" weight={0.25} color="bg-blue-500" />
          <FeatureBar name="MACD Div" weight={0.20} color="bg-cyan-500" />
          <FeatureBar name="Volatility (ATR)" weight={0.15} color="bg-purple-500" />
          <FeatureBar name="Volume Flow" weight={0.05} color="bg-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
