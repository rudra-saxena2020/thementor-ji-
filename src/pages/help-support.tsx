import React from 'react';
import { HelpCircle, MessageCircle, FileText, ChevronRight, Video, PenTool, Sparkles, Search } from 'lucide-react';

const HelpSupport: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
       <div className="text-center py-12">
           <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How can we help you?</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">Search for answers or browse our knowledge base</p>
           
           <div className="relative max-w-xl mx-auto group">
               <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                   <input 
                     type="text" 
                     placeholder="Search help articles..." 
                     className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 text-lg placeholder-slate-400 transition-all"
                   />
               </div>
           </div>
           
           <div className="flex justify-center gap-3 mt-6">
               <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Popular:</span>
               <button className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline">Upload Errors</button>
               <button className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline">Study Plan</button>
               <button className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline">Whiteboard</button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <button className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm text-left hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
               
               <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                   <FileText size={32} />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white text-2xl mb-2 group-hover:text-violet-600 transition-colors">Knowledge Base</h3>
               <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">Browse detailed guides, FAQs, and step-by-step tutorials to get the most out of Tutor Ji.</p>
           </button>

           <button className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm text-left hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
               
               <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                   <MessageCircle size={32} />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white text-2xl mb-2 group-hover:text-emerald-600 transition-colors">Contact Support</h3>
               <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">Need direct help? Our support team is ready to assist you via email or live chat.</p>
           </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex flex-col items-center text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:-translate-y-1 transition-all">
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-blue-600 mb-4 shadow-sm"><Video size={24} /></div>
               <h4 className="font-bold text-slate-800 dark:text-white text-lg">Video Tutorials</h4>
               <p className="text-sm text-slate-500 mt-2">Visual guides for features</p>
           </div>
           <div className="bg-orange-50 dark:bg-orange-900/10 p-8 rounded-[2rem] border border-orange-100 dark:border-orange-900/30 flex flex-col items-center text-center cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:-translate-y-1 transition-all">
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-orange-600 mb-4 shadow-sm"><HelpCircle size={24} /></div>
               <h4 className="font-bold text-slate-800 dark:text-white text-lg">Community</h4>
               <p className="text-sm text-slate-500 mt-2">Join the discussion</p>
           </div>
           <div className="bg-pink-50 dark:bg-pink-900/10 p-8 rounded-[2rem] border border-pink-100 dark:border-pink-900/30 flex flex-col items-center text-center cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:-translate-y-1 transition-all">
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-pink-600 mb-4 shadow-sm"><PenTool size={24} /></div>
               <h4 className="font-bold text-slate-800 dark:text-white text-lg">Request Feature</h4>
               <p className="text-sm text-slate-500 mt-2">Suggest new ideas</p>
           </div>
       </div>

       <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
           <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                   Common Troubleshooting
               </h2>
           </div>
           <div className="divide-y divide-slate-100 dark:divide-slate-700">
               <details className="group cursor-pointer">
                   <summary className="px-10 py-6 font-bold text-slate-700 dark:text-slate-300 list-none flex justify-between items-center group-hover:bg-slate-50 dark:group-hover:bg-slate-700/30 transition-colors text-lg">
                       My file upload failed, what should I do?
                       <span className="text-slate-400 group-open:rotate-180 transition-transform"><ChevronRight size={20} /></span>
                   </summary>
                   <div className="px-10 pb-8 pt-0 text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                       <p className="mb-2">Ensure your file meets the following criteria:</p>
                       <ul className="list-disc ml-5 space-y-1 mb-3">
                           <li>Size is under 25MB</li>
                           <li>Format is PDF, JPG, or PNG</li>
                           <li>Your internet connection is stable</li>
                       </ul>
                       <p>If the issue persists, try refreshing the page or clearing your browser cache.</p>
                   </div>
               </details>
               <details className="group cursor-pointer">
                   <summary className="px-10 py-6 font-bold text-slate-700 dark:text-slate-300 list-none flex justify-between items-center group-hover:bg-slate-50 dark:group-hover:bg-slate-700/30 transition-colors text-lg">
                       How do I use the Whiteboard offline?
                       <span className="text-slate-400 group-open:rotate-180 transition-transform"><ChevronRight size={20} /></span>
                   </summary>
                   <div className="px-10 pb-8 pt-0 text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                       <p>The whiteboard features a "Local Mode" which is active by default. You can draw, create shapes, and save your board locally without an internet connection. Your changes are auto-saved to your browser's storage.</p>
                   </div>
               </details>
           </div>
       </div>

       {/* Founder Section */}
       <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-center md:text-left relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                 <div className="shrink-0">
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1.5 shadow-2xl">
                         <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl md:text-6xl text-white overflow-hidden">
                             👨‍💻
                         </div>
                     </div>
                 </div>
                 <div className="flex-1 space-y-6">
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                         <div>
                             <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                                 Meet the Creator <Sparkles className="text-yellow-400" size={28} />
                             </h2>
                             <p className="text-violet-200 font-medium text-lg">A note from the Founder</p>
                         </div>
                     </div>
                     
                     <p className="text-slate-300 leading-relaxed text-lg md:text-xl font-light italic max-w-2xl mx-auto md:mx-0">
                        "Tutor Ji wasn't built just to be another study tool. It was created to empower you to learn smarter, not harder. I believe every student has a unique potential waiting to be unlocked."
                     </p>

                     <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                         <div>
                             <p className="text-white font-bold text-xl tracking-tight">Rudra</p>
                             <p className="text-slate-400 text-sm font-medium">Founder & Creator</p>
                         </div>
                         <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                             <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-white tracking-[0.2em] text-sm md:text-base">
                                 "BE UNIQUE, BE CREATIVE"
                             </p>
                         </div>
                     </div>
                 </div>
            </div>
       </div>
    </div>
  );
};

export default HelpSupport;