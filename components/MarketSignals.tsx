
import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface MarketSignalsProps {
  lang: Language;
  filterRegion?: string | null;
  onClearFilter?: () => void;
}

const MarketSignals: React.FC<MarketSignalsProps> = ({ lang, filterRegion, onClearFilter }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [impactFilter, setImpactFilter] = useState<string>('All');
  const [catFilters, setCatFilters] = useState<string[]>(['All']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const categories = ['Tenders', 'Regulation', 'Trends', 'Standards'];
  
  const signals = [
    { titleEn: "NEOM Phase 2 Surveying RFQ", titleAr: "طلب عروض مسح نيوم - المرحلة الثانية", impact: "High", color: "bg-red-500", region: "Tabuk", category: "Tenders" },
    { titleEn: "New UAV Regulation in Riyadh", titleAr: "تنظيمات طائرات الدرون الجديدة بالرياض", impact: "Medium", color: "bg-yellow-500", region: "Riyadh", category: "Regulation" },
    { titleEn: "Mobile Mapping Demand Surge", titleAr: "ارتفاع الطلب على الخرائط المتنقلة", impact: "High", color: "bg-red-500", region: "Eastern Province", category: "Trends" },
    { titleEn: "Bathymetry Standard Updates", titleAr: "تحديث معايير المسح الهيدروغرافي", impact: "Low", color: "bg-blue-500", region: "Makkah", category: "Standards" },
    { titleEn: "Infrastructure expansion in Madinah", titleAr: "توسع في البنية التحتية بالمدينة المنورة", impact: "Medium", color: "bg-yellow-500", region: "Madinah", category: "Trends" },
  ];

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setCatFilters(['All']);
    } else {
      setCatFilters(prev => {
        const next = prev.includes(cat) 
          ? prev.filter(c => c !== cat) 
          : [...prev.filter(c => c !== 'All'), cat];
        return next.length === 0 ? ['All'] : next;
      });
    }
  };

  const filteredSignals = useMemo(() => {
    return signals.filter(s => {
      const matchesSearch = s.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.titleAr.includes(searchTerm);
      const matchesRegion = !filterRegion || s.region === filterRegion;
      const matchesImpact = impactFilter === 'All' || s.impact === impactFilter;
      const matchesCat = catFilters.includes('All') || catFilters.includes(s.category);
      return matchesSearch && matchesRegion && matchesImpact && matchesCat;
    });
  }, [searchTerm, filterRegion, impactFilter, catFilters]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return signals
      .filter(s => s.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || s.titleAr.includes(searchTerm))
      .slice(0, 3);
  }, [searchTerm]);

  return (
    <div className="bg-[#1B263B] rounded-xl border border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-slate-800 bg-slate-900/40 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className={`font-black text-xs uppercase tracking-widest text-white ${isRtl ? 'arabic-font' : ''}`}>
            {isRtl ? 'إشارات السوق الرائجة' : 'Trending Market Signals'}
          </h3>
          {filterRegion && (
            <button 
              onClick={onClearFilter}
              className="text-[9px] text-sky-400 font-black uppercase tracking-widest hover:underline"
            >
              {isRtl ? 'مسح التصفية' : 'Clear Filter'}
            </button>
          )}
        </div>
        
        {!filterRegion && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{labels.impact}</span>
              <div className="flex gap-2">
                {['All', 'High', 'Medium', 'Low'].map(imp => (
                  <button
                    key={imp}
                    onClick={() => setImpactFilter(imp)}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                      impactFilter === imp 
                        ? 'bg-sky-600 border-sky-500 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {imp}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{labels.category}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCategory('All')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                    catFilters.includes('All') 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {labels.all}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                      catFilters.includes(cat) 
                        ? 'bg-emerald-600 border-emerald-500 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="relative mt-2">
          <input 
            type="text" 
            placeholder={isRtl ? "بحث في الإشارات..." : "Search signals..."}
            value={searchTerm}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-10 py-3 text-[10px] text-white focus:outline-none focus:border-sky-500 transition-all ${isRtl ? 'text-right arabic-font' : ''}`}
          />
          <span className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'} text-slate-600 text-[10px]`}>🔍</span>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-slate-900 border border-slate-700 rounded-b-xl mt-px z-50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setSearchTerm(isRtl ? s.titleAr : s.titleEn)}
                  className="w-full text-left p-3 hover:bg-slate-800 text-[10px] text-slate-300 border-b border-slate-800 last:border-0"
                >
                  {isRtl ? s.titleAr : s.titleEn}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {filterRegion && (
          <div className="text-[9px] text-sky-400 font-mono uppercase animate-in slide-in-from-top-1 duration-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            {isRtl ? 'تصفية حسب المنطقة:' : 'Filtering region:'} {filterRegion}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {filteredSignals.length > 0 ? filteredSignals.map((signal, idx) => (
          <div key={idx} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-all group cursor-pointer hover:bg-slate-900/80">
            <div className="flex justify-between items-center mb-3">
              <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase ${signal.color} text-white shadow-lg`}>
                {isRtl ? (signal.impact === 'High' ? 'عالي' : signal.impact === 'Medium' ? 'متوسط' : 'عادي') : signal.impact} Impact
              </span>
              <span className="text-[9px] text-slate-500 font-mono font-bold">2H AGO</span>
            </div>
            <p className={`text-sm text-slate-200 group-hover:text-white transition-colors font-medium mb-3 leading-relaxed ${isRtl ? 'arabic-font' : ''}`}>
              {isRtl ? signal.titleAr : signal.titleEn}
            </p>
            <div className="flex justify-between items-center border-t border-slate-800/50 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-[10px]">📍</span>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">{signal.region}</span>
              </div>
              <div className="text-[9px] text-sky-500 font-black uppercase tracking-widest bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">
                {signal.category}
              </div>
            </div>
          </div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center py-20 text-slate-600 opacity-40">
            <span className="text-4xl mb-4">📭</span>
            <div className="text-[10px] font-black uppercase tracking-[0.3em]">
              {isRtl ? "لا توجد إشارات مطابقة" : "No matching signals"}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#005F73]/10 border-t border-slate-800">
        <button className={`w-full py-3.5 bg-[#005F73] hover:bg-[#007085] rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 ${isRtl ? 'arabic-font' : ''}`}>
          {isRtl ? 'مشاهدة جميع الإشارات' : 'View All Signals'}
        </button>
      </div>
    </div>
  );
};

export default MarketSignals;
