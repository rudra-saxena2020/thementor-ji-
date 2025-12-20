import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, Upload, X, FileText, History as HistoryIcon, Calendar, User as UserIcon, ChevronDown, Sparkles, Command } from 'lucide-react';
import { AIResponse } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { mockNotes, mockSessions, mockTasks } from '../data/mock-data';
import { useAuth } from '../context/auth-context';
import { cn } from '../utils/cn';

interface TopBarProps {
  onMenuClick: () => void;
  aiGuidance: AIResponse | null;
}

interface SearchResult {
  id: string;
  type: 'note' | 'session' | 'task' | 'page';
  title: string;
  subtitle: string;
  link: string;
  icon: any; 
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, aiGuidance }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search Notes
    mockNotes.forEach(note => {
      if (note.title.toLowerCase().includes(lowerQuery) || note.subject.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `note-${note.id}`,
          type: 'note',
          title: note.title,
          subtitle: `Note • ${note.subject}`,
          link: '/notes',
          icon: FileText
        });
      }
    });

    // Search Sessions
    mockSessions.forEach(session => {
      if (session.topic.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `session-${session.id}`,
          type: 'session',
          title: session.topic,
          subtitle: `Session • ${session.date}`,
          link: '/timeline',
          icon: HistoryIcon
        });
      }
    });

    // Search Tasks
    mockTasks.forEach(task => {
      if (task.title.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.title,
          subtitle: `Task • Due ${task.dueDate}`,
          link: '/plan',
          icon: Calendar
        });
      }
    });

    if ('profile'.includes(lowerQuery) || 'account'.includes(lowerQuery)) {
      searchResults.push({ id: 'page-profile', type: 'page', title: 'User Profile', subtitle: 'Page', link: '/profile', icon: UserIcon });
    }

    setResults(searchResults.slice(0, 5)); 
    setShowSearch(true);
  };

  const handleResultClick = (link: string) => {
    navigate(link);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-20 h-24 bg-transparent transition-all duration-300 pointer-events-none">
      <div className="flex items-center justify-between px-4 md:px-8 h-full glass-panel mx-4 mt-4 rounded-full pointer-events-auto">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-white/50 rounded-full md:hidden transition-all active:scale-95"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Dynamic AI Breadcrumb / Tip */}
          <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-white/50 dark:bg-white/5 rounded-full border border-white/20 shadow-sm backdrop-blur-sm animate-fade-in">
              <Sparkles size={16} className="text-primary animate-pulse-slow" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 truncate max-w-xs">
                  {aiGuidance?.quick_suggestions?.[0] || "Ready to unlock your potential?"}
              </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Universal Search Bar */}
          <div className="hidden md:flex relative group" ref={searchRef}>
              <div className={cn(
                "flex items-center transition-all duration-300 border rounded-full px-4 py-2.5",
                showSearch 
                  ? "w-[400px] shadow-lg bg-white dark:bg-slate-800 border-primary/20" 
                  : "w-72 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              )}>
                <Search className={cn("transition-colors", showSearch ? "text-primary" : "text-slate-400 group-hover:text-primary")} size={18} />
                <input 
                    type="text" 
                    placeholder="Ask me anything..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => { if(searchQuery) setShowSearch(true); }}
                    className="flex-1 ml-3 bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400"
                />
                {!searchQuery && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-200/50 dark:bg-white/10 rounded text-[10px] font-bold text-slate-400 border border-slate-300/50 dark:border-white/10">
                    ⌘K
                  </div>
                )}
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Search Dropdown Results */}
              {showSearch && results.length > 0 ? (
                <div className="absolute top-full mt-4 w-full glass-panel rounded-3xl shadow-xl overflow-hidden animate-scale-in origin-top">
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/50 dark:bg-white/5">Results</div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.link)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/50 dark:hover:bg-white/10 transition-colors border-b border-white/20 last:border-0 group"
                    >
                      <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                        <result.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{result.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
          </div>

          {/* Quick Upload Action */}
          <Link 
            to="/notes?tab=upload" 
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
              <Upload size={18} />
              <span>Upload</span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className="p-3 text-slate-500 hover:text-primary bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all duration-300 relative group"
               aria-label="Notifications"
             >
               <Bell size={20} className="group-hover:rotate-12 transition-transform" />
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white dark:border-slate-900"></span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
