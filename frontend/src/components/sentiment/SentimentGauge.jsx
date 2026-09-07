import React from 'react';

const SentimentGauge = ({ score = 0.65 }) => {
  // score ranges from -1 to 1
  const normalizedScore = (score + 1) / 2; // 0 to 1
  const rotation = normalizedScore * 180 - 90; // -90 to 90 degrees

  let sentimentStatus = 'Neutral';
  let colorClass = 'text-slate-400';
  let bgClass = 'bg-slate-500';
  
  if (score >= 0.2) {
    sentimentStatus = 'Bullish';
    colorClass = 'text-emerald-400';
    bgClass = 'bg-emerald-500';
  } else if (score <= -0.2) {
    sentimentStatus = 'Bearish';
    colorClass = 'text-red-400';
    bgClass = 'bg-red-500';
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center shadow-xl">
      <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">FinBERT Compound Score</h3>
      
      <div className="relative w-48 h-24 overflow-hidden mb-6">
        {/* Gauge Background */}
        <div className="absolute w-48 h-48 rounded-full border-[20px] border-slate-800" />
        
        {/* Color Gradient Arc (Simulated with segments) */}
        <div className="absolute w-48 h-48 rounded-full border-[20px] border-transparent border-t-red-500 border-l-red-500 rotate-45 opacity-50" />
        <div className="absolute w-48 h-48 rounded-full border-[20px] border-transparent border-t-emerald-500 border-r-emerald-500 -rotate-45 opacity-50" />
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom rounded-t-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        {/* Needle Base */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 translate-y-1/2 shadow-lg" />
      </div>

      <div className="text-center">
        <div className={`text-3xl font-bold ${colorClass} mb-1`}>
          {score > 0 ? '+' : ''}{score.toFixed(2)}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${bgClass} text-white inline-block mb-6`}>
          {sentimentStatus}
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-emerald-400">P(Positive)</span>
            <span className="text-slate-300">{(normalizedScore * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${normalizedScore * 100}%` }} />
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">P(Neutral)</span>
            <span className="text-slate-300">15.4%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `15.4%` }} />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-red-400">P(Negative)</span>
            <span className="text-slate-300">{((1 - normalizedScore) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(1 - normalizedScore) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;
