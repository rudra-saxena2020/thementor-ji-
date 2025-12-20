import React, { useState, useEffect, useRef } from 'react';
import { AIResponse } from '../types';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Globe, 
  Bell, 
  Volume2, 
  Save, 
  Zap, 
  Shield, 
  Eye, 
  PenTool, 
  Search, 
  ChevronDown, 
  Check, 
  User,
  CreditCard,
  Lock,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from '../context/theme-context';
import { useLanguage } from '../context/language-context';
import { useToast } from '../context/toast-context';

interface SettingsProps {
  aiGuidance: AIResponse;
}

// Custom Searchable Dropdown Component
const SearchableDropdown = ({ 
  options, 
  value, 
  onChange, 
  label 
}: { 
  options: { id: string; label: string; sub: string }[]; 
  value: string; 
  onChange: (val: string) => void; 
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) || 
    opt.sub.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(o => o.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
      >
        <div className="text-left">
          <div className="font-bold text-slate-800 dark:text-white">{selectedOption?.label}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{selectedOption?.sub}</div>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in max-h-60 flex flex-col">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search languages..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm focus:outline-none dark:text-white placeholder-slate-400"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {filteredOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setIsOpen(false); setSearch(''); }}
                className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between transition-colors ${value === opt.id ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}
              >
                <div>
                  <div className={`font-bold ${value === opt.id ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-200'}`}>{opt.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{opt.sub}</div>
                </div>
                {value === opt.id && <Check size={18} className="text-violet-600 dark:text-violet-400" />}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Settings: React.FC<SettingsProps> = ({ aiGuidance }) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('appearance');
  const [isSaving, setIsSaving] = useState(false);
  const [handwrittenMode, setHandwrittenMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        showToast('Settings saved successfully', 'success');
    }, 800);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer group">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md dark:border-gray-600 peer-checked:bg-violet-600 transition-colors"></div>
    </label>
  );

  const tabs = [
      { id: 'appearance', label: 'Appearance', icon: LayoutDashboard },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'language', label: 'Language', icon: Globe },
      { id: 'privacy', label: 'Privacy', icon: Lock },
      { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fade-in relative h-full flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage preferences and customization</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all transform shadow-lg shadow-violet-500/20 text-sm
            ${isSaving ? 'bg-violet-400 cursor-not-allowed scale-95' : 'bg-violet-600 hover:bg-violet-700 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0'}
          `}
        >
          {isSaving ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <Save size={18} /> 
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 shadow-sm">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id 
                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
            <div className="my-2 border-t border-slate-100 dark:border-slate-700 mx-2"></div>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <Shield size={18} /> Danger Zone
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm p-8 min-h-[500px]">
            
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600"><Monitor size={20} /></div>
                            Theme Preferences
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <button 
                            onClick={() => setTheme('light')}
                            className={`relative p-1 rounded-2xl border-2 transition-all duration-300 group ${theme === 'light' ? 'border-violet-600 ring-4 ring-violet-50 dark:ring-violet-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300'}`}
                            >
                            <div className="bg-slate-100 rounded-xl overflow-hidden aspect-video relative group-hover:shadow-lg transition-shadow">
                                <div className="absolute top-0 w-full h-4 bg-white border-b border-slate-200"></div>
                                <div className="absolute top-6 left-2 w-8 h-8 bg-white rounded-md shadow-sm"></div>
                                <div className="absolute top-6 right-2 bottom-2 left-12 bg-white rounded-md shadow-sm"></div>
                            </div>
                            <div className="mt-3 text-center font-bold text-sm text-slate-700 dark:text-slate-300">Light</div>
                            </button>
                            
                            <button 
                            onClick={() => setTheme('dark')}
                            className={`relative p-1 rounded-2xl border-2 transition-all duration-300 group ${theme === 'dark' ? 'border-violet-600 ring-4 ring-violet-50 dark:ring-violet-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300'}`}
                            >
                            <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video relative group-hover:shadow-lg transition-shadow">
                                <div className="absolute top-0 w-full h-4 bg-slate-800 border-b border-slate-700"></div>
                                <div className="absolute top-6 left-2 w-8 h-8 bg-slate-800 rounded-md border border-slate-700"></div>
                                <div className="absolute top-6 right-2 bottom-2 left-12 bg-slate-800 rounded-md border border-slate-700"></div>
                            </div>
                            <div className="mt-3 text-center font-bold text-sm text-slate-700 dark:text-slate-300">Dark</div>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <Eye size={20} className="text-slate-400" />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">Reduced Motion</p>
                                        <p className="text-xs text-slate-500">Minimize interface animations</p>
                                    </div>
                                </div>
                                <Toggle checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <PenTool size={20} className="text-slate-400" />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">Handwritten Font</p>
                                        <p className="text-xs text-slate-500">Use handwritten style for notes</p>
                                    </div>
                                </div>
                                <Toggle checked={handwrittenMode} onChange={() => setHandwrittenMode(!handwrittenMode)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="space-y-8 animate-fade-in">
                     <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600"><Bell size={20} /></div>
                        Notification Settings
                    </h2>
                    
                    <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                               <Bell size={20} className="text-slate-400" />
                               <div>
                                 <p className="font-bold text-slate-800 dark:text-white">Push Notifications</p>
                                 <p className="text-xs text-slate-500">Receive alerts on your device</p>
                               </div>
                            </div>
                            <Toggle checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                         </div>
                         
                         <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                               <Volume2 size={20} className="text-slate-400" />
                               <div>
                                 <p className="font-bold text-slate-800 dark:text-white">Sound Effects</p>
                                 <p className="text-xs text-slate-500">Play sounds for actions and alerts</p>
                               </div>
                            </div>
                            <Toggle checked={voiceEnabled} onChange={() => setVoiceEnabled(!voiceEnabled)} />
                         </div>
                    </div>
                </div>
            )}

            {/* Language Tab */}
            {activeTab === 'language' && (
                <div className="space-y-8 animate-fade-in">
                     <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><Globe size={20} /></div>
                        Language & Region
                    </h2>
                    <div className="max-w-md">
                        <SearchableDropdown 
                            label="Display Language"
                            value={language}
                            onChange={(val) => setLanguage(val as any)}
                            options={[
                                { id: 'en', label: 'English', sub: 'United States' },
                                { id: 'hi', label: 'Hindi', sub: 'India (हिंदी)' },
                                { id: 'hinglish', label: 'Hinglish', sub: 'Conversational' },
                                { id: 'es', label: 'Spanish', sub: 'Español' },
                                { id: 'fr', label: 'French', sub: 'Français' },
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* Privacy Tab placeholder */}
            {activeTab === 'privacy' && (
                <div className="space-y-8 animate-fade-in text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Privacy Settings</h3>
                    <p className="text-slate-500">Manage your data and visibility settings here.</p>
                </div>
            )}

             {/* Billing Tab placeholder */}
             {activeTab === 'billing' && (
                <div className="space-y-8 animate-fade-in text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <CreditCard size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Billing & Plans</h3>
                    <p className="text-slate-500">Manage your subscription and payment methods.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;