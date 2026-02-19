
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import HeatmapWidget from './HeatmapWidget';
import MarketSignals from './MarketSignals';
import { t } from '../translations';

const Dashboard: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  
  const [activeProjects, setActiveProjects] = useState(1248);
  const [priceIndex, setPriceIndex] = useState(84.2);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProjects(prev => prev + (Math.random() > 0.5 ? 2 : -2));
      setPriceIndex(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // Auto-load saved view if exists
    const saved = localStorage.getItem('aqtar_dashboard_view');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedRegion(data.selectedRegion);
      setActiveProjects(data.activeProjects);
      setPriceIndex(data.priceIndex);
    }
  }, []);

  const handleSaveView = () => {
    const viewData = {
      selectedRegion,
      activeProjects,
      priceIndex,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('aqtar_dashboard_view', JSON.stringify(viewData));
    alert(labels.viewSaved);
  };

  const handleLoadView = () => {
    const saved = localStorage.getItem('aqtar_dashboard_view');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedRegion(data.selectedRegion);
      setActiveProjects(data.activeProjects);
      setPriceIndex(data.priceIndex);
    } else {
      alert(isRtl ? "لا يوجد عرض محفوظ" : "No saved view found");
    }
  };

  const MarketTrendChart = () => {
    const pointsIndex = "0,80 20,60 40,70 60,40 80,50 100,30 120,40 140,20 160,30 180,10 200,20";
    const pointsProjects = "0,90 20,80 40,85 60,70 80,75 100,60 120,65 140,50 160,55 180,40 200,45";
    
    return (
      <div className="bg-[#1B263B] p-6 rounded-2xl border border-slate-800 shadow-xl h-60 flex flex-col group transition-all duration-300 hover:border-[#00F5D4]/30">
        <div className="flex justify-between items-center mb-4">
           <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-sky-400 ${isRtl ? 'arabic-font' : ''}`}>{labels.marketOverview}</h3>
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0ea5e9]"></span><span className="text-[8px] text-slate-500 font-bold">PROJECTS</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00F5D4]"></span><span className="text-[8px] text-slate-500 font-bold">PRICE INDEX</span></div>
           </div>
        </div>
        <div className="flex-1 w-full overflow-hidden relative">
          <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="20" x2="200" y2="20" stroke="white" strokeWidth="0.1" opacity="0.1" />
            <line x1="0" y1="50" x2="200" y2="50" stroke="white" strokeWidth="0.1" opacity="0.1" />
            <line x1="0" y1="80" x2="200" y2="80" stroke="white" strokeWidth="0.1" opacity="0.1" />
            
            <polyline fill="none" stroke="#00F5D4" strokeWidth="2.5" strokeLinejoin="round" points={pointsIndex} className="drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]" />
            <polyline fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinejoin="round" points={pointsProjects} className="drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
          </svg>
          <div className="absolute inset-0 flex justify-between pointer-events-none px-1 pt-1 opacity-20 text-[6px] font-mono text-slate-500">
             <div className="flex flex-col justify-between"><span>100</span><span>50</span><span>0</span></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-[7px] text-slate-600 font-black uppercase tracking-widest px-1">
           <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>NOW</span>
        </div>
      </div>
    );
  };

  const GrowthBarChart = () => {
    // Data for last 6 months
    const projectGrowth = [60, 65, 62, 70, 75, 80];
    const providerGrowth = [40, 42, 45, 48, 52, 55];
    const months = isRtl ? ['ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'] : ['DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'];

    return (
      <div className="bg-[#1B263B] p-6 rounded-2xl border border-slate-800 shadow-xl h-64 flex flex-col group transition-all duration-300 hover:border-[#94D2BD]/30">
        <div className="flex justify-between items-center mb-6">
           <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-400 ${isRtl ? 'arabic-font' : ''}`}>{labels.metrics6Months}</h3>
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2 h-4 bg-[#0ea5e9] rounded-sm"></span><span className="text-[8px] text-slate-500 font-bold">PROJECTS</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-4 bg-[#C9A66B] rounded-sm"></span><span className="text-[8px] text-slate-500 font-bold">PROVIDERS</span></div>
           </div>
        </div>
        <div className="flex-1 flex items-end justify-between gap-2 px-2">
          {months.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group/bar">
               <div className="w-full flex justify-center gap-1 items-end h-32 relative">
                  <div 
                    style={{ height: `${projectGrowth[i]}%` }}
                    className="w-3 bg-[#0ea5e9] rounded-t-sm transition-all duration-500 group-hover/bar:brightness-125"
                  />
                  <div 
                    style={{ height: `${providerGrowth[i]}%` }}
                    className="w-3 bg-[#C9A66B] rounded-t-sm transition-all duration-500 group-hover/bar:brightness-125"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[7px] text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-mono">
                    P: {projectGrowth[i]} | V: {providerGrowth[i]}
                  </div>
               </div>
               <span className="mt-2 text-[8px] text-slate-600 font-bold uppercase tracking-widest">{m}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700" id="main-dashboard-container">
      <div className="flex justify-between items-center bg-[#1B263B]/40 p-4 rounded-xl border border-slate-800">
        <h2 className={`text-sm font-black text-slate-400 uppercase tracking-widest ${isRtl ? 'arabic-font' : ''}`}>
          {isRtl ? 'نظرة عامة على السوق' : 'Market Performance Snapshot'}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={handleLoadView}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-400 transition-all"
          >
            📂 {labels.loadView}
          </button>
          <button 
            onClick={handleSaveView}
            className="px-4 py-2 bg-[#005F73] hover:bg-[#007085] border border-slate-700 rounded-lg text-[10px] font-black uppercase text-white transition-all shadow-lg"
          >
            💾 {labels.saveView}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard id="stat-projects" label={labels.activeProjects} value={activeProjects.toLocaleString()} trend="+12%" isRtl={isRtl} subLabel={labels.vsLastMonth} />
        <StatCard id="stat-price" label={labels.priceIndex} value={priceIndex.toString()} trend="+4.1%" isRtl={isRtl} subLabel={labels.vsLastMonth} />
        <StatCard id="stat-providers" label={labels.certifiedProviders} value="312" trend="Stable" isRtl={isRtl} subLabel={labels.vsLastMonth} />
        <StatCard id="stat-coverage" label={labels.lidarCoverage} value="24.8%" trend="+2.4%" isRtl={isRtl} subLabel={labels.vsLastMonth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <MarketTrendChart />
          <GrowthBarChart />
          <div id="dashboard-heatmap" className="flex-1">
            <HeatmapWidget 
              lang={lang} 
              type="Demand" 
              onRegionClick={(region) => setSelectedRegion(region === selectedRegion ? null : region)}
            />
          </div>
        </div>
        <div className="lg:col-span-1" id="dashboard-signals">
          <MarketSignals 
            lang={lang} 
            filterRegion={selectedRegion}
            onClearFilter={() => setSelectedRegion(null)}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ id?: string; label: string; value: string; trend: string; isRtl: boolean; subLabel: string }> = ({ id, label, value, trend, isRtl, subLabel }) => (
  <div id={id} className="bg-[#1B263B] p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-[#005F73]/50 transition-all duration-300 group">
    <div className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-widest group-hover:text-sky-400 transition-colors">{label}</div>
    <div className="text-3xl font-black text-white mb-2 font-mono">{value}</div>
    <div className={`text-[10px] ${trend.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'} font-black uppercase tracking-tighter`}>
      {trend} <span className="opacity-50 ml-1">{subLabel}</span>
    </div>
  </div>
);

export default Dashboard;
