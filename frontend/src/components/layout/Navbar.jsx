import React, { useState } from 'react';
import { Activity, Search, Github, Clock, Globe } from 'lucide-react';

const Navbar = ({ selectedTicker, setSelectedTicker, selectedTimeframe, setSelectedTimeframe }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedTicker(searchInput.toUpperCase());
      setSearchInput('');
    }
  };

  return (
    <nav className="h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-6 text-white shrink-0">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-wider">AlgoScan</span>
            <span className="text-xs text-slate-400">AI Quant Terminal</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-700 mx-4" />
        <div className="flex items-center space-x-2 text-xs">
          <Globe className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-300">Market Open</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">14ms latency</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center space-x-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticker (e.g. AAPL, BTC/USDT)..."
            className="w-64 bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className="flex items-center space-x-2">
          {['AAPL', 'TSLA', 'NVDA', 'BTC/USDT', 'ETH/USDT'].map((ticker) => (
            <button
              key={ticker}
              onClick={() => setSelectedTicker(ticker)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedTicker === ticker 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {ticker}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
          {['1D', '1W', '1M', '6M', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <Clock className="h-5 w-5 text-slate-400" />
        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
          <Github className="h-5 w-5" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
