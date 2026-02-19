
import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import { DEVICES, Device } from '../constants';
import { t } from '../translations';

type LeadTimeRange = 'All' | '1w' | '1-2w' | '2-4w' | '4w+' | 'Custom';

const WISHLIST_KEY = 'aqtar_device_wishlist';
const RATINGS_KEY = 'aqtar_device_ratings';
const STOCK_ALERTS_KEY = 'aqtar_stock_alerts';
const LEAD_TIME_FILTER_KEY = 'aqtar_lead_time_filter';
const CUSTOM_LEAD_WEEKS_KEY = 'aqtar_custom_lead_weeks';

const DeviceCatalog: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  
  // Filters State
  const [categories, setCategories] = useState<string[]>(['All']);
  const [sensors, setSensors] = useState<string[]>(['All']);
  const [priceTier, setPriceTier] = useState<'All' | 'High' | 'Mid' | 'Low'>('All');
  const [accuracyFilter, setAccuracyFilter] = useState<string>('All');
  const [leadTimeFilter, setLeadTimeFilter] = useState<LeadTimeRange>(() => {
    const saved = localStorage.getItem(LEAD_TIME_FILTER_KEY);
    return (saved as LeadTimeRange) || 'All';
  });
  const [maxLeadWeeks, setMaxLeadWeeks] = useState<number>(() => {
    const saved = localStorage.getItem(CUSTOM_LEAD_WEEKS_KEY);
    return saved ? parseInt(saved) : 12;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  
  // Persistence States
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [stockAlerts, setStockAlerts] = useState<Record<number, number>>({});

  // UI Local States
  const [stockAlertItem, setStockAlertItem] = useState<Device | null>(null);
  const [alertThreshold, setAlertThreshold] = useState<number>(5);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [restockNotifiedId, setRestockNotifiedId] = useState<number | null>(null);

  useEffect(() => {
    // Initial Load
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (savedWishlist) try { setWishlist(JSON.parse(savedWishlist)); } catch (e) {}
    
    const savedRatings = localStorage.getItem(RATINGS_KEY);
    if (savedRatings) try { setRatings(JSON.parse(savedRatings)); } catch (e) {}
    
    const savedAlerts = localStorage.getItem(STOCK_ALERTS_KEY);
    if (savedAlerts) try { setStockAlerts(JSON.parse(savedAlerts)); } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LEAD_TIME_FILTER_KEY, leadTimeFilter);
  }, [leadTimeFilter]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_LEAD_WEEKS_KEY, maxLeadWeeks.toString());
  }, [maxLeadWeeks]);

  const toggleWishlist = (id: number) => {
    const next = wishlist.includes(id) ? wishlist.filter(i => i !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('aqtar_wishlist_updated'));
  };

  const handleRating = (id: number, score: number) => {
    const next = { ...ratings, [id]: score };
    setRatings(next);
    localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
  };

  const handleSaveStockAlert = () => {
    if (!stockAlertItem) return;
    const next = { ...stockAlerts, [stockAlertItem.id]: alertThreshold };
    setStockAlerts(next);
    localStorage.setItem(STOCK_ALERTS_KEY, JSON.stringify(next));
    setAlertSuccess(true);
    setTimeout(() => {
      setStockAlertItem(null);
      setAlertSuccess(false);
    }, 2000);
  };

  const handleNotifyMe = (id: number) => {
    setRestockNotifiedId(id);
    setTimeout(() => setRestockNotifiedId(null), 4000);
  };

  const filteredDevices = useMemo(() => {
    return DEVICES.filter(d => {
      const matchesCat = categories.includes('All') || categories.includes(d.category);
      const matchesSensor = sensors.includes('All') || sensors.includes(d.sensorType);
      const matchesPrice = priceTier === 'All' || d.price === priceTier;
      const matchesAccuracy = accuracyFilter === 'All' || d.accuracyClass === accuracyFilter;
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.arName.includes(searchTerm);
      const matchesWishlist = !showWishlistOnly || wishlist.includes(d.id);
      
      const weeks = d.leadTimeWeeks || 0;
      let matchesLead = true;
      if (leadTimeFilter === '1w') matchesLead = weeks <= 1;
      else if (leadTimeFilter === '1-2w') matchesLead = weeks > 1 && weeks <= 2;
      else if (leadTimeFilter === '2-4w') matchesLead = weeks > 2 && weeks <= 4;
      else if (leadTimeFilter === '4w+') matchesLead = weeks > 4;
      else if (leadTimeFilter === 'Custom') matchesLead = weeks <= maxLeadWeeks;

      return matchesCat && matchesPrice && matchesSearch && matchesSensor && matchesAccuracy && matchesLead && matchesWishlist;
    });
  }, [categories, priceTier, sensors, accuracyFilter, leadTimeFilter, maxLeadWeeks, searchTerm, wishlist, showWishlistOnly]);

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-500">
      {/* Filters Header */}
      <div className="bg-[#1B263B]/60 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <h2 className={`text-3xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.devices}</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{isRtl ? "نظم الاستشعار والمساحة المعتمدة" : "Certified Surveying Systems"}</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input 
              type="text" placeholder={labels.search} value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 md:w-80 bg-slate-900 border border-slate-700 rounded-2xl px-10 py-3.5 text-sm text-white focus:border-[#00F5D4] outline-none shadow-inner ${isRtl ? 'text-right' : ''}`}
            />
            <button 
              id="wishlist-filter-toggle"
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`px-6 py-3.5 rounded-2xl text-[10px] font-black transition-all border ${showWishlistOnly ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
            >
              ❤️ {wishlist.length} {labels.wishlistOnly}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <MultiSelect label={labels.category} options={['All', 'GNSS', 'Total Station', 'UAV LiDAR']} selected={categories} onToggle={(v: string) => toggleMultiSelect(v, categories, setCategories)} />
          <MultiSelect label={labels.sensorType} options={['All', 'RGB', 'LiDAR', 'Thermal', 'Multispectral', 'GNSS', 'Optical']} selected={sensors} onToggle={(v: string) => toggleMultiSelect(v, sensors, setSensors)} />
          <FilterSelect label={labels.priceTier} options={['All', 'High', 'Mid', 'Low']} value={priceTier} onChange={(v: any) => setPriceTier(v)} />
          <FilterSelect label={labels.accuracyClass} options={['All', 'High', 'Medium', 'Entry']} value={accuracyFilter} onChange={setAccuracyFilter} />
          
          <div className="flex flex-col gap-3">
             <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest px-1">{labels.leadTime}</span>
             <select 
               value={leadTimeFilter} 
               onChange={(e) => setLeadTimeFilter(e.target.value as any)} 
               className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-[10px] text-slate-300 outline-none uppercase font-black shadow-inner focus:border-[#00F5D4] transition-all"
             >
                <option value="All">{labels.all}</option>
                <option value="1w">{labels.within1w}</option>
                <option value="1-2w">{labels.oneTwoW}</option>
                <option value="2-4w">{labels.twoFourW}</option>
                <option value="4w+">{labels.fourPlusW}</option>
                <option value="Custom">{labels.custom}</option>
             </select>
          </div>

          {leadTimeFilter === 'Custom' && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{labels.customRange}</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" min="1" max="52" 
                  value={maxLeadWeeks} 
                  onChange={(e) => setMaxLeadWeeks(parseInt(e.target.value) || 1)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white w-12 text-center focus:border-[#00F5D4] outline-none"
                />
                <input 
                  type="range" min="1" max="52" step="1"
                  value={maxLeadWeeks} 
                  onChange={(e) => setMaxLeadWeeks(parseInt(e.target.value))} 
                  className="flex-1 accent-[#00F5D4] cursor-pointer" 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredDevices.map(device => {
          const isSelected = compareList.includes(device.id);
          const isExpanded = expandedId === device.id;
          const rating = ratings[device.id] || 0;
          const isLowStock = device.stock > 0 && device.stock < 5;
          const isOutOfStock = device.stock === 0;
          const isInWishlist = wishlist.includes(device.id);
          
          return (
            <div key={device.id} className={`bg-[#1B263B] rounded-[3rem] border border-slate-800 overflow-hidden flex flex-col group hover:border-[#00F5D4]/40 transition-all duration-500 shadow-xl ${isSelected ? 'ring-2 ring-[#00F5D4]' : ''}`}>
              <div className="h-56 bg-slate-950/50 flex items-center justify-center relative cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : device.id)}>
                 <div className="text-7xl group-hover:scale-110 transition duration-700">{device.sensorType === 'LiDAR' ? '🛸' : device.sensorType === 'GNSS' ? '🛰️' : '🔭'}</div>
                 
                 {/* Wishlist Button */}
                 <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(device.id); }} 
                  className={`absolute bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center transition-all ${isInWishlist ? 'bg-rose-500 text-white shadow-lg scale-110' : 'bg-slate-900/80 text-slate-500 hover:text-rose-400'}`}
                 >
                   {isInWishlist ? '❤️' : '♡'}
                 </button>
                 
                 {/* Inventory Badges */}
                 <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                    {isOutOfStock ? (
                      <div className="px-3 py-1 bg-rose-950/40 text-rose-400 border border-rose-900 rounded-full text-[8px] font-black uppercase backdrop-blur-md">
                        {labels.outOfStock}
                      </div>
                    ) : isLowStock ? (
                      <div className="px-3 py-1 bg-amber-950/40 text-amber-400 border border-amber-900 rounded-full text-[8px] font-black uppercase backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        {labels.lowStock}
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-full text-[8px] font-black uppercase backdrop-blur-md">
                        {labels.stock}: {device.stock}
                      </div>
                    )}
                 </div>
              </div>

              <div className="p-9 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`font-black text-white text-xl ${isRtl ? 'arabic-font' : ''}`}>{isRtl ? device.arName : device.name}</h3>
                  <button onClick={() => setCompareList(p => p.includes(device.id) ? p.filter(x => x !== device.id) : p.length < 3 ? [...p, device.id] : p)} className={`px-4 py-2 rounded-full text-[9px] font-black border uppercase tracking-widest transition-all ${isSelected ? 'bg-[#00F5D4] text-[#0A2342] border-[#00F5D4]' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                    {isSelected ? labels.selected : labels.compare}
                  </button>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => (
                    <button 
                      key={s} 
                      onClick={() => handleRating(device.id, s)} 
                      className={`text-base transition-all ${s <= rating ? 'text-amber-400 scale-125' : 'text-slate-700 hover:text-amber-500'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-600 font-bold ml-3 self-center uppercase tracking-widest">
                    {labels.rating}: {rating}/5
                  </span>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] mb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-4 border-t border-slate-800">
                    <Prop label={labels.accuracy} value={device.specs.accuracy} tooltip={labels.accuracyTooltip} />
                    <Prop label={labels.sensorType} value={device.sensorType} />
                    <Prop label={labels.battery} value={device.specs.batteryLife} tooltip={labels.batteryTooltip} />
                    <Prop label={labels.leadTime} value={device.leadTimeLabel || labels.now} tooltip={labels.leadTimeTooltip} />
                    <Prop label={labels.weight} value={device.specs.weight} tooltip={labels.weightTooltip} />
                    <Prop label={labels.accuracyClass} value={device.accuracyClass} />
                  </div>
                </div>

                <div className="mt-auto space-y-4 pt-6 border-t border-slate-800/30">
                  {isOutOfStock ? (
                    <div className="space-y-3">
                      <button 
                        onClick={() => handleNotifyMe(device.id)} 
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 ${restockNotifiedId === device.id ? 'bg-emerald-500 text-white' : 'bg-[#00F5D4] text-[#0A2342]'}`}
                      >
                        {restockNotifiedId === device.id ? '✓ OK' : `🔔 ${labels.notifyMe}`}
                      </button>
                      {restockNotifiedId === device.id && (
                        <p className="text-[9px] text-emerald-400 font-bold text-center animate-in fade-in duration-300">
                          {labels.restockSuccess}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                       <button className="flex-1 py-4 bg-[#005F73] hover:bg-[#007085] rounded-2xl text-[10px] font-black uppercase text-white transition-all shadow-xl hover:scale-[1.02]">
                         {labels.requestQuote}
                       </button>
                       <button 
                        onClick={() => setStockAlertItem(device)}
                        title={labels.stockAlert}
                        className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all ${stockAlerts[device.id] ? 'bg-amber-500 border-amber-400 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                       >
                         {stockAlerts[device.id] ? '🔕' : '🔔'}
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Comparison Drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-6 animate-in slide-in-from-bottom-12 duration-700">
           <div className="bg-[#0A2342]/95 backdrop-blur-3xl border-2 border-[#00F5D4]/30 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent"></div>
              <button onClick={() => setCompareList([])} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition shadow-lg">✕</button>
              
              <div className="mb-8 flex items-center gap-4">
                 <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xl">🛡️</div>
                 <div>
                    <h4 className={`text-white text-lg font-black ${isRtl ? 'arabic-font' : ''}`}>{labels.compareDetailed}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Decision Support Matrix - GASGI Standards</p>
                 </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                 <div className="col-span-1 space-y-6 pt-16 pr-6 border-r border-slate-800">
                    <ComparisonLabel label={labels.accuracy} tooltip={labels.accuracyTooltip} />
                    <ComparisonLabel label={labels.battery} tooltip={labels.batteryTooltip} />
                    <ComparisonLabel label={labels.weight} tooltip={labels.weightTooltip} />
                    <ComparisonLabel label={labels.leadTime} tooltip={labels.leadTimeTooltip} />
                    <ComparisonLabel label={labels.rating} tooltip={labels.ratingTooltip} />
                 </div>
                 {compareList.map(cid => {
                   const d = DEVICES.find(x => x.id === cid)!;
                   return (
                     <div key={cid} className="col-span-1 space-y-6 text-center animate-in zoom-in-95">
                        <div className="h-10 text-xs font-black text-sky-400 flex items-center justify-center uppercase truncate bg-slate-900/40 rounded-xl px-4">{d.name}</div>
                        <ComparisonValue value={d.specs.accuracy} color="text-white" highlight tooltip={labels.accuracyTooltip} />
                        <ComparisonValue value={d.specs.batteryLife} color="text-slate-300" tooltip={labels.batteryTooltip} />
                        <ComparisonValue value={d.specs.weight} color="text-slate-300" tooltip={labels.weightTooltip} />
                        <ComparisonValue value={d.leadTimeLabel || labels.now} color="text-amber-500" tooltip={labels.leadTimeTooltip} />
                        <ComparisonValue value={`★ ${ratings[d.id] || 0}`} color="text-amber-400" tooltip={labels.ratingTooltip} />
                     </div>
                   );
                 })}
                 {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <div key={i} className="hidden md:flex col-span-1 border-2 border-dashed border-slate-800 rounded-3xl items-center justify-center text-slate-700 text-[10px] font-black uppercase tracking-widest italic opacity-40">
                      Slot Available
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Stock Alert Modal */}
      {stockAlertItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-lg animate-in fade-in duration-300">
           <div className="bg-[#1B263B] w-full max-w-md rounded-[3rem] border border-slate-700 p-10 shadow-2xl relative">
              <button onClick={() => setStockAlertItem(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-500 hover:text-white transition shadow-lg">✕</button>
              
              {alertSuccess ? (
                <div className="text-center py-12 animate-in zoom-in-95">
                  <div className="text-7xl mb-6">🔔</div>
                  <h3 className="text-2xl font-black text-white">{labels.alertSet}</h3>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Threshold Notification</div>
                    <h3 className={`text-2xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.stockAlert}</h3>
                    <p className="text-xs text-slate-400">Configure a custom threshold for <span className="text-sky-400 font-bold">{stockAlertItem.name}</span>. You will be alerted when stock falls below this quantity.</p>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{labels.stockAlertThreshold}</label>
                     <div className="flex items-center gap-6">
                        <input 
                           type="range" min="1" max="50" step="1"
                           value={alertThreshold}
                           onChange={e => setAlertThreshold(parseInt(e.target.value))}
                           className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="w-16 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl font-mono text-amber-500 font-black shadow-inner">
                           {alertThreshold}
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleSaveStockAlert}
                    className="w-full py-5 bg-amber-500 text-[#0A2342] font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl mt-4"
                  >
                    {labels.saveAlert}
                  </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const ComparisonLabel = ({ label, tooltip }: any) => (
  <div className="h-10 text-[10px] text-slate-500 font-black uppercase flex items-center gap-2 group cursor-help" title={tooltip}>
    <span className="truncate">{label}</span>
    <span className="opacity-30 group-hover:opacity-100 transition text-[8px]">ⓘ</span>
  </div>
);

const ComparisonValue = ({ value, color, highlight, tooltip }: any) => (
  <div title={tooltip} className={`h-10 text-[10px] font-bold ${color} ${highlight ? 'bg-[#005F73]/20 border border-[#005F73]/40' : 'bg-slate-900/50'} rounded-xl flex items-center justify-center px-1 truncate cursor-help`}>
    {value}
  </div>
);

const MultiSelect = ({ label, options, selected, onToggle }: any) => (
  <div className="flex flex-col gap-3">
    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest px-1">{label}</span>
    <div className="flex flex-wrap gap-2 p-2 bg-slate-800/80 border border-slate-700 rounded-xl min-h-[44px] shadow-inner">
      {options.map((o: string) => (
        <button 
          key={o} 
          onClick={() => onToggle(o)} 
          className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${selected.includes(o) ? 'bg-[#00F5D4] text-[#0A2342] shadow-md scale-105' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const toggleMultiSelect = (val: string, current: string[], setter: (v: string[]) => void) => {
  if (val === 'All') setter(['All']);
  else {
    let next = current.includes(val) ? current.filter(x => x !== val) : [...current.filter(x => x !== 'All'), val];
    if (next.length === 0) next = ['All'];
    setter(next);
  }
};

const FilterSelect = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-3">
    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest px-1">{label}</span>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-[10px] text-slate-300 outline-none uppercase font-black shadow-inner focus:border-[#00F5D4] transition-all"
    >
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Prop = ({ label, value, tooltip }: any) => (
  <div title={tooltip} className="group cursor-help">
    <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
      {label}
      <span className="opacity-30 group-hover:opacity-100 transition text-[6px]">ⓘ</span>
    </div>
    <div className="text-[11px] text-slate-300 font-bold truncate">{value}</div>
  </div>
);

export default DeviceCatalog;
