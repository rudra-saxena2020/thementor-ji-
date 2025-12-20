import React from 'react';
import { AIResponse } from '../types';
import { mockSessions } from '../data/mock-data';
import { PlayCircle, Download, Calendar, ArrowUpRight, Filter, Clock, Tag, History as HistoryIcon, MoreHorizontal } from 'lucide-react';

interface TimelineProps {
  aiGuidance: AIResponse;
}

const Timeline: React.FC<TimelineProps> = ({ aiGuidance }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
               <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                 <HistoryIcon size={24} />
               </div>
               Session Timeline
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">Track and review your learning journey.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <Calendar size={16} /> Date Range
            </button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-[2rem] flex items-start gap-6 shadow-xl shadow-indigo-200/50 dark:shadow-none text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner mt-1">
              <ArrowUpRight size={28} className="text-white" />
          </div>
          <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-3">AI Recommendation <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider">New Insight</span></h3>
              <p className="text-indigo-100 leading-relaxed font-medium text-lg max-w-2xl">
                {aiGuidance?.actions?.[0] || "Review yesterday's calculus session to strengthen your understanding."}
              </p>
              <button className="mt-6 px-6 py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5">Start Review</button>
          </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 py-4 space-y-10">
        {/* Timeline Line */}
        <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

        {mockSessions.map((session, index) => (
            <div key={session.id} className="relative pl-12 group">
                {/* Timeline Dot with Pulse for recent */}
                <div className={`absolute left-[14px] top-6 w-5 h-5 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-md z-10 transition-transform group-hover:scale-125 ${
                    session.importance === 'High' ? 'bg-red-500' : session.importance === 'Medium' ? 'bg-orange-400' : 'bg-slate-400'
                }`}>
                    {index === 0 && <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-white"></div>}
                </div>

                {/* Session Card */}
                <div className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                     {/* Color Accent Bar */}
                     <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        session.importance === 'High' ? 'bg-red-500' : session.importance === 'Medium' ? 'bg-orange-400' : 'bg-slate-300'
                     }`}></div>

                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar size={12} /> {session.date}
                                </span>
                                {session.importance === 'High' && (
                                    <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border border-red-100 dark:border-red-900/30">High Priority</span>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors">{session.topic}</h3>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-lg"><Clock size={14} /> {session.duration} mins</span>
                                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-lg"><Tag size={14} /> {session.steps} topics</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-2 md:pt-0">
                             <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 dark:shadow-none hover:scale-105 active:scale-95">
                                <PlayCircle size={18} /> Replay
                             </button>
                             <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors hover:text-slate-800 dark:hover:text-white">
                                <Download size={20} />
                             </button>
                             <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors hover:text-slate-800 dark:hover:text-white">
                                <MoreHorizontal size={20} />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;