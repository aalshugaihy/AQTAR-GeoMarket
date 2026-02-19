
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getMarketIntelligence } from '../services/geminiService';

const NewsHub: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const newsItems = [
    { date: '2024-05-20', title: 'National Geospatial Authority Announces New LiDAR Standards', category: 'Standards' },
    { date: '2024-05-18', title: 'Topcon Expands Service Center Network in Dammam', category: 'Vendors' },
    { date: '2024-05-15', title: 'Major Infrastructure Project in Jeddah Requires 3D City Modeling', category: 'Tenders' },
  ];

  useEffect(() => {
    fetchAIInsight();
  }, [lang]);

  const fetchAIInsight = async () => {
    setLoading(true);
    const result = await getMarketIntelligence("Current Geospatial Market Trends in Saudi Arabia 2024", lang);
    setAiInsight(result.text);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className={`text-2xl font-bold mb-6 ${isRtl ? 'arabic-font' : ''}`}>
          {isRtl ? 'مركز الأخبار والتقارير' : 'News Hub & Reports'}
        </h2>
        
        {newsItems.map((news, idx) => (
          <div key={idx} className="bg-[#1B263B] p-6 rounded-xl border border-slate-800 flex gap-6 items-start hover:bg-slate-800/50 transition">
             <div className="bg-slate-900 px-3 py-2 rounded text-center min-w-[60px]">
                <div className="text-xs text-slate-500">MAY</div>
                <div className="text-xl font-bold text-sky-400">{20 - idx}</div>
             </div>
             <div className="flex-1">
                <div className="text-[10px] text-sky-400 font-mono mb-1 uppercase">{news.category}</div>
                <h3 className={`text-lg font-semibold text-white mb-2 ${isRtl ? 'arabic-font' : ''}`}>{news.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">
                  The latest updates regarding geospatial regulations and market movements across the Kingdom of Saudi Arabia.
                </p>
             </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-[#0A2342] rounded-xl border border-[#005F73] p-6 sticky top-24">
          <div className="flex items-center space-x-2 space-x-reverse mb-4 text-[#94D2BD]">
            <span className="text-xl">✨</span>
            <h3 className={`font-bold uppercase tracking-widest text-sm ${isRtl ? 'arabic-font' : ''}`}>
              {isRtl ? 'تحليل الذكاء الاصطناعي' : 'AI Market Pulse'}
            </h3>
          </div>
          
          <div className={`text-sm text-slate-300 leading-relaxed whitespace-pre-wrap ${loading ? 'animate-pulse' : ''}`}>
            {loading ? (isRtl ? 'جاري التحليل...' : 'Analyzing market data...') : aiInsight}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Model: Gemini 3 Flash</span>
            <button onClick={fetchAIInsight} className="text-sky-400 text-xs hover:underline uppercase font-bold tracking-tighter">
              {isRtl ? 'تحديث' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsHub;
