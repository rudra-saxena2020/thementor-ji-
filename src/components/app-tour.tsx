import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Library, 
  User, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';

const AppTour = () => {
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Welcome to Tutor Ji",
      description: "Your new AI-powered study companion. Let's take a quick tour to help you get the most out of your dashboard.",
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30"
    },
    {
      title: "Your Command Center",
      description: "Track your study streak, view upcoming tasks, and get daily AI insights right from your Dashboard.",
      icon: LayoutDashboard,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
      title: "AI Tutor Sessions",
      description: "Stuck on a concept? Ask Tutor Ji to explain, draw diagrams, or solve problems instantly on the interactive whiteboard.",
      icon: GraduationCap,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-900/30"
    },
    {
      title: "Smart Notes Library",
      description: "Upload your PDFs or images and let our AI generate organized study notes, summaries, and flashcards for you.",
      icon: Library,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30"
    },
    {
      title: "You're Ready!",
      description: "That's it! You're all set to start learning smarter. Click below to begin your journey.",
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const CurrentIcon = steps[currentStep].icon;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden animate-scale-in">
         
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

         {/* Skip Button */}
         <button 
            onClick={handleSkip}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors"
         >
             Skip Tour
         </button>

         <div className="relative z-10 flex flex-col items-center text-center mt-4">
            {/* Icon Circle */}
            <div className={`w-24 h-24 rounded-full ${steps[currentStep].bg} flex items-center justify-center mb-6 shadow-lg transition-colors duration-500`}>
                <CurrentIcon size={48} className={`${steps[currentStep].color} transition-colors duration-500`} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 transition-all duration-300">
                {steps[currentStep].title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 h-20 transition-all duration-300">
                {steps[currentStep].description}
            </p>

            {/* Indicators */}
            <div className="flex gap-2 mb-8">
                {steps.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-violet-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                    />
                ))}
            </div>

            {/* Action Button */}
            <button 
                onClick={handleNext}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
                {currentStep === steps.length - 1 ? (
                    <>Get Started <Sparkles size={20} /></>
                ) : (
                    <>Next Step <ArrowRight size={20} /></>
                )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AppTour;