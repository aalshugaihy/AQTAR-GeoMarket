
import React from 'react';
import { Language } from '../types';
import { t } from '../translations';
import { COLORS } from '../constants';

const LandingPage: React.FC<{ lang: Language; onGetStarted: () => void }> = ({ lang, onGetStarted }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="w-[800px] h-[800px] bg-[#94D2BD] rounded-full blur-[120px] absolute -top-40 -left-40"></div>
          <div className="w-[600px] h-[600px] bg-[#005F73] rounded-full blur-[120px] absolute -bottom-20 -right-20"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 mb-8 animate-bounce">
            <span className="text-xl">🚀</span>
            <span className={`text-xs font-bold text-[#94D2BD] uppercase tracking-widest ${isRtl ? 'arabic-font' : ''}`}>
              {isRtl ? 'مدعوم من الذكاء الاصطناعي' : 'Powered by AI'}
            </span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-black mb-8 leading-[1.1] ${isRtl ? 'arabic-font' : ''}`}>
            {isRtl ? (
              <>
                <span className="text-white">منصة الذكاء العقاري </span>
                <br />
                <span className="text-[#00F5D4]">للمستثمرين المحترفين</span>
              </>
            ) : labels.landingHero}
          </h1>
          
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            {labels.landingSub}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-[#00F5D4] text-[#0A2342] font-black rounded-2xl shadow-[0_0_30px_rgba(0,245,212,0.3)] hover:scale-105 transition-all duration-300 uppercase tracking-widest text-sm"
            >
              {labels.startFree}
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-slate-700 text-white font-black rounded-2xl hover:bg-slate-800/50 transition-all duration-300 uppercase tracking-widest text-sm">
              {labels.viewDemo}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto px-6">
        <StatItem label={labels.marketSize} value="$132B" isRtl={isRtl} />
        <StatItem label={labels.annualGrowth} value="14%" isRtl={isRtl} />
        <StatItem label={labels.activeUsers} value="287" isRtl={isRtl} />
      </section>

      {/* Visual Teaser */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl aspect-video group">
           <img 
             src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-1000"
             alt="Real Estate Concept" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342] via-transparent to-transparent"></div>
           <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
              <div className="space-y-2">
                 <div className="w-12 h-1.5 bg-[#00F5D4] rounded-full"></div>
                 <h4 className="text-2xl font-black text-white">Insight-Driven Analysis</h4>
              </div>
              <div className="px-6 py-3 bg-[#0A2342]/80 backdrop-blur-xl rounded-2xl border border-slate-700">
                 <span className="text-[#94D2BD] font-mono font-bold tracking-widest">LIVE_DASHBOARD_V4.2</span>
              </div>
           </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className={`text-4xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.coreServices}</h2>
          <p className="text-slate-500 font-medium">{labels.coreServicesSub}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon="📈" 
            title={labels.service1Title} 
            desc={labels.service1Desc} 
            features={isRtl ? ['تحديث لحظي للأسعار', 'تصفية متقدمة', 'مقارنات فورية'] : ['Real-time prices', 'Advanced filtering', 'Instant comparisons']}
            isRtl={isRtl} 
          />
          <ServiceCard 
            icon="📍" 
            title={labels.service2Title} 
            desc={labels.service2Desc} 
            features={isRtl ? ['خرائط حرارية للأسعار', 'تحليل القرب من الخدمات', 'تصور ثلاثي الأبعاد'] : ['Price heatmaps', 'Proximity analysis', '3D Visualization']}
            isRtl={isRtl} 
          />
          <ServiceCard 
            icon="🤖" 
            title={labels.service3Title} 
            desc={labels.service3Desc} 
            features={isRtl ? ['تقييم فوري للعقارات', 'توقع الأسعار', 'تحليل المشاعر'] : ['Instant valuation', 'Price forecasting', 'Sentiment analysis']}
            isRtl={isRtl} 
          />
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ label, value, isRtl }: any) => (
  <div className="text-center space-y-2 group">
    <div className="text-5xl font-black text-[#00F5D4] group-hover:scale-110 transition duration-300">{value}</div>
    <div className={`text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] ${isRtl ? 'arabic-font' : ''}`}>{label}</div>
  </div>
);

const ServiceCard = ({ icon, title, desc, features, isRtl }: any) => (
  <div className="bg-[#1B263B] p-8 rounded-3xl border border-slate-800 hover:border-[#94D2BD] transition-all duration-500 group shadow-xl flex flex-col h-full">
    <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">{icon}</div>
    <h3 className={`text-xl font-black text-white mb-4 ${isRtl ? 'arabic-font' : ''}`}>{title}</h3>
    <p className="text-sm text-slate-400 mb-8 flex-1">{desc}</p>
    <div className="space-y-3">
      {features.map((f: string, i: number) => (
        <div key={i} className={`flex items-center gap-3 text-xs font-bold text-[#94D2BD] ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
           <span>✓</span>
           <span>{f}</span>
        </div>
      ))}
    </div>
  </div>
);

export default LandingPage;
