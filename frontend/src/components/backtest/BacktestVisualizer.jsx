import React from 'react';
import { createChart } from 'lightweight-charts';

const trades = [
  { id: 1, side: 'BUY', entryTime: '2023-08-15 09:30', exitTime: '2023-08-18 14:15', entryPrice: '$145.20', exitPrice: '$152.40', pnl: '+$72.00', ret: '+4.95%' },
  { id: 2, side: 'SELL', entryTime: '2023-08-21 10:00', exitTime: '2023-08-22 11:30', entryPrice: '$150.10', exitPrice: '$148.50', pnl: '+$16.00', ret: '+1.06%' },
  { id: 3, side: 'BUY', entryTime: '2023-08-25 15:45', exitTime: '2023-08-28 09:45', entryPrice: '$151.30', exitPrice: '$149.20', pnl: '-$21.00', ret: '-1.38%' },
  { id: 4, side: 'BUY', entryTime: '2023-09-02 11:15', exitTime: '2023-09-05 15:30', entryPrice: '$148.90', exitPrice: '$156.10', pnl: '+$72.00', ret: '+4.83%' },
];

const BacktestVisualizer = () => {
  const chartContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: 'solid', color: 'transparent' }, textColor: '#94a3b8' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      rightPriceScale: { borderColor: '#1e293b' },
      timeScale: { borderColor: '#1e293b', timeVisible: true },
    });

    const strategySeries = chart.addLineSeries({ color: '#10b981', lineWidth: 2, title: 'Strategy' });
    const benchmarkSeries = chart.addLineSeries({ color: '#64748b', lineWidth: 2, lineStyle: 2, title: 'Buy & Hold' });

    // Dummy data
    const data1 = []; const data2 = [];
    let val1 = 10000; let val2 = 10000;
    const now = new Date();
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(now.getTime() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      val1 = val1 * (1 + (Math.random() - 0.45) * 0.05);
      val2 = val2 * (1 + (Math.random() - 0.5) * 0.04);
      data1.push({ time, value: val1 });
      data2.push({ time, value: val2 });
    }

    strategySeries.setData(data1);
    benchmarkSeries.setData(data2);

    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    window.addEventListener('resize', handleResize);
    chart.timeScale().fitContent();

    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl h-full overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
        <h3 className="text-white font-semibold">Equity Curve: Strategy vs Benchmark</h3>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></span><span className="text-slate-300">Strategy</span></div>
          <div className="flex items-center"><span className="w-3 h-3 bg-slate-500 rounded-sm mr-2 border border-dashed border-slate-400"></span><span className="text-slate-300">Buy & Hold</span></div>
        </div>
      </div>
      
      <div className="h-64 p-2 relative">
        <div ref={chartContainerRef} className="absolute inset-2" />
      </div>

      <div className="flex-1 flex flex-col border-t border-slate-700">
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Executed Trades</h4>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar p-0">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-500 bg-slate-900 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">Side</th>
                <th className="px-4 py-3 font-medium">Entry Time</th>
                <th className="px-4 py-3 font-medium">Exit Time</th>
                <th className="px-4 py-3 font-medium text-right">Entry $</th>
                <th className="px-4 py-3 font-medium text-right">Exit $</th>
                <th className="px-4 py-3 font-medium text-right">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trades.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {t.side}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-400">{t.entryTime}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-400">{t.exitTime}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{t.entryPrice}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{t.exitPrice}</td>
                  <td className={`px-4 py-2.5 text-right font-mono font-medium ${t.ret.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.pnl} <span className="text-xs opacity-70 ml-1">({t.ret})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BacktestVisualizer;
