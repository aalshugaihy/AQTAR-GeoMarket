
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { getMarketIntelligence } from '../services/geminiService';
import { t } from '../translations';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  sources?: any[];
}

const AIIntelligence: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const examples = isRtl 
    ? ['تحليل الطلب على ليدار (LiDAR) في نيوم 2025', 'أحدث تنظيمات الدرونز من الهيئة الجيومكانية', 'توقعات أسعار المسح العقاري في روشن']
    : ['LiDAR demand forecast in NEOM 2025', 'KSA Drone regulations updates from GASGI', 'Property survey pricing trends in ROSHN'];

  const handleAnalysis = async (q?: string) => {
    const targetQuery = q || query;
    if (!targetQuery || loading) return;
    
    setLoading(true);
    const newUserMsg: Message = { role: 'user', parts: [{ text: targetQuery }] };
    setChatHistory(prev => [...prev, newUserMsg]);
    setQuery('');

    const data = await getMarketIntelligence(targetQuery, lang, chatHistory);
    
    const aiMsg: Message = { 
      role: 'model', 
      parts: [{ text: data.text }],
      sources: data.sources 
    };
    setChatHistory(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 h-[calc(100vh-180px)] flex flex-col">
      <div className="text-center space-y-2 mb-4">
        <h2 className={`text-4xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.aiTitle}</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-medium">{labels.aiDesc}</p>
      </div>

      <div className="flex-1 bg-[#1B263B] rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-6 mb-6 pr-4">
           {chatHistory.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
               <span className="text-6xl mb-6">🤖</span>
               <p className="text-sm font-black uppercase tracking-[0.2em]">{isRtl ? 'بانتظار استفسارك الأول حول السوق الجيومكاني' : 'Awaiting your first geospatial market query'}</p>
             </div>
           )}
           {chatHistory.map((msg, idx) => (
             <div key={idx} className={`flex flex-col gap-3 ${msg.role === 'user' ? (isRtl ? 'items-start' : 'items-end') : (isRtl ? 'items-end' : 'items-start')} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-6 rounded-3xl ${msg.role === 'user' ? 'bg-[#005F73] text-white shadow-xl' : 'bg-slate-900 border border-slate-800 text-slate-100 shadow-xl'}`}>
                   <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isRtl ? 'arabic-font text-right' : ''}`}>{msg.parts[0].text}</div>
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'} w-full px-4 mb-2`}>
                    {msg.sources.map((s, i) => (
                      <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noreferrer" className="px-3 py-1 bg-slate-950/50 border border-slate-800 rounded-full text-[9px] text-sky-400 font-bold hover:bg-sky-500/10 transition flex items-center gap-2 group">
                        <span className="opacity-50 group-hover:opacity-100 transition">🔗</span>
                        {s.web?.title || 'External Source'}
                      </a>
                    ))}
                  </div>
                )}
             </div>
           ))}
           {loading && <div className="animate-pulse flex gap-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl w-24 self-start"><div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-150"></div></div>}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 flex gap-3 items-center">
          <button onClick={() => alert("Document parsing enabled for Enterprise tier.")} title="Attach Document" className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-sky-400 transition-all text-xl">📎</button>
          <div className="flex-1 relative">
            <input 
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
              placeholder={labels.chatWithAI}
              className={`w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-6 py-5 pr-20 text-sm focus:outline-none focus:border-[#00F5D4]/40 transition shadow-inner ${isRtl ? 'arabic-font text-right' : ''}`}
            />
            <button 
              onClick={() => handleAnalysis()}
              className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 bg-[#00F5D4] text-[#0A2342] hover:scale-105 active:scale-95 p-3 rounded-xl transition shadow-lg font-black uppercase text-[10px]`}
              disabled={loading}
            >{loading ? '⏳' : labels.send}</button>
          </div>
        </div>
      </div>
      <div className={`flex flex-wrap gap-2 justify-center ${isRtl ? 'flex-row-reverse' : ''}`}>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => handleAnalysis(ex)} className="bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-full px-4 py-1.5 text-[9px] font-black text-slate-500 hover:text-[#00F5D4] transition shadow-inner">{ex}</button>
        ))}
      </div>
    </div>
  );
};

export default AIIntelligence;
