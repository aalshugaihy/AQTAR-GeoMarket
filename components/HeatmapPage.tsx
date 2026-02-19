
import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import { REGIONS_KSA, REGIONS_KSA_AR } from '../constants';
import HeatmapWidget from './HeatmapWidget';
import { t } from '../translations';

const HeatmapPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  
  const [activeLayer, setActiveLayer] = useState<'Demand' | 'Supply' | 'Coverage'>(() => {
    const saved = localStorage.getItem('aqtar_heatmap_layer');
    return (saved as any) || 'Demand';
  });

  const [selectedAOI, setSelectedAOI] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawPoints, setDrawPoints] = useState<number>(0);
  const [saturationFilter, setSaturationFilter] = useState<'All' | 'Emerging' | 'Saturated'>('All');

  useEffect(() => {
    localStorage.setItem('aqtar_heatmap_layer', activeLayer);
  }, [activeLayer]);

  const filteredRegionsList = useMemo(() => {
    return REGIONS_KSA.filter((reg, idx) => {
      const search = searchTerm.toLowerCase();
      return reg.toLowerCase().includes(search) || REGIONS_KSA_AR[idx].includes(search);
    });
  }, [searchTerm]);

  const toggleRegion = (reg: string) => {
    setSelectedAOI(prev => 
      prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]
    );
  };

  const handleSelectAll = () => {
    if (selectedAOI.length === REGIONS_KSA.length) {
      setSelectedAOI([]);
    } else {
      setSelectedAOI([...REGIONS_KSA]);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => direction === 'in' ? Math.min(prev + 0.1, 1.5) : Math.max(prev - 0.1, 0.8));
  };

  const handleDrawAction = () => {
    if (!isDrawingMode) {
      setIsDrawingMode(true);
      setDrawPoints(0);
    } else {
      // Simulate simplification logic
      if (drawPoints > 3) {
        const randoms = [...REGIONS_KSA].sort(() => 0.5 - Math.random()).slice(0, 3);
        setSelectedAOI(randoms);
        alert(isRtl ? "تم تبسيط المضلع وتحديد مناطق الاهتمام" : "Polygon simplified. AOI defined.");
      }
      setIsDrawingMode(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1B263B]/40 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <div>
           <h2 className={`text-2xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>
             {isRtl ? 'المركز الجيومكاني المتقدم' : 'Advanced Geospatial Hub'}
           </h2>
           <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.3em] flex items-center gap-2 font-bold">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             {isRtl ? 'ذكاء السوق الفوري للمملكة' : 'Real-time KSA Market Intelligence'}
           </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['Demand', 'Supply', 'Coverage'] as const).map(layer => (
              <button 
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-4 py-2 text-[10px] rounded-lg transition-all duration-300 font-black uppercase tracking-widest ${activeLayer === layer ? 'bg-[#005F73] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {isRtl ? (layer === 'Demand' ? 'الطلب' : layer === 'Supply' ? 'العرض' : 'التغطية') : layer}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1 bg-[#0D1B2A] rounded-2xl border border-slate-800 p-6 flex flex-col h-[650px] shadow-2xl overflow-hidden">
           <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isRtl ? 'تصفية المناطق' : 'Region Filter'}</h3>
                <button 
                  onClick={handleSelectAll}
                  className="text-[9px] text-sky-400 hover:underline font-bold uppercase tracking-tighter"
                >
                  {selectedAOI.length === REGIONS_KSA.length ? (isRtl ? 'إلغاء الكل' : 'Deselect All') : labels.selectAll}
                </button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={labels.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 transition-all ${isRtl ? 'text-right' : ''}`}
                />
                <span className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-3' : 'right-3'} opacity-30`}>🔍</span>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={handleDrawAction}
                  className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all ${isDrawingMode ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                >
                  {isDrawingMode ? `🖱️ ${labels.stopDrawing} (${drawPoints})` : `📐 ${labels.drawAOI}`}
                </button>
                {isDrawingMode && (
                  <div className="text-[8px] text-amber-500 font-bold uppercase text-center px-2 animate-pulse">
                    Complexity: {drawPoints < 5 ? 'Low (Auto-Simplify)' : 'High (Need Reduction)'}
                  </div>
                )}
              </div>
           </div>
           
           <div className="space-y-1.5 overflow-y-auto flex-1 pr-2 custom-scrollbar border-t border-slate-800 pt-4">
              {filteredRegionsList.map((reg) => {
                const idx = REGIONS_KSA.indexOf(reg);
                return (
                  <button
                    key={reg}
                    onClick={() => toggleRegion(reg)}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 group ${
                      selectedAOI.includes(reg) 
                        ? 'bg-sky-600/10 border-sky-500 text-white' 
                        : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600'
                    } ${isRtl ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <span className={`text-xs font-bold ${isRtl ? 'arabic-font' : ''}`}>
                      {isRtl ? REGIONS_KSA_AR[idx] : reg}
                    </span>
                    {selectedAOI.includes(reg) && <span className="text-sky-400 text-xs">✓</span>}
                  </button>
                );
              })}
           </div>

           <div className="mt-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 shadow-inner">
              <div className="flex justify-between items-center">
                 <span className="text-[9px] text-slate-500 uppercase font-black">Saturation</span>
                 <span className="text-[9px] font-mono text-sky-400">{saturationFilter}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[9px] text-slate-500 uppercase font-black">AOI Count</span>
                 <span className="text-xs font-mono text-white">{selectedAOI.length}</span>
              </div>
           </div>
        </div>

        <div className="xl:col-span-3 h-[650px] group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
          <div 
            className={`h-full w-full transition-all duration-700 ${isDrawingMode ? 'cursor-crosshair' : ''}`}
            onClick={() => isDrawingMode && setDrawPoints(p => p + 1)}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <HeatmapWidget 
              lang={lang} 
              type={activeLayer} 
              selectedAOI={selectedAOI} 
              saturationFilter={saturationFilter}
            />
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
             <button onClick={() => handleZoom('in')} className="w-10 h-10 bg-[#0A2342]/80 backdrop-blur rounded-xl text-white hover:bg-[#005F73] shadow-xl flex items-center justify-center font-black transition-all">＋</button>
             <button onClick={() => handleZoom('out')} className="w-10 h-10 bg-[#0A2342]/80 backdrop-blur rounded-xl text-white hover:bg-[#005F73] shadow-xl flex items-center justify-center font-black transition-all">－</button>
          </div>
          
          <div className="absolute top-6 right-6 p-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl z-20 shadow-xl min-w-[180px]">
             <div className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest text-center">{isRtl ? 'درجة التشبع' : 'Saturation Filter'}</div>
             <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setSaturationFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${saturationFilter === 'All' ? 'bg-[#005F73] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {labels.all}
                </button>
                <div className="relative group/tip">
                  <button 
                    onClick={() => setSaturationFilter('Emerging')}
                    className={`w-full px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${saturationFilter === 'Emerging' ? 'bg-[#94D2BD] text-[#0A2342]' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {isRtl ? 'ناشئة' : 'Emerging'}
                  </button>
                  <div className="absolute right-full top-0 mr-2 w-48 p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-400 opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                    {labels.emergingTip}
                  </div>
                </div>
                <div className="relative group/tip">
                  <button 
                    onClick={() => setSaturationFilter('Saturated')}
                    className={`w-full px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${saturationFilter === 'Saturated' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {isRtl ? 'متشبعة' : 'Saturated'}
                  </button>
                  <div className="absolute right-full top-0 mr-2 w-48 p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-400 opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                    {labels.saturatedTip}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
