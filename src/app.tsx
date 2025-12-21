import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import TopBar from './components/top-bar';
import AppTour from './components/app-tour';
import OnboardingForm from './components/onboarding-form';
import DashboardSkeleton from './components/dashboard-skeleton';
import { getDashboardGuidance } from './services/dashboard-ai';
import { PageName, AIResponse } from './types';
import { useAuth } from './context/auth-context';
import { Loader2, WifiOff, Plus } from 'lucide-react';

// Lazy Load Pages
const DashboardHome = lazy(() => import('./pages/dashboard-home'));
const NotesLibrary = lazy(() => import('./pages/notes-library'));
const Timeline = lazy(() => import('./pages/timeline'));
const StudyPlan = lazy(() => import('./pages/study-plan'));
const Settings = lazy(() => import('./pages/settings'));
const Profile = lazy(() => import('./pages/profile'));
const HelpSupport = lazy(() => import('./pages/help-support'));
const TutorSession = lazy(() => import('./pages/tutor-session'));
const Practice = lazy(() => import('./pages/practice'));
const Login = lazy(() => import('./pages/login'));
const Signup = lazy(() => import('./pages/signup'));
const AuthTestPage = lazy(() => import('./pages/auth-test-page'));

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

  if (!currentGuidance) return <DashboardSkeleton />;

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
  const { isAuthenticated, isLoading, needsOnboarding, user, fetchUserProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<AIResponse | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Auto-fetch user profile on app load
  useEffect(() => {
    if (isAuthenticated && user && !hasFetchedProfile) {
      // Small delay to ensure app is fully loaded
      const timer = setTimeout(() => {
        fetchUserProfile();
        setHasFetchedProfile(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, hasFetchedProfile, fetchUserProfile]);

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    );
  }

  // Profile Completeness Gate
  if (user && !user.class) {
    return <OnboardingForm />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500 relative font-sans text-slate-900 dark:text-slate-100">
      {!isOnline && (
        <div className="bg-destructive/90 backdrop-blur-sm text-white text-xs font-bold text-center py-1 absolute top-0 w-full z-50 animate-slide-in flex items-center justify-center gap-2">
            <WifiOff size={14} />
            <span>You are currently offline. Some AI features may not work.</span>
        </div>
      )}

      {/* Mobile Quick Action FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button 
            onClick={() => navigate('/notes')}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-primary/30"
            aria-label="Create Note"
        >
            <Plus size={28} />
        </button>
      </div>

      {/* Onboarding Tour Overlay - Only shown after profile is complete */}
      {needsOnboarding && <AppTour />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-10">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)} 
          aiGuidance={aiGuidance}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <Suspense fallback={<DashboardSkeleton />}>
            <Routes>
              <Route path="/" element={<PageWrapper component={DashboardHome} pageName="dashboard_home" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              
              <Route path="/notes" element={<PageWrapper component={NotesLibrary} pageName="notes_library" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              
              <Route path="/tutor" element={<TutorWrapper setGuidance={setAiGuidance} />} />
              
              <Route path="/practice" element={<Practice />} />

              <Route path="/preparation" element={<Navigate to="/notes" replace />} />
              
              <Route path="/timeline" element={<PageWrapper component={Timeline} pageName="timeline" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              <Route path="/plan" element={<PageWrapper component={StudyPlan} pageName="study_plan" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              
              <Route path="/predictions" element={
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground glass-panel rounded-3xl m-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Predictions AI</h2>
                  <p>Coming Soon in Phase 2</p>
                </div>
              } />

              <Route path="/notifications" element={<PageWrapper component={NotificationsPage} pageName="notifications" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              
              <Route path="/settings" element={<PageWrapper component={Settings} pageName="settings" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              <Route path="/profile" element={<PageWrapper component={Profile} pageName="profile" setGuidance={setAiGuidance} currentGuidance={aiGuidance} />} />
              
              <Route path="/help" element={<HelpWrapper setGuidance={setAiGuidance} />} />
              
              {/* Authentication Test Page */}
              <Route path="/auth-test" element={<AuthTestPage />} />
              
              {/* Redirect any other logged-in routes to dashboard */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
