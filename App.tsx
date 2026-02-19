
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HeatmapPage from './components/HeatmapPage';
import NewsHub from './components/NewsHub';
import DeviceCatalog from './components/DeviceCatalog';
import AIIntelligence from './components/AIIntelligence';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import { Language } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('AR');
  const [activePage, setActivePage] = useState('landing');

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage lang={lang} onGetStarted={() => setActivePage('dashboard')} />;
      case 'dashboard':
        return <Dashboard lang={lang} />;
      case 'heatmap':
        return <HeatmapPage lang={lang} />;
      case 'news':
        return <NewsHub lang={lang} />;
      case 'devices':
        return <DeviceCatalog lang={lang} />;
      case 'ai':
        return <AIIntelligence lang={lang} />;
      case 'plans':
        return <PricingPage lang={lang} />;
      case 'profile':
        // Profile is handled as a special layout-driven overlay or state in Layout,
        // but can be returned here if needed for direct rendering.
        return null; 
      default:
        return <LandingPage lang={lang} onGetStarted={() => setActivePage('dashboard')} />;
    }
  };

  return (
    <Layout 
      lang={lang} 
      setLang={setLang} 
      activePage={activePage} 
      setActivePage={setActivePage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
