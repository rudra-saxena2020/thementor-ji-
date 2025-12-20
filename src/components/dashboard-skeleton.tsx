import React from 'react';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Area Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl h-32 bg-white/50 dark:bg-slate-800/50">
             <div className="flex justify-between items-start">
               <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
               <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
             </div>
             <div className="mt-4 space-y-2">
               <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
               <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-panel p-6 rounded-3xl h-64 bg-white/50 dark:bg-slate-800/50"></div>
           <div className="glass-panel p-6 rounded-3xl h-48 bg-white/50 dark:bg-slate-800/50"></div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-3xl h-80 bg-white/50 dark:bg-slate-800/50"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
