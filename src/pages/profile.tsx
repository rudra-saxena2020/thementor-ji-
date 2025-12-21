import React, { useState, useEffect } from 'react';
import { AIResponse } from '../types';
import { User, Mail, Award, BookOpen, Camera, Edit2, Save, X, Link as LinkIcon, MapPin, Calendar, Shield, Flame, Linkedin, Twitter, Github, Share2, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';
import PremiumAvatar from '../components/premium-avatar';

import { PREMIUM_AVATARS } from '../data/static-data';

interface ProfileProps {
  aiGuidance: AIResponse;
}

const Profile: React.FC<ProfileProps> = ({ aiGuidance }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  
  // Local state for form editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
  });

  // Sync with user context when it loads/changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'Physics enthusiast aiming for JEE! Always learning.',
        location: user.location || 'India',
      });
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location
    });
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleCancel = () => {
    if (user) {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            bio: user.bio || '',
            location: user.location || '',
        });
    }
    setIsEditing(false);
  };

  const handleAvatarSelect = (url: string) => {
      updateProfile({ avatar: url });
      showToast('Profile picture updated!', 'success');
      setIsSelectingAvatar(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-24 animate-fade-in relative">
       
       {/* Profile Header */}
       <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group relative">
          
          {/* Cover Photo */}
          <div className="h-40 md:h-64 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative overflow-hidden">
             {/* Pattern Overlay */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
             
             {/* User Name Overlay */}
             <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
               <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{user?.name || 'Student'}</h2>
               <p className="text-white/90 text-sm md:text-base drop-shadow-md">{user?.class ? `Class ${user.class}` : 'Learning Journey'}</p>
             </div>
             
             <button className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-white/20">
               <Camera size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Change Cover</span>
             </button>
          </div>
          
          <div className="px-6 md:px-12 pb-8 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 gap-4 md:gap-8">
                  {/* Avatar */}
                  <div className="relative group/avatar cursor-pointer shrink-0 z-10" onClick={() => setIsSelectingAvatar(true)}>
                      <div className="rounded-full p-1.5 bg-white dark:bg-slate-800 shadow-2xl">
                          <PremiumAvatar 
                            imageUrl={user?.avatar || PREMIUM_AVATARS[0]}
                            size="lg"
                            className="border-4 border-slate-100 dark:border-slate-700"
                          />
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-[2px] m-1.5 pointer-events-none">
                             <Camera className="text-white" size={32} />
                      </div>
                      <div className="absolute bottom-4 right-4 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full z-20"></div>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="flex-1 pb-2 text-center md:text-left w-full">
                      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                          <div className="space-y-1 w-full md:w-auto">
                             {isEditing ? (
                                <div className="space-y-3 max-w-md mx-auto md:mx-0">
                                    <div className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-2xl font-bold text-center md:text-left dark:text-white">
                                        {formData.name}
                                    </div>
                                    <input 
                                    type="text" 
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none text-center md:text-left dark:text-white"
                                    placeholder="Location"
                                    />
                                </div>
                             ) : (
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                                    {user?.name} 
                                    <Shield size={20} className="text-blue-500 fill-blue-500/20" />
                                </h1>
                             )}
                             <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg">Student • {user?.class || 'No Class Selected'}</p>
                             
                             <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {user?.location}</span>
                                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> Joined {user?.joinedDate}</span>
                                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {user?.email}</span>
                             </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                                        <Save size={18} /> Save
                                    </button>
                                    <button onClick={handleCancel} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
                                        <X size={18} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all hover:shadow-md w-full sm:w-auto">
                                        <Share2 size={18} /> Share
                                    </button>
                                    <button onClick={() => setIsEditing(true)} className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                                        <Edit2 size={18} /> Edit Profile
                                    </button>
                                </>
                            )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Bio & Socials */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 dark:border-slate-700 pt-8">
                  <div className="md:col-span-2 space-y-4">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">About Me</h3>
                     {isEditing ? (
                        <textarea 
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-4 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none leading-relaxed dark:text-white"
                          rows={3}
                          placeholder="Tell us about yourself..."
                        />
                     ) : (
                        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed text-center md:text-left">{user?.bio}</p>
                     )}
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">Socials</h3>
                     <div className="flex gap-4 justify-center md:justify-start">
                         <button className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Linkedin size={20} /></button>
                         <button className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"><Twitter size={20} /></button>
                         <button className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"><Github size={20} /></button>
                         <button className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"><LinkIcon size={20} /></button>
                     </div>
                  </div>
              </div>
          </div>
       </div>

       {/* Avatar Selection Modal */}
       {isSelectingAvatar && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 relative animate-scale-in max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Choose Your Avatar</h3>
                  <button onClick={() => setIsSelectingAvatar(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} className="text-slate-500" />
                  </button>
               </div>
               
               <p className="text-slate-500 dark:text-slate-400 mb-8">Select a premium 3D avatar that best represents you.</p>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {PREMIUM_AVATARS.map((avatarUrl, index) => (
                    <button 
                      key={index}
                      onClick={() => handleAvatarSelect(avatarUrl)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-violet-500 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
                    >
                      <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                         <div className="bg-white text-violet-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 shadow-lg">
                            <Check size={20} />
                         </div>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
         </div>
       )}

       {/* Stats Overview */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="glass-panel bg-white/50 dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-transform shadow-sm">
               <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                   <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><BookOpen size={18} /></div>
                   <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Uploads</span>
               </div>
               <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">24</div>
               <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Files shared</div>
          </div>
           <div className="glass-panel bg-white/50 dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-transform shadow-sm">
               <div className="flex items-center gap-3 mb-2 text-violet-600 dark:text-violet-400">
                   <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg"><Calendar size={18} /></div>
                   <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Sessions</span>
               </div>
               <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">15</div>
               <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Hours studied</div>
          </div>
           <div className="glass-panel bg-white/50 dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-transform shadow-sm">
               <div className="flex items-center gap-3 mb-2 text-orange-500 dark:text-orange-400">
                   <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg"><Flame size={18} /></div>
                   <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Streak</span>
               </div>
               <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">3 <span className="text-lg font-bold text-slate-400">Days</span></div>
               <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Best: 7</div>
          </div>
           <div className="glass-panel bg-white/50 dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-transform shadow-sm">
               <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400">
                   <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg"><Award size={18} /></div>
                   <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Rank</span>
               </div>
               <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Top 15%</div>
               <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Among peers</div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Subject Mastery */}
           <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3 text-lg">
                   <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600"><BookOpen size={20} /></div>
                   Subject Mastery
               </h3>
               <div className="space-y-6">
                   {[
                     { name: 'Physics', val: 65, color: 'bg-indigo-500', sub: 'Mechanics, Optics', icon: '⚛️' },
                     { name: 'Chemistry', val: 30, color: 'bg-purple-500', sub: 'Organic, Bonding', icon: '🧪' },
                     { name: 'Mathematics', val: 45, color: 'bg-pink-500', sub: 'Calculus, Algebra', icon: '📐' }
                   ].map(subj => (
                       <div key={subj.name} className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-violet-200 dark:hover:border-violet-800 transition-colors">
                           <div className="flex justify-between items-center mb-3">
                               <div className="flex items-center gap-3">
                                   <div className="text-2xl">{subj.icon}</div>
                                   <div>
                                       <span className="font-bold text-slate-800 dark:text-white block">{subj.name}</span>
                                       <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subj.sub}</span>
                                   </div>
                               </div>
                               <span className="text-lg font-black text-slate-700 dark:text-slate-200">{subj.val}%</span>
                           </div>
                           <div className="h-2.5 bg-white dark:bg-slate-700 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full ${subj.color} shadow-sm transition-all duration-1000`} style={{ width: `${subj.val}%` }}></div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
           
           {/* Achievements */}
           <div className="space-y-8">
               <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                   <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3 text-lg">
                       <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600"><Award size={20} /></div>
                       Achievements
                   </h3>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group">
                        <div className="text-3xl bg-white dark:bg-slate-700 rounded-full p-2 shadow-sm group-hover:scale-110 transition-transform">🚀</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Early Bird</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Completed 3 sessions before 9 AM</p>
                          <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md inline-block">UNLOCKED</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group">
                        <div className="text-3xl bg-white dark:bg-slate-700 rounded-full p-2 shadow-sm group-hover:scale-110 transition-transform">📚</div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Note Taker</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Uploaded 20+ study documents</p>
                          <div className="mt-2 h-1.5 w-20 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 w-3/4"></div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors border border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                          View All Achievements
                      </button>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Profile;