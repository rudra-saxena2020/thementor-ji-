import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardHome from './components/DashboardHome';
import NotesLibrary from './components/NotesLibrary';
import Timeline from './components/Timeline';
import StudyPlan from './components/StudyPlan';
import Settings from './components/Settings';
import Profile from './components/Profile';
import HelpSupport from './components/HelpSupport';
import TutorSession from './components/TutorSession';
import Practice from './components/Practice';
import Login from './components/Login';
import Signup from './components/Signup';
import AppTour from './components/AppTour';
import OnboardingForm from './components/OnboardingForm';
import { getDashboardGuidance } from './services/dashboardAi';
import { PageName, AIResponse } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

// Wrapper component to handle page-specific effects
const PageWrapper: React.FC<{ 
  component: React.ComponentType<{ aiGuidance: AIResponse }>,
  pageName: PageName, 
  setGuidance: (g: AIResponse) => void,
  currentGuidance: AIResponse | null
}> = ({ component: Component, pageName, setGuidance, currentGuidance }) => {
  const location = useLocation();

  useEffect(() => {
    // Fetch AI guidance when page changes
    const fetchGuidance = async () => {
      const guidance = await getDashboardGuidance(pageName);
      setGuidance(guidance);
    };
    fetchGuidance();
  }, [location, pageName, setGuidance]);

  if (!currentGuidance) return (
    <div className="flex items-center justify-center h-full text-slate-400 gap-2">
      <Loader2 className="animate-spin text-primary-purple" size={24} />
      <span className="text-primary-purple font-medium">Loading AI Guidance...</span>
    </div>
  );

  return <Component aiGuidance={currentGuidance} />;
};

const HelpWrapper: React.FC<{
  setGuidance: (g: AIResponse) => void
}> = ({ setGuidance }) => {
   useEffect(() => {
     const fetch = async () => {
         const g = await getDashboardGuidance('help_support');
         setGuidance(g);
     };
     fetch();
   }, [setGuidance]);
   return <HelpSupport />;
}

const NotificationsPage: React.FC<{ aiGuidance: AIResponse }> = ({ aiGuidance }) => (
    <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
        <div className="glass-panel p-6 rounded-3xl">
            <p className="text-slate-600 dark:text-slate-300">{aiGuidance.actions[0]}</p>
        </div>
    </div>
);

const TutorWrapper: React.FC<{
  setGuidance: (g: AIResponse) => void
}> = ({ setGuidance }) => {
   const [guidance, setLocalGuidance] = useState<AIResponse | null>(null);

   useEffect(() => {
     const fetch = async () => {
         // Mock tutor specific guidance
         const g = await getDashboardGuidance('dashboard_home'); 
         setLocalGuidance(g);
         setGuidance(g);
     };
     fetch();
   }, [setGuidance]);

   if (!guidance) return null;
   return <TutorSession aiGuidance={guidance} />;
}

// Main Layout component that requires Authentication
const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading, needsOnboarding, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<AIResponse | null>(null);

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-ethereal"><Loader2 className="animate-spin text-primary-purple" size={32} /></div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Profile Completeness Gate
  if (user && !user.class) {
    return <OnboardingForm />;
  }

  return (
    <div className="flex h-screen bg-ethereal bg-ethereal-light dark:bg-ethereal-dark overflow-hidden transition-colors duration-500 relative">
      {/* Onboarding Tour Overlay - Only shown after profile is complete */}
      {needsOnboarding && <AppTour />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-10">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)} 
          aiGuidance={aiGuidance}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <Routes>
            <Route path="/" element={<PageWrapper component={DashboardHome} pageName="dashboard_home" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            
            <Route path="/notes" element={<PageWrapper component={NotesLibrary} pageName="notes_library" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            
            <Route path="/tutor" element={<TutorWrapper setGuidance={setAiGuidance} />} />
            
            <Route path="/practice" element={<Practice />} />

            <Route path="/preparation" element={<Navigate to="/notes" replace />} />
            
            <Route path="/timeline" element={<PageWrapper component={Timeline} pageName="timeline" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            <Route path="/plan" element={<PageWrapper component={StudyPlan} pageName="study_plan" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            
            <Route path="/predictions" element={
              <div className="flex flex-col items-center justify-center h-full text-slate-500 glass-panel rounded-3xl m-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Predictions AI</h2>
                <p>Coming Soon in Phase 2</p>
              </div>
            } />

            <Route path="/notifications" element={<PageWrapper component={NotificationsPage} pageName="notifications" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            
            <Route path="/settings" element={<PageWrapper component={Settings} pageName="settings" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            <Route path="/profile" element={<PageWrapper component={Profile} pageName="profile" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
            
            <Route path="/help" element={<HelpWrapper setGuidance={setAiGuidance} />} />
            
            {/* Redirect any other logged-in routes to dashboard */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
               <MainLayout />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;