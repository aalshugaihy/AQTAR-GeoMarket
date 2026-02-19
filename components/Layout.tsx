
import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../constants';
import { Language } from '../types';
import { t } from '../translations';
import ChatSupport from './ChatSupport';
import ProfilePage from './ProfilePage';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  activePage: string;
  setActivePage: (p: string) => void;
}

const SidebarItem: React.FC<{ 
    label: string; 
    icon: string; 
    active: boolean; 
    onClick: () => void;
    lang: Language;
    id: string;
}> = ({ label, icon, active, onClick, lang, id }) => (
  <button
    id={`sidebar-${id}`}
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm transition-all duration-200 rounded-xl mb-2 ${
      active 
        ? `bg-[#005F73] text-white shadow-lg` 
        : `text-slate-400 hover:bg-slate-800 hover:text-slate-200`
    } ${lang === 'AR' ? 'flex-row-reverse space-x-reverse text-right' : 'text-left'}`}
  >
    <span className="mr-3 ml-3 text-lg">{icon}</span>
    <span className={`${lang === 'AR' ? 'arabic-font' : ''} font-black uppercase tracking-tighter`}>{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, lang, setLang, activePage, setActivePage }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  
  // Auth State (Mocking Clerk)
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  
  // Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ type: 'General Feedback', details: '' });

  useEffect(() => {
    const updateWishlist = () => {
      const saved = localStorage.getItem('aqtar_device_wishlist');
      if (saved) {
        try { setWishlistCount(JSON.parse(saved).length); } catch (e) { setWishlistCount(0); }
      } else { setWishlistCount(0); }
    };
    
    updateWishlist();
    window.addEventListener('storage', updateWishlist);
    // Custom event to handle internal changes without storage event
    window.addEventListener('aqtar_wishlist_updated', updateWishlist);
    
    const tourDone = localStorage.getItem('aqtar_tour_done_v2');
    if (!tourDone) {
      setTimeout(() => {
        if (activePage === 'dashboard') {
          setShowOnboarding(true);
        }
      }, 2000);
    }
    
    // Check for mock user
    const savedUser = localStorage.getItem('aqtar_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    return () => {
      window.removeEventListener('storage', updateWishlist);
      window.removeEventListener('aqtar_wishlist_updated', updateWishlist);
    };
  }, [activePage]);

  const finishOnboarding = () => {
    localStorage.setItem('aqtar_tour_done_v2', 'true');
    setShowOnboarding(false);
  };

  const steps = [
    { targetId: 'stat-projects', title: labels.onboardingStep1, desc: labels.onboardingStep1Desc },
    { targetId: 'sidebar-devices', title: labels.onboardingStep2, desc: labels.onboardingStep2Desc },
    { targetId: 'sidebar-ai', title: labels.onboardingStep3, desc: labels.onboardingStep3Desc }
  ];

  useEffect(() => {
    if (showOnboarding) {
      const step = steps[onboardingStep];
      const target = document.getElementById(step.targetId);
      if (target) {
        const rect = target.getBoundingClientRect();
        setHighlightStyle({
          position: 'fixed',
          top: rect.top - 12,
          left: rect.left - 12,
          width: rect.width + 24,
          height: rect.height + 24,
          zIndex: 55,
          pointerEvents: 'none',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 40px 10px rgba(0, 245, 212, 0.4)',
          borderRadius: '16px',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          border: '2px solid rgba(0, 245, 212, 0.5)'
        });
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightStyle({});
    }
  }, [showOnboarding, onboardingStep, activePage]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSuccess(false);
      setFeedbackForm({ type: 'General Feedback', details: '' });
    }, 2000);
  };

  const handleSignIn = () => {
    const mockUser = { name: "Saleh Al-Amri", email: "saleh@geoksa.com" };
    setUser(mockUser);
    localStorage.setItem('aqtar_user', JSON.stringify(mockUser));
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('aqtar_user');
    setActivePage('landing');
  };

  const menuItems = [
    { id: 'landing', label: labels.home, icon: '🏠' },
    { id: 'dashboard', label: labels.dashboard, icon: '📊' },
    { id: 'heatmap', label: labels.heatmap, icon: '🗺️' },
    { id: 'news', label: labels.news, icon: '📰' },
    { id: 'devices', label: labels.devices, icon: '📡' },
    { id: 'ai', label: labels.ai, icon: '✨' },
    { id: 'plans', label: labels.plans, icon: '🏷️' },
  ];

  if (activePage === 'profile' && user) {
    return (
      <Layout 
        lang={lang} 
        setLang={setLang} 
        activePage={activePage} 
        setActivePage={setActivePage}
      >
        <ProfilePage lang={lang} user={user} onSignOut={handleSignOut} />
      </Layout>
    );
  }

  return (
    <div className={`flex min-h-screen ${isRtl ? 'flex-row-reverse' : 'flex-row'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <aside className="w-72 bg-[#0A2342] border-x border-slate-800 flex flex-col fixed h-full z-40 shadow-2xl overflow-y-auto">
        <div className="p-8 flex flex-col items-center border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mr-2">GEOMARKET</span>
            <div className="text-3xl font-black tracking-tighter flex items-center">
              <span style={{ color: COLORS.premiumGold }}>AQ</span>
              <span style={{ color: COLORS.skyBlue }}>TAR</span>
            </div>
          </div>
          <div className="text-xs arabic-font font-bold text-slate-500 mt-2 tracking-[0.5em] uppercase opacity-60">
            اقطـار
          </div>
        </div>
        <nav className="flex-1 px-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              active={activePage === item.id}
              onClick={() => setActivePage(item.id)}
              lang={lang}
            />
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-4">
           <button 
             onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')}
             className="w-full py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black tracking-[0.1em] hover:bg-slate-700 transition"
           >
             {labels.switchLang}
           </button>
           <button 
             onClick={() => { localStorage.removeItem('aqtar_tour_done_v2'); setActivePage('dashboard'); setOnboardingStep(0); setShowOnboarding(true); }}
             className="w-full py-2.5 border border-slate-800 rounded-xl text-[8px] font-black uppercase text-slate-600 hover:text-slate-400"
           >
             {labels.onboardingStart}
           </button>
           <div className="text-[8px] text-center text-slate-600 font-black tracking-[0.2em] uppercase">V5.0.0.PRO</div>
        </div>
      </aside>

      <main className={`flex-1 ${isRtl ? 'mr-72' : 'ml-72'} bg-[#0D1B2A] min-h-screen pb-20`}>
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0A2342]/70 backdrop-blur-xl sticky top-0 z-30 shadow-lg">
          <div className="flex items-center space-x-4">
            <h1 className={`text-sm font-black text-white uppercase tracking-[0.2em] ${isRtl ? 'arabic-font' : ''}`}>
              {isRtl ? 'أقطار: الاستكشاف الذكي' : 'AQTAR: Strategic Intelligence'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setActivePage('devices')}
               className="relative px-3 py-1.5 hover:bg-slate-800/50 rounded-full transition group"
               title={labels.wishlist}
             >
                <span className="text-xl">❤️</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
                    {wishlistCount}
                  </span>
                )}
             </button>
             
             <button 
               onClick={() => setShowFeedbackModal(true)}
               className="px-5 py-1.5 bg-[#005F73]/20 border border-[#005F73] text-[#94D2BD] text-[10px] font-black rounded-full hover:bg-[#005F73] hover:text-white transition-all uppercase tracking-widest shadow-lg"
             >
               {labels.feedback}
             </button>
             
             {user ? (
               <button 
                 onClick={() => setActivePage('profile')}
                 className="flex items-center gap-3 px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700 hover:border-sky-500 transition shadow-inner group"
               >
                 <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-black">S</div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition">{user.name}</span>
               </button>
             ) : (
               <button 
                 onClick={() => setShowAuthModal(true)}
                 className="px-6 py-2 bg-[#00F5D4] text-[#0A2342] text-[10px] font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
               >
                 {labels.signIn}
               </button>
             )}
          </div>
        </header>

        <div className="p-8 relative">
          {children}

          {/* Feedback Modal */}
          {showFeedbackModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-[#1B263B] w-full max-w-lg rounded-[2rem] border border-slate-700 p-8 shadow-2xl relative">
                <button onClick={() => setShowFeedbackModal(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-500 hover:text-white transition shadow-lg">✕</button>
                {feedbackSuccess ? (
                  <div className="text-center py-12 animate-in zoom-in-95">
                    <div className="text-6xl mb-6">✅</div>
                    <h3 className="text-2xl font-black text-white">{labels.feedbackSuccess}</h3>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-2xl">📝</span>
                       <h3 className={`text-2xl font-black text-white ${isRtl ? 'arabic-font' : ''}`}>{labels.feedbackTitle}</h3>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{labels.feedbackType}</label>
                      <select 
                        value={feedbackForm.type}
                        onChange={(e) => setFeedbackForm({...feedbackForm, type: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F5D4] outline-none transition-all"
                      >
                        <option value="General Feedback">{labels.generalFeedback}</option>
                        <option value="Bug Report">{labels.bugReport}</option>
                        <option value="Feature Request">{labels.featureRequest}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{labels.feedbackDetails}</label>
                      <textarea 
                        required
                        value={feedbackForm.details}
                        onChange={(e) => setFeedbackForm({...feedbackForm, details: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F5D4] outline-none h-32 resize-none transition-all"
                        placeholder="..."
                      />
                    </div>
                    <button type="submit" className="w-full py-4 bg-[#00F5D4] text-[#0A2342] font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                      {labels.feedbackSubmit}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Onboarding Overlay */}
          {showOnboarding && activePage === 'dashboard' && (
            <>
              <div style={highlightStyle} />
              <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                 <div className="bg-[#1B263B] w-full max-w-md rounded-[2.5rem] border border-[#00F5D4]/30 shadow-2xl p-8 space-y-6 relative pointer-events-auto mt-[40vh] animate-in slide-in-from-bottom-12 duration-500">
                    <div className="absolute -top-6 -left-6 w-14 h-14 bg-[#00F5D4] rounded-full flex items-center justify-center text-[#0A2342] font-black animate-bounce shadow-xl text-xl">
                      {onboardingStep + 1}
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="text-sky-400 text-[10px] font-black uppercase tracking-widest mb-1">Step {onboardingStep + 1} of 3</h4>
                          <h3 className="text-2xl font-black text-white">{steps[onboardingStep].title}</h3>
                       </div>
                       <button onClick={finishOnboarding} className="text-slate-500 hover:text-white transition-colors">✕</button>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{steps[onboardingStep].desc}</p>
                    <div className="flex gap-4 pt-4 border-t border-slate-800">
                       {onboardingStep > 0 && (
                         <button 
                           onClick={() => setOnboardingStep(onboardingStep - 1)}
                           className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-white border border-slate-700 rounded-xl transition-all"
                         >
                           {labels.onboardingPrev}
                         </button>
                       )}
                       <button onClick={finishOnboarding} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-500 hover:text-white">{labels.onboardingSkip}</button>
                       <button 
                         onClick={() => {
                           if (onboardingStep < 2) {
                             setOnboardingStep(onboardingStep + 1);
                           } else {
                             finishOnboarding();
                           }
                         }}
                         className="flex-2 px-8 py-3 bg-[#00F5D4] text-[#0A2342] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition shadow-xl"
                       >
                         {onboardingStep < 2 ? labels.onboardingNext : labels.now}
                       </button>
                    </div>
                 </div>
              </div>
            </>
          )}

          {/* Auth Modal Simulation */}
          {showAuthModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
              <div className="bg-[#1B263B] w-full max-w-md rounded-[3rem] border border-slate-800 p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00F5D4]"></div>
                <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white">✕</button>
                <div className="text-center space-y-4 mb-10">
                   <div className="text-3xl font-black text-white">{labels.signIn}</div>
                   <p className="text-slate-500 text-sm">Join the leading geospatial intelligence community in Saudi Arabia.</p>
                </div>
                <div className="space-y-4">
                   <button onClick={handleSignIn} className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-100 transition shadow-xl">
                      <span className="text-xl">G</span> Continue with Google
                   </button>
                   <button onClick={handleSignIn} className="w-full py-4 bg-[#1B263B] border-2 border-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:border-sky-500 transition shadow-xl">
                      <span className="text-xl">📧</span> Continue with Email
                   </button>
                </div>
                <div className="mt-8 text-center">
                   <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">Securely powered by <span className="text-white">AQTAR_AUTH_V2</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Support Chat Widget */}
          <ChatSupport lang={lang} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
