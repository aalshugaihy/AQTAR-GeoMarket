
import React from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface ProfilePageProps {
  lang: Language;
  user: { name: string; email: string };
  onSignOut: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ lang, user, onSignOut }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-[#1B263B] p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5D4] opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#00F5D4] to-sky-600 flex items-center justify-center text-4xl font-black text-[#0A2342] shadow-2xl">
          {user.name.charAt(0)}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className={`text-4xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{user.name}</h2>
            <p className="text-slate-500 font-mono text-sm">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="px-4 py-2 bg-[#005F73]/20 border border-[#005F73] rounded-xl text-[#94D2BD] text-[10px] font-black uppercase tracking-widest">
                Tier: Enterprise Pro
             </div>
             <div className="px-4 py-2 bg-emerald-900/20 border border-emerald-800 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                Status: Active
             </div>
          </div>
        </div>
        
        <button 
          onClick={onSignOut}
          className="px-8 py-3 bg-rose-500/10 border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          {labels.signOut}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1B263B] p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
           <h3 className={`text-xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.userSettings}</h3>
           <div className="space-y-4">
              <ProfileSetting label="Default Language" value={lang === 'AR' ? 'Arabic' : 'English'} />
              <ProfileSetting label="Region Tracking" value="Riyadh, NEOM" />
              <ProfileSetting label="Notifications" value="Enabled" />
           </div>
        </div>

        <div className="bg-[#1B263B] p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
           <h3 className={`text-xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>Platform Activity</h3>
           <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs">
                 <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                 <span className="text-slate-400">Viewed Device Catalog</span>
                 <span className="text-slate-600 ml-auto font-mono">10m ago</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-slate-400">Generated Market AI Report</span>
                 <span className="text-slate-600 ml-auto font-mono">2h ago</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                 <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                 <span className="text-slate-400">Exported Heatmap CSV</span>
                 <span className="text-slate-600 ml-auto font-mono">Yesterday</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSetting = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center pb-4 border-b border-slate-800 last:border-0">
    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
    <span className="text-xs text-white font-bold">{value}</span>
  </div>
);

export default ProfilePage;
