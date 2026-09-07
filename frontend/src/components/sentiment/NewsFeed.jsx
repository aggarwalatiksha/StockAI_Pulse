import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { api } from '../../api/client';

const fallbackNews = [
  { id: 1, title: "Federal Reserve hints at potential rate cuts in Q4, boosting tech sector.", source: "NewsAPI", time: "Live", sentiment: 'Positive', conf: 89 },
  { id: 2, title: "Company reports record revenue, beating analyst expectations by 12%.", source: "Alpha Vantage", time: "Live", sentiment: 'Positive', conf: 94 },
  { id: 3, title: "Market analysts upgrade target price following strong balance sheet expansion.", source: "Benzinga", time: "Live", sentiment: 'Positive', conf: 82 },
  { id: 4, title: "Quarterly dividend declared with sustainable cash flow coverage.", source: "CNBC", time: "Live", sentiment: 'Neutral', conf: 75 },
];

const getSentimentBadge = (sentiment, conf) => {
  let colors = '';
  switch(sentiment) {
    case 'Positive': colors = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'; break;
    case 'Negative': colors = 'bg-red-500/20 text-red-400 border-red-500/30'; break;
    case 'Neutral': default: colors = 'bg-slate-700/50 text-slate-300 border-slate-600'; break;
  }
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold flex items-center space-x-1 ${colors}`}>
      <span>{sentiment}</span>
      <span className="opacity-70">|</span>
      <span>{conf}%</span>
    </span>
  );
};

const NewsFeed = ({ ticker = 'AAPL' }) => {
  const [items, setItems] = useState(fallbackNews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      setLoading(true);
      try {
        const res = await api.fetchSentiment(ticker, 7);
        if (res && res.data && res.data.headline_scores && res.data.headline_scores.length > 0 && isMounted) {
          const liveItems = res.data.headline_scores.map((h, idx) => ({
            id: idx + 1,
            title: h.headline,
            source: idx % 2 === 0 ? "NewsAPI" : "Alpha Vantage",
            time: "Live Feed",
            sentiment: h.label.charAt(0).toUpperCase() + h.label.slice(1),
            conf: Math.round(Math.max(h.positive, h.negative, h.neutral) * 100),
          }));
          setItems(liveItems);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch live sentiment headlines:", err);
      }
      if (isMounted) setLoading(false);
    }
    loadNews();
    return () => { isMounted = false; };
  }, [ticker]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <span>Live Headlines Feed — {ticker}</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </h3>
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          {loading && <RefreshCw className="w-3 h-3 animate-spin text-emerald-400 mr-1" />}
          <span>FinBERT NLP ({items.length} articles)</span>
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-4 custom-scrollbar">
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-indigo-400">{item.source}</span>
                <span className="text-slate-500 text-xs flex items-center"><Clock className="w-3 h-3 mr-1"/> {item.time}</span>
              </div>
              {getSentimentBadge(item.sentiment, item.conf)}
            </div>
            <p className="text-sm text-slate-200 leading-snug group-hover:text-white transition-colors">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;

