import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  History as HistoryIcon, 
  Calendar, 
  Settings, 
  User, 
  HelpCircle,
  LogOut,
  X,
  BookOpen,
  Sparkles,
  GraduationCap,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';
import { BrandLogo } from './brand-logo';
import { cn } from '../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  };

  const menuGroups = [
    {
      title: 'Learning Space',
      icon: Zap,
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', id: 'nav-item-dashboard' },
        { name: 'Tutor AI', icon: GraduationCap, path: '/tutor', id: 'nav-item-tutor' },
        { name: 'Notes Library', icon: Library, path: '/notes', id: 'nav-item-notes' },
        { name: 'Practice Zone', icon: BookOpen, path: '/practice', id: 'nav-item-practice' },
        { name: 'Timeline', icon: HistoryIcon, path: '/timeline', id: 'nav-item-timeline' },
      ]
    },
    {
      title: 'Management',
      icon: Activity,
      items: [
        { name: 'Study Plan', icon: Calendar, path: '/plan', id: 'nav-item-plan' },
        { name: 'Predictions', icon: Sparkles, path: '/predictions', id: 'nav-item-predictions' }, 
      ]
    },
    {
      title: 'Account',
      icon: Shield,
      items: [
        { name: 'Profile', icon: User, path: '/profile', id: 'nav-item-profile' },
        { name: 'Settings', icon: Settings, path: '/settings', id: 'nav-item-settings' },
        { name: 'Auth Test', icon: Shield, path: '/auth-test', id: 'nav-item-auth-test' },
        { name: 'Help & Support', icon: HelpCircle, path: '/help', id: 'nav-item-help' },
      ]
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={cn(
          "fixed inset-y-4 left-4 z-30 w-64 glass-panel rounded-[2rem] transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col",
          "md:translate-x-0 md:static md:inset-auto md:my-4 md:ml-4",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-[120%] md:translate-x-0"
        )}
        id="main-sidebar"
        aria-label="Main Navigation"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-24 px-6 border-b border-white/20 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Logo Image */}
            <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                 <BrandLogo className="w-full h-full filter drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="block text-xl font-extrabold text-slate-800 dark:text-white leading-none tracking-tight group-hover:text-primary transition-colors">Tutor Ji</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1">Voice AI</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/50 rounded-xl transition-all active:scale-95"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
               <div className="flex items-center gap-2 px-3 mb-2 opacity-80">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {group.title}
                 </h3>
                 <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
               </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    id={item.id}
                    onClick={() => { if(window.innerWidth < 768) onClose(); }}
                    className={({ isActive }) => cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                      isActive 
                        ? "bg-primary/10 text-primary font-bold shadow-sm" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-[1.02]"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 relative z-10">
                          <item.icon 
                            size={20} 
                            className={cn(
                              "transition-all duration-300",
                              isActive ? "text-primary scale-110" : "text-slate-400 group-hover:text-primary group-hover:scale-110"
                            )}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                          <span className="text-sm tracking-wide">{item.name}</span>
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_currentColor] animate-pulse"></div>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 dark:border-white/5 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-2xl transition-all duration-300 font-medium group border border-transparent hover:border-destructive/20 text-sm hover:shadow-md active:scale-95"
            aria-label="Sign Out"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
