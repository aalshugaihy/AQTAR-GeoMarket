
import React from 'react';
import { Language } from '../types';
import { t } from '../translations';

const PricingPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 animate-in slide-in-from-bottom-10 duration-700">
      <div className="text-center space-y-4">
        <h2 className={`text-5xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.plans}</h2>
        <p className="text-slate-500 font-medium">{isRtl ? 'خطط مرنة تناسب كل الاحتياجات' : 'Flexible plans to suit every investment scale'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Starter Plan */}
        <div className="bg-[#1B263B] p-10 rounded-[2.5rem] border border-slate-800 flex flex-col shadow-xl">
           <div className="mb-8">
              <h3 className="text-2xl font-black text-white mb-2">{labels.starter}</h3>
              <div className="text-[#94D2BD] text-xs font-black uppercase tracking-widest">{labels.forIndividuals}</div>
           </div>
           <div className="mb-8">
              <div className="text-4xl font-black text-white">{labels.free}</div>
           </div>
           <ul className="space-y-4 mb-10 flex-1">
              <PricingFeature label={isRtl ? "لوحة التحكم الأساسية" : "Basic Dashboard"} />
              <PricingFeature label={isRtl ? "10 تقييمات شهرياً" : "10 Valuations/mo"} />
              <PricingFeature label={isRtl ? "خرائط حرارية" : "Heatmap Access"} />
              <PricingFeature label={isRtl ? "دعم بالبريد" : "Email Support"} />
           </ul>
           <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
             {labels.startNow}
           </button>
        </div>

        {/* Professional Plan */}
        <div className="bg-[#0A2342] p-10 rounded-[2.5rem] border-2 border-[#00F5D4] flex flex-col shadow-[0_0_60px_rgba(0,245,212,0.1)] relative scale-105 z-10">
           <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#00F5D4] text-[#0A2342] text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {labels.mostPopular}
           </div>
           <div className="mb-8">
              <h3 className="text-2xl font-black text-white mb-2">{labels.professional}</h3>
           </div>
           <div className="mb-8 flex items-baseline gap-2">
              <div className="text-4xl font-black text-white">1,870</div>
              <div className="text-sm text-slate-400 font-bold">{isRtl ? 'ر.س' : 'SAR'} / {labels.perMonth}</div>
           </div>
           <ul className="space-y-4 mb-10 flex-1">
              <PricingFeature label={isRtl ? "كل ميزات Starter" : "All Starter Features"} highlight />
              <PricingFeature label={isRtl ? "500 تقييم شهرياً" : "500 Valuations/mo"} highlight />
              <PricingFeature label={isRtl ? "إدارة المحافظ (50 عقار)" : "Portfolio Mgmt (50 Properties)"} highlight />
              <PricingFeature label={isRtl ? "تقارير مخصصة" : "Custom Reports"} highlight />
              <PricingFeature label={isRtl ? "دعم ذو أولوية" : "Priority Support"} highlight />
           </ul>
           <button className="w-full py-4 bg-[#00F5D4] text-[#0A2342] hover:scale-105 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(0,245,212,0.2)]">
             {labels.startNow}
           </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-[#1B263B] p-10 rounded-[2.5rem] border border-slate-800 flex flex-col shadow-xl">
           <div className="mb-8">
              <h3 className="text-2xl font-black text-white mb-2">{labels.enterprise}</h3>
           </div>
           <div className="mb-8">
              <div className="text-4xl font-black text-white">{labels.customQuote}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{isRtl ? 'حسب الطلب' : 'On Request'}</div>
           </div>
           <ul className="space-y-4 mb-10 flex-1">
              <PricingFeature label={isRtl ? "كل ميزات Professional" : "All Pro Features"} />
              <PricingFeature label={isRtl ? "تقييمات غير محدودة" : "Unlimited Valuations"} />
              <PricingFeature label="Full API Access" />
              <PricingFeature label="White-labeling" />
              <PricingFeature label={isRtl ? "مدير حساب مخصص" : "Account Manager"} />
           </ul>
           <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
             {labels.contactUs}
           </button>
        </div>
      </div>
      
      <div className="text-center pt-12">
        <h3 className={`text-3xl font-black text-white mb-4 ${isRtl ? 'arabic-font' : ''}`}>
           {isRtl ? 'جاهز لتحويل استثماراتك العقارية؟' : 'Ready to Transform Your Portfolio?'}
        </h3>
        <p className="text-slate-500 mb-8">{isRtl ? 'انضم الآن وابدأ التحليل الذكي لاستثماراتك' : 'Join now and start the intelligent analysis of your investments'}</p>
        <button className="px-10 py-4 bg-[#00F5D4] text-[#0A2342] font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-110 transition-all shadow-2xl">
           {labels.startFree}
        </button>
      </div>
    </div>
  );
};

const PricingFeature = ({ label, highlight }: any) => (
  <li className="flex items-center gap-3">
    <span className={`text-sm ${highlight ? 'text-[#00F5D4]' : 'text-[#94D2BD]'}`}>✓</span>
    <span className="text-xs text-slate-300 font-bold">{label}</span>
  </li>
);

export default PricingPage;
