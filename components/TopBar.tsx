import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, Upload, X, FileText, History as HistoryIcon, Calendar, User as UserIcon, ChevronDown, Sparkles, Command } from 'lucide-react';
import { AIResponse } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { mockNotes, mockSessions, mockTasks } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import PremiumAvatar from './PremiumAvatar';
import { PREMIUM_AVATARS } from '../data/staticData';

interface TopBarProps {
  onMenuClick: () => void;
  aiGuidance: AIResponse | null;
}

// Combined Search Result Type
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
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
    <header className="sticky top-0 z-20 h-20 bg-transparent transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 h-full glass-panel mx-4 mt-4 rounded-full">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-white/50 rounded-full md:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
          
          {/* Dynamic AI Breadcrumb / Tip */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-white/50 dark:bg-white/5 rounded-full border border-white/20 shadow-sm backdrop-blur-sm">
              <Sparkles size={16} className="text-primary-purple" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 truncate max-w-xs">
                  {aiGuidance?.quick_suggestions?.[0] || "Ready to unlock your potential?"}
              </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Universal Search Bar */}
          <div className="hidden md:flex relative group" ref={searchRef}>
              <div className={`flex items-center transition-all duration-300 bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-full px-4 py-2.5 ${showSearch ? 'w-[400px] shadow-lg bg-white dark:bg-slate-800' : 'w-72 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'}`}>
                <Search className="text-slate-400 group-hover:text-primary-purple transition-colors" size="18" />
                <input 
                    type="text" 
                    placeholder="Ask me anything..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => { if(searchQuery) setShowSearch(true); }}
                    className="flex-1 ml-3 bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400"
                />
                {!searchQuery && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-200/50 dark:bg-white/10 rounded text-[10px] font-bold text-slate-400">
                    ⌘K
                  </div>
                )}
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Search Dropdown Results */}
              {showSearch && results.length > 0 ? (
                <div className="absolute top-full mt-2 w-full glass-panel rounded-3xl shadow-xl overflow-hidden animate-fade-in origin-top">
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/50 dark:bg-white/5">Results</div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.link)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/50 dark:hover:bg-white/10 transition-colors border-b border-white/20 last:border-0"
                    >
                      <div className="p-2 bg-primary-purple/10 rounded-xl text-primary-purple">
                        <result.icon size="18" />
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
          <Link to="/notes?tab=upload" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-purple to-primary-blue text-white rounded-full text-sm font-bold shadow-lg shadow-primary-purple/20 hover:shadow-primary-purple/40 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <Upload size={18} />
              <span>Upload</span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-full transition-all duration-200 relative hover:bg-white/50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 hover:text-primary-purple`}
            >
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-primary-pink rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 glass-panel rounded-3xl shadow-2xl p-4 animate-scale-in origin-top-right z-30">
                <div className="flex justify-between items-center mb-4 px-2">
                   <h3 className="font-bold text-lg text-slate-800 dark:text-white">Notifications</h3>
                   <span className="text-xs font-bold bg-primary-purple/10 text-primary-purple px-2 py-1 rounded-lg cursor-pointer hover:bg-primary-purple/20 transition-colors">Mark all read</span>
                </div>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                  <div className="p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 hover:bg-white/60 transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-blue"></div>
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-sm text-slate-900 dark:text-white font-bold group-hover:text-primary-blue">Study Reminder</p>
                        <span className="text-[10px] font-bold text-slate-400">2m ago</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Time to review "Motion in 1D" to keep your streak!</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 text-center">
                    <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-slate-500 hover:text-primary-purple transition-colors uppercase tracking-wide">
                        View All History
                    </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef} id="user-profile-section">
             <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 group"
             >
                <PremiumAvatar 
                  imageUrl={user?.avatar || PREMIUM_AVATARS[0]}
                  size="sm" 
                  className="shadow-sm group-hover:shadow-md transition-shadow ring-2 ring-white dark:ring-white/10"
                />
                
                <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.name}</p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
             </button>

             {showProfileMenu && (
                 <div className="absolute right-0 top-full mt-4 w-64 glass-panel rounded-3xl shadow-2xl py-2 animate-scale-in origin-top-right overflow-hidden z-30">
                     <div className="px-6 py-4 border-b border-white/20 mb-2 bg-white/20 dark:bg-white/5">
                         <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                     </div>
                     <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="block px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 hover:text-primary-purple transition-colors flex items-center gap-3">
                         <UserIcon size="16" /> My Profile
                     </Link>
                     <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="block px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 hover:text-primary-purple transition-colors flex items-center gap-3">
                         <Command size="16" /> Settings
                     </Link>
                     <div className="my-2 border-t border-white/20"></div>
                     <button className="w-full text-left px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                         Sign Out
                     </button>
                 </div>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;