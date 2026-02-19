
import React, { useState, useMemo } from 'react';
import { REGIONS_KSA, REGIONS_KSA_AR } from '../constants';
import { Language } from '../types';
import { t } from '../translations';

interface HeatmapWidgetProps {
  lang: Language;
  type: 'Demand' | 'Supply' | 'Coverage';
  selectedAOI?: string[];
  saturationFilter?: 'All' | 'Emerging' | 'Saturated';
  onRegionClick?: (region: string) => void;
  isDrawingMode?: boolean;
}

type MapLayer = 'satellite' | 'terrain' | 'street';

const HeatmapWidget: React.FC<HeatmapWidgetProps> = ({ lang, type, selectedAOI = [], saturationFilter = 'All', onRegionClick, isDrawingMode }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m' | 'custom'>('90d');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const [mapLayer, setMapLayer] = useState<MapLayer>('terrain');

  const axisLabels = useMemo(() => isRtl ? REGIONS_KSA_AR : REGIONS_KSA, [isRtl]);

  const getIntensity = (index: number, layerType?: string) => {
    const currentType = layerType || type;
    const seeds: Record<string, number[]> = {
      'Demand': [85, 42, 73, 21, 91, 55, 33, 12, 64, 48, 28, 37, 19],
      'Supply': [30, 88, 45, 67, 22, 95, 12, 55, 30, 40, 20, 10, 5],
      'Coverage': [55, 25, 99, 40, 60, 45, 80, 20, 60, 15, 33, 8, 44]
    };
    
    const baseSet = seeds[currentType as keyof typeof seeds] || seeds['Demand'];
    const baseValue = baseSet[index % baseSet.length];
    
    const timeMultipliers = { '7d': 0.8, '30d': 0.95, '90d': 1, '12m': 1.15, 'custom': 1.05 };
    const modifier = timeMultipliers[timeRange as keyof typeof timeMultipliers] || 1;
    
    return Math.min(100, Math.round(baseValue * modifier));
  };

  const getConfidence = (index: number) => {
    const confidences = [98, 92, 85, 94, 76, 88, 91, 65, 82, 90, 88, 72, 95];
    return confidences[index % confidences.length];
  };

  const getActivityVolume = (index: number) => {
    const volumes = [450, 120, 310, 85, 520, 240, 110, 45, 190, 330, 215, 90, 410];
    return volumes[index % volumes.length];
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 80}`).join(' ');
    return (
      <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00F5D4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M 0,100 L ${points} L 100,100 Z`} fill="url(#gradient-spark)" />
        <polyline fill="none" stroke="#00F5D4" strokeWidth="3" strokeLinejoin="round" points={points} className="drop-shadow-[0_0_5px_rgba(0,245,212,0.5)]" />
      </svg>
    );
  };

  const downloadReport = () => {
    const headers = "Region,Intensity,Confidence,Layer Type,Time Range\n";
    const rows = axisLabels.map((label, idx) => {
        const intensity = getIntensity(idx);
        const confidence = getConfidence(idx);
        return `"${label}",${intensity}%,${confidence}%,${type},${timeRange}`;
    }).join("\n");
    
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AQTAR_Heatmap_Report_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const layerOptions: {id: MapLayer, icon: string}[] = [
    { id: 'satellite', icon: '🛰️' },
    { id: 'terrain', icon: '⛰️' },
    { id: 'street', icon: '🛣️' }
  ];

  return (
    <div className={`bg-[#1B263B] rounded-xl border border-slate-800 overflow-hidden shadow-2xl h-full flex flex-col transition-all duration-700 ${mapLayer === 'satellite' ? 'bg-black' : mapLayer === 'street' ? 'bg-[#0f172a]' : ''}`}>
      <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center bg-slate-900/60 backdrop-blur-md relative z-20">
        <div className="flex flex-col">
          <h3 className={`font-black text-white text-base ${isRtl ? 'arabic-font' : ''}`}>
            {isRtl ? `${type === 'Demand' ? 'خريطة الطلب الجيومكاني' : type === 'Supply' ? 'توفر المستشعرات' : 'تغطية البيانات'}` : `${type} Market Heatmap`}
          </h3>
          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em] font-black">
            {isRtl ? 'تحليل كثافة السوق الموحد' : 'Unified Market Density Stream'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            {/* Map Layer Switcher */}
            <div className="flex gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800 shadow-inner group">
               {layerOptions.map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setMapLayer(opt.id)}
                   title={labels[opt.id]}
                   className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${mapLayer === opt.id ? 'bg-[#005F73] text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                 >
                   <span className="text-sm">{opt.icon}</span>
                 </button>
               ))}
            </div>

            <div className="flex gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            {(['7d', '30d', '90d', '12m', 'custom'] as const).map(opt => (
                <button 
                key={opt}
                onClick={() => setTimeRange(opt)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-md transition-all ${timeRange === opt ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                {opt}
                </button>
            ))}
            </div>

            {timeRange === 'custom' && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 bg-slate-950/40 p-1 rounded-xl border border-slate-800">
                    <input 
                        type="date" 
                        value={customDates.start}
                        onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                        className="bg-transparent border-none text-[10px] px-2 py-1 outline-none text-white focus:text-sky-400"
                    />
                    <span className="text-slate-700 text-[10px]">→</span>
                    <input 
                        type="date" 
                        value={customDates.end}
                        onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                        className="bg-transparent border-none text-[10px] px-2 py-1 outline-none text-white focus:text-sky-400"
                    />
                </div>
            )}

            <button 
                onClick={downloadReport}
                className="px-5 py-2.5 bg-[#005F73]/20 border border-[#005F73] text-[#94D2BD] text-[10px] font-black rounded-xl hover:bg-[#005F73] hover:text-white transition-all uppercase tracking-widest shadow-xl active:scale-95"
            >
                {labels.downloadReport}
            </button>
        </div>
      </div>

      <div className={`flex-1 p-8 relative overflow-y-auto custom-scrollbar ${mapLayer === 'satellite' ? 'opacity-90' : 'bg-slate-900/30'} ${isDrawingMode ? 'cursor-crosshair' : ''}`}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {axisLabels.map((label, idx) => {
            const currentIntensity = getIntensity(idx);
            const demandIntensity = getIntensity(idx, 'Demand');
            const supplyIntensity = getIntensity(idx, 'Supply');
            const coverageIntensity = getIntensity(idx, 'Coverage');
            const confidence = getConfidence(idx);
            const volume = getActivityVolume(idx);
            
            const matchesSaturation = saturationFilter === 'All' || 
              (saturationFilter === 'Saturated' && currentIntensity > 60) || 
              (saturationFilter === 'Emerging' && currentIntensity <= 60);
            
            const isSelected = (selectedAOI.length === 0 || selectedAOI.includes(REGIONS_KSA[idx])) && matchesSaturation;
            
            return (
              <div
                key={label}
                onMouseEnter={() => setHoveredRegion(idx)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionClick?.(REGIONS_KSA[idx])}
                className={`relative p-5 rounded-2xl border transition-all duration-500 group ${
                  isSelected ? 'border-slate-800 bg-slate-900/70 hover:border-[#94D2BD] hover:bg-slate-900/90 shadow-lg hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(148,210,189,0.1)]' : 'border-slate-800/20 bg-slate-900/10 opacity-20 pointer-events-none'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[11px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'arabic-font' : ''}`}>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full border ${confidence > 90 ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' : 'text-amber-400 bg-amber-400/5 border-amber-400/20'}`}>{confidence}%</span>
                    <span className="text-sm font-mono text-sky-400 font-black">{currentIntensity}%</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-0.5 shadow-inner relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(148,210,189,0.2)]"
                    style={{ 
                      width: `${currentIntensity}%`, 
                      backgroundColor: type === 'Coverage' ? '#94D2BD' : currentIntensity > 80 ? '#C9A66B' : currentIntensity > 40 ? '#94D2BD' : '#005F73'
                    }}
                  ></div>
                  {hoveredRegion === idx && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
                  )}
                </div>

                {hoveredRegion === idx && isSelected && (
                  <div className={`absolute z-40 ${isRtl ? 'right-0' : 'left-0'} -top-52 bg-[#0A2342]/95 backdrop-blur-2xl border border-[#94D2BD]/50 px-6 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none min-w-[280px] animate-in fade-in zoom-in-95 duration-300`}>
                    <div className="text-xs font-black text-white mb-4 flex justify-between items-center border-b border-slate-800/50 pb-3">
                      <span className="uppercase tracking-[0.2em]">{label} Insights</span>
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-[0.2em] font-black animate-pulse">Live</span>
                    </div>
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">7-Day Intensity Profile</span>
                        <span className="text-[8px] font-mono text-emerald-400">+12.4%</span>
                      </div>
                      <Sparkline data={[60, 75, 65, 80, 70, currentIntensity]} />
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                      <MetricItem label={labels.confidence} value={`${confidence}%`} color="text-emerald-400" />
                      <MetricItem label={isRtl ? 'حجم النشاط' : 'Activity Vol'} value={volume} color="text-white font-mono" />
                      <MetricItem label={isRtl ? 'الطلب' : 'Demand'} value={`${demandIntensity}%`} color="text-sky-400" />
                      <MetricItem label={isRtl ? 'العرض' : 'Supply'} value={`${supplyIntensity}%`} color="text-sky-400" />
                      <MetricItem label={labels.coverage} value={`${coverageIntensity}%`} color="text-[#94D2BD]" />
                      <MetricItem label={isRtl ? 'المزودين' : 'Providers'} value={Math.floor(volume/15)} color="text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black flex flex-wrap gap-6 justify-between items-center relative z-20">
        <div className="flex gap-6">
            <span className="flex items-center gap-2">🛡️ <span className="opacity-50">{labels.sourceAttribution}:</span> <span className="text-slate-300">GASGI + IOT SENSORS</span></span>
            <span className="flex items-center gap-2">📅 <span className="opacity-50">{labels.freshness}:</span> <span className="text-slate-300">Daily Refresh</span></span>
            <span className="flex items-center gap-2">⚡ <span className="opacity-50">{labels.frequency}:</span> <span className="text-slate-300">Continuous Sync</span></span>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-sky-600 font-mono px-2 py-1 bg-sky-600/5 border border-sky-900/30 rounded-lg">Confidence: 94.2%</span>
           <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
        </div>
      </div>
    </div>
  );
};

const MetricItem = ({ label, value, color }: any) => (
  <div className="space-y-0.5">
    <div className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em]">{label}</div>
    <div className={`text-[11px] ${color} font-black`}>{value}</div>
  </div>
);

export default HeatmapWidget;
