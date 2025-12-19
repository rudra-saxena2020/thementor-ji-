import React, { useState } from 'react';
import { AIResponse, Task } from '../types';
import { mockTasks } from '../data/mockData';
import { studyTemplates } from '../data/staticData';
import { 
    CheckCircle2, 
    Circle, 
    Plus, 
    Calendar as CalendarIcon, 
    BookTemplate, 
    Zap, 
    Clock, 
    Target,
    ArrowRight,
    MoreHorizontal,
    Flag,
    CalendarDays,
    GripVertical
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface StudyPlanProps {
  aiGuidance: AIResponse;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ aiGuidance }) => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showTemplates, setShowTemplates] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const loadTemplate = (templateKey: string) => {
    const newTasks = studyTemplates[templateKey];
    if (newTasks) {
      const tasksToAdd: Task[] = newTasks.map((t, idx) => ({
        id: `temp-${Date.now()}-${idx}`,
        title: t.title || "Untitled Task",
        completed: false,
        dueDate: "Upcoming",
        type: t.type || "task"
      }));
      
      setTasks(prev => [...prev, ...tasksToAdd]);
      showToast(`${templateKey} plan loaded!`, 'success');
      setShowTemplates(false);
    }
  };

  const TemplateCard = ({ title, icon: Icon, desc, color, duration, templateKey }: any) => (
      <button 
        onClick={() => loadTemplate(templateKey)}
        className="group text-left bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-800 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
          <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}></div>
          
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
              <Icon size={28} strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">{desc}</p>
          
          <div className="flex items-center justify-between mt-auto border-t border-slate-100 dark:border-slate-700/50 pt-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                 <Clock size={12} /> {duration}
              </span>
              <span className="text-violet-600 dark:text-violet-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Use <ArrowRight size={16} />
              </span>
          </div>
      </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                 <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600">
                    <CalendarDays size={24} />
                 </div>
                 Study Plan
               </h1>
               <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">Organize your schedule and crush your goals.</p>
            </div>
            <div className="flex gap-3">
                <button 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${showTemplates ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <BookTemplate size={18} /> Templates
                </button>
                <button className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-none transition-transform active:scale-95">
                    <Plus size={18} /> New Task
                </button>
            </div>
        </div>

        {/* Template Selector */}
        {showTemplates && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 animate-scale-in">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">Choose a Template</h3>
                   <button onClick={() => setShowTemplates(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">Close</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TemplateCard 
                        title="7-Day Sprint"
                        icon={Zap}
                        color="bg-gradient-to-br from-orange-400 to-red-500"
                        desc="Intensive revision plan for exam week."
                        duration="1 Week"
                        templateKey="7-day"
                    />
                    <TemplateCard 
                        title="15-Day Balanced"
                        icon={Target}
                        color="bg-gradient-to-br from-blue-400 to-indigo-500"
                        desc="Steady pace covering major topics."
                        duration="2 Weeks"
                        templateKey="15-day"
                    />
                    <TemplateCard 
                        title="30-Day Master"
                        icon={BookTemplate}
                        color="bg-gradient-to-br from-emerald-400 to-teal-500"
                        desc="Deep dive into all subjects."
                        duration="1 Month"
                        templateKey="15-day" 
                    />
                </div>
            </div>
        )}

        {/* Task List */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur">
                <div className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-200 text-lg">
                   Today's Priorities <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs px-2.5 py-1 rounded-lg">{tasks.filter(t => !t.completed).length}</span>
                </div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {tasks.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                       <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-300">
                          <CheckCircle2 size={40} />
                       </div>
                       <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">All caught up!</p>
                       <p className="text-sm text-slate-400 mt-1">Load a template to get started with new goals.</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div 
                          key={task.id} 
                          className="p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 group cursor-pointer"
                          onClick={() => toggleTask(task.id)}
                        >
                            <div className="text-slate-300 dark:text-slate-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical size={20} />
                            </div>

                            <button className={`flex-shrink-0 transition-all duration-300 transform group-hover:scale-110 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-violet-500'}`}>
                                {task.completed ? <CheckCircle2 size={24} className="fill-emerald-100 dark:fill-emerald-900/30" strokeWidth={2.5} /> : <Circle size={24} strokeWidth={2.5} />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                                <p className={`text-base font-semibold truncate transition-colors ${task.completed ? 'line-through text-slate-400 decoration-2 decoration-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><CalendarIcon size={12} /> {task.dueDate}</span>
                                    {task.type === 'goal' && <span className="text-xs text-purple-500 font-bold flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded"><Flag size={10} fill="currentColor" /> Goal</span>}
                                </div>
                            </div>
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* Sidebar - Progress & Stats */}
      <div className="space-y-8">
          {/* Exam Countdown */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700"><CalendarIcon size={120} /></div>
             <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">Upcoming Milestone</p>
             <h3 className="text-3xl font-extrabold mb-8 tracking-tight">JEE Mains</h3>
             
             <div className="flex gap-4 relative z-10">
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 text-center border border-white/10 group-hover:bg-white/20 transition-colors">
                    <span className="block text-4xl font-black mb-1">45</span>
                    <span className="text-[10px] font-bold uppercase text-indigo-100 tracking-wider">Days</span>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 text-center border border-white/10 group-hover:bg-white/20 transition-colors">
                    <span className="block text-4xl font-black mb-1">12</span>
                    <span className="text-[10px] font-bold uppercase text-indigo-100 tracking-wider">Hours</span>
                 </div>
             </div>
             
             <button className="w-full mt-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg hover:-translate-y-0.5">Edit Details</button>
          </div>

          {/* Weekly Goals */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-8 text-lg">Weekly Progress</h3>
              <div className="space-y-6">
                  <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wide">Physics</span>
                          <span className="text-violet-600 dark:text-violet-400">80%</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full w-[80%] shadow-sm"></div>
                      </div>
                  </div>
                  <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wide">Chemistry</span>
                          <span className="text-pink-500 dark:text-pink-400">45%</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full w-[45%] shadow-sm"></div>
                      </div>
                  </div>
                  <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wide">Math</span>
                          <span className="text-amber-500 dark:text-amber-400">60%</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full w-[60%] shadow-sm"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default StudyPlan;