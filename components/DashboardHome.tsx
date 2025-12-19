import React, { useState, useEffect } from 'react';
import { AIResponse } from '../types';
import { mockStats } from '../data/mockData';
import { motivationalQuotes } from '../data/staticData';
import { 
  Flame, 
  UploadCloud, 
  BookOpen, 
  Calendar, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Activity,
  FolderOpen,
  Wifi,
  WifiOff,
  Quote,
  Mic,
  ArrowUpRight,
  Play,
  History as HistoryIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DashboardHomeProps {
  aiGuidance: AIResponse;
}

const CountUp = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}</span>;
};

const VoiceOrb = () => {
  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
      {/* Outer Glows */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-purple via-primary-blue to-primary-pink opacity-20 blur-3xl animate-pulse-glow"></div>
      
      {/* Audio Visualizer Rings */}
      <div className="absolute w-[120%] h-[120%] border border-primary-purple/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
      <div className="absolute w-[140%] h-[140%] border border-primary-blue/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
      
      {/* Waveforms (CSS Simulated) */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="absolute inset-0 rounded-full border border-white/30 animate-wave"
          style={{ animationDelay: `${i * 0.5}s` }}
        ></div>
      ))}

      {/* The Core Orb */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-primary shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.2),0_0_30px_rgba(168,85,247,0.6)] animate-orb-breath flex items-center justify-center z-10 backdrop-blur-sm">
         {/* Eyes */}
         <div className="flex gap-4">
            <div className="w-3 h-8 bg-white/90 rounded-full shadow-[0_0_10px_white]"></div>
            <div className="w-3 h-8 bg-white/90 rounded-full shadow-[0_0_10px_white]"></div>
         </div>
      </div>
    </div>
  );
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ aiGuidance }) => {
  const { user } = useAuth();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const nextQuote = () => setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  const prevQuote = () => setQuoteIndex((prev) => (prev - 1 + motivationalQuotes.length) % motivationalQuotes.length);

  const pieData = [
    { name: 'Completed', value: mockStats.completionRate },
    { name: 'Remaining', value: 100 - mockStats.completionRate },
  ];
  const COLORS = ['#FFFFFF', 'rgba(255,255,255,0.2)'];

  const QuickActionCard = ({ icon: Icon, title, desc, to, colorClass }: any) => {
    return (
      <Link 
          to={to} 
          className="group relative glass-panel rounded-[2rem] p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-purple/30 overflow-hidden flex flex-col justify-between min-h-[160px]"
      >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full transition-transform group-hover:scale-150`}></div>
        
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary-purple transition-colors">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* Top Meta Bar */}
      <div className="flex justify-end">
         <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm glass-panel ${isOnline ? 'text-emerald-600' : 'text-slate-500'}`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? 'System Online' : 'Offline Mode'}
         </div>
      </div>

      {/* Hero Section - Voice Orb Central */}
      <div className="relative min-h-[400px] flex flex-col items-center justify-center text-center p-8">
         <VoiceOrb />
         
         <div className="mt-8 space-y-4 max-w-2xl relative z-10">
             <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 drop-shadow-sm">
                Hello, {user?.name.split(' ')[0]}
             </h1>
             <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium">
                I'm listening. How can I help you learn today?
             </p>
             
             {/* Voice Input Trigger */}
             <button className="mt-6 mx-auto flex items-center gap-3 px-8 py-4 bg-gradient-primary rounded-full text-white font-bold shadow-lg shadow-primary-purple/30 hover:shadow-primary-purple/50 hover:scale-105 transition-all group">
                 <Mic size={24} className="group-hover:animate-bounce" />
                 <span>Tap to Speak</span>
             </button>
         </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard 
            icon={UploadCloud} 
            title="Upload Notes" 
            desc="PDFs & Images" 
            to="/notes?tab=upload"
            colorClass="from-blue-400 to-blue-600"
          />
          <QuickActionCard 
            icon={Zap} 
            title="Tutor AI" 
            desc="Ask & Learn" 
            to="/tutor"
            colorClass="from-purple-400 to-purple-600"
          />
          <QuickActionCard 
            icon={Calendar} 
            title="Study Plan" 
            desc="My Schedule" 
            to="/plan"
            colorClass="from-pink-400 to-pink-600"
          />
          <QuickActionCard 
            icon={BookOpen} 
            title="Practice" 
            desc="Resources" 
            to="/practice"
            colorClass="from-emerald-400 to-emerald-600"
          />
      </div>

      {/* Stats & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Daily Progress */}
         <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-20 rounded-bl-full transition-transform group-hover:scale-150"></div>
             <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
                 <Activity size={20} className="text-primary-blue" /> Daily Goal
             </h3>
             
             <div className="flex flex-col items-center">
                 <div className="w-40 h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={10}
                          paddingAngle={5}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#A855F7' : '#E2E8F0'} /> 
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 dark:text-white"><CountUp end={mockStats.completionRate} />%</span>
                    </div>
                 </div>
                 <p className="mt-4 text-sm font-medium text-slate-500 text-center">You're crushing your Physics goals today!</p>
             </div>
         </div>

         {/* Motivational Carousel */}
         <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-pink"></div>
            <div className="absolute -bottom-10 -right-10 text-slate-200 dark:text-white/5 transform rotate-12"><Quote size={180} /></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-primary-pink text-xs font-bold uppercase rounded-full">Daily Inspiration</span>
                    <div className="flex gap-2">
                        <button onClick={prevQuote} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={nextQuote} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>
                
                <p className="text-2xl md:text-3xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
                    "{motivationalQuotes[quoteIndex].text}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-1 bg-primary-pink rounded-full"></div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-sm">{motivationalQuotes[quoteIndex].author}</p>
                </div>
            </div>
         </div>
      </div>

      {/* Recent Activity List */}
      <div className="glass-panel p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                  <HistoryIcon size={20} className="text-primary-purple" /> Recent Activity
              </h3>
              <Link to="/timeline" className="text-xs font-bold text-primary-purple hover:underline flex items-center gap-1">
                  View All <ArrowUpRight size={14} />
              </Link>
          </div>

          <div className="space-y-4">
              {mockStats.notesUploaded > 0 ? (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary-blue group-hover:scale-110 transition-transform">
                            <UploadCloud size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-blue transition-colors">Uploaded Notes</h4>
                            <p className="text-xs text-slate-500">Physics_Ch1.pdf • 2 hours ago</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-primary-purple group-hover:scale-110 transition-transform">
                            <Zap size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-purple transition-colors">Tutor Session</h4>
                            <p className="text-xs text-slate-500">Calculus Basics • Yesterday</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
              ) : (
                  <div className="text-center py-8 text-slate-500">No recent activity</div>
              )}
          </div>
      </div>
    </div>
  );
};

export default DashboardHome;