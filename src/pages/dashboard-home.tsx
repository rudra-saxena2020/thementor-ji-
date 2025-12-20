import React, { useState, useEffect } from 'react';
import { AIResponse } from '../types';
import { mockStats } from '../data/mock-data';
import { motivationalQuotes } from '../data/static-data';
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
import { useAuth } from '../context/auth-context';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { cn } from '../utils/cn';

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
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center group cursor-pointer transition-all duration-500 hover:scale-105">
      {/* Outer Glows */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-purple via-primary-blue to-primary-pink opacity-30 blur-3xl animate-pulse-glow transition-all duration-500 group-hover:opacity-50 group-hover:scale-110"></div>
      
      {/* Audio Visualizer Rings */}
      <div className="absolute w-[120%] h-[120%] border border-primary-purple/30 rounded-full animate-[spin_10s_linear_infinite] transition-all duration-500 group-hover:border-primary-purple/50"></div>
      <div className="absolute w-[140%] h-[140%] border border-primary-blue/30 rounded-full animate-[spin_15s_linear_infinite_reverse] transition-all duration-500 group-hover:border-primary-blue/50"></div>
      
      {/* Waveforms (CSS Simulated) */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="absolute inset-0 rounded-full border border-white/40 animate-wave transition-all duration-500 group-hover:border-white/60"
          style={{ animationDelay: `${i * 0.5}s` }}
        ></div>
      ))}

      {/* The Core Orb */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-primary shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.2),0_0_30px_rgba(168,85,247,0.6)] animate-orb-breath flex items-center justify-center z-10 backdrop-blur-sm transition-all duration-500 group-hover:shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.2),0_0_40px_rgba(168,85,247,0.8)] group-hover:scale-105">
         {/* Eyes */}
         <div className="flex gap-4 transition-all duration-500 group-hover:gap-6">
            <div className="w-3 h-8 bg-white/90 rounded-full shadow-[0_0_10px_white] transition-all duration-500 group-hover:h-10 group-hover:shadow-[0_0_15px_white]"></div>
            <div className="w-3 h-8 bg-white/90 rounded-full shadow-[0_0_10px_white] transition-all duration-500 group-hover:h-10 group-hover:shadow-[0_0_15px_white]"></div>
         </div>
      </div>
      
      {/* Hover Effect Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/30 transition-all duration-500 animate-pulse"></div>
    </div>
  );
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ aiGuidance }) => {
  const { user } = useAuth();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const firstName = user?.name?.split(' ')[0] || 'Learner';

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
      <Link to={to} aria-label={title} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple rounded-2xl transition-all duration-300 hover:-translate-y-1">
        <Card variant="glass" className="relative transition-all duration-300 hover:shadow-xl hover:border-primary-purple/30 overflow-hidden flex flex-col justify-between min-h-[172px] group hover:scale-[1.02]">
          <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full transition-transform group-hover:scale-150", colorClass)}></div>
          
          <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-all duration-300 ring-1 ring-white/20", colorClass)}>
              <Icon size={24} className="transition-transform duration-300 group-hover:rotate-12" />
          </div>
          
          <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary-purple transition-colors duration-300">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* Top Meta Bar */}
      <div className="flex justify-end">
        <Badge variant={isOnline ? "success" : "destructive"} className="gap-2 px-3 py-1.5">
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isOnline ? 'System Online' : 'Offline Mode'}
        </Badge>
      </div>

      {/* Hero Section - Voice Orb Central */}
      <div className="relative min-h-[480px] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
         <div className="absolute inset-0 -z-10">
           <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-primary-purple/30 via-primary-blue/20 to-primary-pink/30 blur-3xl animate-pulse-slow"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-purple/15 to-transparent"></div>
           <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-primary-blue/20 to-cyan-400/20 blur-3xl animate-pulse"></div>
         </div>
         <VoiceOrb />
         
         <div className="mt-8 space-y-6 max-w-3xl relative z-10">
             <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-purple via-primary-blue to-primary-pink drop-shadow-sm animate-fade-in">
                Hello, {firstName}
             </h1>
             <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                Ask anything or tap to speak. What should we learn today?
             </p>
             
             {/* Voice Input Trigger */}
             <Button 
                size="lg" 
                className="mt-6 mx-auto rounded-full font-bold shadow-lg shadow-primary-purple/30 hover:shadow-primary-purple/50 hover:scale-105 transition-all group bg-gradient-primary border-none h-16 px-10 animate-float"
             >
                 <Mic size={24} className="mr-3 group-hover:animate-bounce transition-transform" />
                 <span>Tap to Speak</span>
             </Button>
             
             {aiGuidance?.quick_suggestions?.length > 0 && (
               <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-slide-up">
                 {aiGuidance.quick_suggestions.slice(0,5).map((s, idx) => (
                   <Button key={idx} variant="outline" className="rounded-full px-4 py-2 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                     {s}
                   </Button>
                 ))}
               </div>
             )}
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

      {/* Recommended Next Actions */}
      {aiGuidance?.actions?.length > 0 && (
        <Card variant="glass" className="p-6 rounded-[2rem] animate-fade-in hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-primary-purple" />
              Recommended Next Actions
            </h3>
            <Badge variant="secondary" className="border-none animate-pulse">Personalized</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            {aiGuidance.actions.slice(0, 8).map((action, idx) => (
              <Button 
                key={idx} 
                variant="outline" 
                className="rounded-full px-4 py-2 text-sm bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary-purple/30 group"
              >
                <span className="group-hover:text-primary-purple transition-colors duration-300">{action}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Stats & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Daily Progress */}
         <Card variant="glass" className="p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-20 rounded-bl-full transition-transform group-hover:scale-150 animate-pulse-slow"></div>
             <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
                 <Activity size={20} className="text-primary-blue animate-pulse" /> Daily Goal
             </h3>
             
             <div className="flex flex-col items-center">
                 <div className="w-40 h-40 relative animate-scale-in">
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
                          animationBegin={0}
                          animationDuration={800}
                          isAnimationActive={true}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? '#A855F7' : '#E2E8F0'} 
                              stroke="none"
                              className="transition-all duration-500 group-hover:opacity-90"
                            /> 
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 dark:text-white animate-fade-in"><CountUp end={mockStats.completionRate} />%</span>
                        <span className="text-xs text-slate-500 mt-1 animate-fade-in delay-300">Complete</span>
                    </div>
                 </div>
                 <p className="mt-4 text-sm font-medium text-slate-500 text-center animate-slide-up">You're crushing your Physics goals today!</p>
             </div>
         </Card>

         {/* Motivational Carousel */}
         <Card variant="glass" className="lg:col-span-2 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center hover:shadow-xl transition-all duration-500 group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-pink transition-all duration-500 group-hover:w-3"></div>
            <div className="absolute -bottom-10 -right-10 text-slate-200 dark:text-white/5 transform rotate-12 transition-all duration-500 group-hover:scale-110 group-hover:text-white/10"><Quote size={180} className="animate-float" /></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <Badge variant="secondary" className="bg-pink-100 dark:bg-pink-900/30 text-primary-pink border-none animate-pulse">Daily Inspiration</Badge>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={prevQuote} className="rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-110"><ChevronLeft size={20} /></Button>
                        <Button variant="ghost" size="icon" onClick={nextQuote} className="rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-110"><ChevronRight size={20} /></Button>
                    </div>
                </div>
                
                <p className="text-2xl md:text-3xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed animate-fade-in">
                    "{motivationalQuotes[quoteIndex].text}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-1 bg-primary-pink rounded-full transition-all duration-500 group-hover:w-16"></div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-sm transition-colors duration-300 group-hover:text-primary-pink">{motivationalQuotes[quoteIndex].author}</p>
                </div>
            </div>
         </Card>
      </div>

      {/* Recent Activity List */}
      <Card variant="glass" className="p-8 rounded-[2.5rem] hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                  <HistoryIcon size={20} className="text-primary-purple animate-pulse" /> Recent Activity
              </h3>
              <Link to="/timeline" className="text-xs font-bold text-primary-purple hover:underline flex items-center gap-1 transition-all duration-300 hover:gap-2">
                  View All <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
          </div>

          <div className="space-y-4">
              {mockStats.notesUploaded > 0 ? (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer group animate-fade-in">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary-blue group-hover:scale-110 transition-all duration-300">
                            <UploadCloud size={20} className="group-hover:rotate-12" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-blue transition-colors duration-300">Uploaded Notes</h4>
                            <p className="text-xs text-slate-500">Physics_Ch1.pdf • 2 hours ago</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer group animate-fade-in delay-150">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-primary-purple group-hover:scale-110 transition-all duration-300">
                            <Zap size={20} className="group-hover:rotate-12" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-purple transition-colors duration-300">Tutor Session</h4>
                            <p className="text-xs text-slate-500">Calculus Basics • Yesterday</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </>
              ) : (
                  <div className="text-center py-8 text-slate-500 animate-fade-in">No recent activity</div>
              )}
          </div>
      </Card>
    </div>
  );
};

export default DashboardHome;
