import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

const newsItems = [
  { id: 1, title: "Federal Reserve hints at potential rate cuts in Q4, boosting tech sector.", source: "NewsAPI", time: "10 mins ago", sentiment: 'Positive', conf: 89 },
  { id: 2, title: "Company reports record Q3 revenue, beating analyst expectations by 12%.", source: "Alpha Vantage", time: "45 mins ago", sentiment: 'Positive', conf: 94 },
  { id: 3, title: "CEO announces departure at the end of the year, sending shares lower.", source: "NewsAPI", time: "2 hours ago", sentiment: 'Negative', conf: 82 },
  { id: 4, title: "Quarterly dividend remains unchanged at $0.24 per share.", source: "Financial Times", time: "3 hours ago", sentiment: 'Neutral', conf: 65 },
  { id: 5, title: "Supply chain disruptions expected to impact upcoming product launch.", source: "Bloomberg", time: "5 hours ago", sentiment: 'Negative', conf: 77 },
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

const NewsFeed = () => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <span>Live Headlines Feed</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </h3>
        <span className="text-xs text-slate-400">NLP Powered</span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-4 custom-scrollbar">
        {newsItems.map(item => (
          <div key={item.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-indigo-400">{item.source}</span>
                <span className="text-slate-600 text-xs flex items-center"><Clock className="w-3 h-3 mr-1"/> {item.time}</span>
              </div>
              {getSentimentBadge(item.sentiment, item.conf)}
            </div>
            <p className="text-sm text-slate-200 leading-snug group-hover:text-white transition-colors">{item.title}</p>
            <div className="mt-3 flex justify-end">
              <button className="text-xs text-slate-500 hover:text-emerald-400 flex items-center transition-colors">
                Read full article <ExternalLink className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
