import React from 'react';
import { Play, Settings2, SlidersHorizontal } from 'lucide-react';

const InputGroup = ({ label, defaultValue, type = "number" }) => (
  <div className="flex flex-col mb-3">
    <label className="text-xs text-slate-400 mb-1">{label}</label>
    <input 
      type={type} 
      defaultValue={defaultValue} 
      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
);

const StrategyControls = () => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl h-full">
      <div className="px-5 py-4 border-b border-slate-700 bg-slate-800/30 flex items-center space-x-2">
        <Settings2 className="w-5 h-5 text-indigo-400" />
        <h3 className="text-white font-semibold">Strategy Parameters</h3>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="mb-5">
          <label className="text-xs text-slate-400 mb-1 block">Algorithm</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
            <option>Sentiment-Enhanced MACD</option>
            <option>SMA Crossover (Fast/Slow)</option>
            <option>RSI Momentum Builder</option>
            <option>Bollinger Breakout</option>
          </select>
        </div>

        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
            <SlidersHorizontal className="w-3 h-3 mr-1" /> Dynamic Inputs
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <InputGroup label="Fast Period" defaultValue={12} />
            <InputGroup label="Slow Period" defaultValue={26} />
            <InputGroup label="Signal Smoothing" defaultValue={9} />
            <InputGroup label="Sent. Threshold" defaultValue={0.25} type="number" step="0.01" />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Simulation Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            <InputGroup label="Initial Capital ($)" defaultValue={10000} />
            <InputGroup label="Commission (%)" defaultValue={0.1} step="0.01" />
            <div className="col-span-2">
              <InputGroup label="Slippage (%)" defaultValue={0.05} step="0.01" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-slate-700 bg-slate-800/30">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <Play className="w-4 h-4 fill-current" />
          <span>Run Backtest</span>
        </button>
      </div>
    </div>
  );
};

export default StrategyControls;
