import React from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity, Target, Zap } from 'lucide-react';

const MetricCard = ({ title, value, change, isPositive, icon: Icon, desc }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:bg-slate-800 transition-colors relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-16 h-16 text-slate-400" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-3">
        <Icon className="w-4 h-4 text-slate-400" />
        <h4 className="text-slate-300 text-sm font-medium">{title}</h4>
      </div>
      <div className="flex items-end space-x-3 mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded mb-1 ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

const RiskScorecard = () => {
  return (
    <div className="h-full bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <span>Institutional Risk Analytics</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">Real-time portfolio performance and risk metrics evaluation.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          title="Cumulative ROI" 
          value="124.5%" 
          change="3.2%" 
          isPositive={true} 
          icon={TrendingUp}
          desc="Total return since inception"
        />
        <MetricCard 
          title="Sharpe Ratio" 
          value="2.14" 
          change="0.12" 
          isPositive={true} 
          icon={Activity}
          desc="Risk-adjusted return (Annualized)"
        />
        <MetricCard 
          title="Max Drawdown" 
          value="-14.2%" 
          change="-2.1%" 
          isPositive={false} 
          icon={AlertTriangle}
          desc="Largest peak-to-trough drop"
        />
        <MetricCard 
          title="Win Rate" 
          value="64.8%" 
          change="1.5%" 
          isPositive={true} 
          icon={Target}
          desc="Percentage of profitable trades"
        />
        <MetricCard 
          title="Profit Factor" 
          value="1.85" 
          change="0.05" 
          isPositive={true} 
          icon={Zap}
          desc="Gross Profits / Gross Losses"
        />
        <MetricCard 
          title="Sortino Ratio" 
          value="3.12" 
          change="0.22" 
          isPositive={true} 
          icon={ShieldCheck}
          desc="Downside risk adjusted return"
        />
      </div>
    </div>
  );
};

export default RiskScorecard;
