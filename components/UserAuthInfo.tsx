import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, LogOut, User, Mail, Key, Download } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const UserAuthInfo: React.FC = () => {
  const { user, refreshToken, logout, fetchUserProfile } = useAuth();
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshToken();
      if (success) {
        showToast('Token refreshed successfully!', 'success');
      } else {
        showToast('Failed to refresh token', 'error');
      }
    } catch (error) {
      showToast('Error refreshing token', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      showToast('Logged out successfully!', 'success');
    } catch (error) {
      showToast('Error during logout', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFetchProfile = async () => {
    setIsFetchingProfile(true);
    try {
      const success = await fetchUserProfile();
      if (success) {
        showToast('User profile updated successfully!', 'success');
      } else {
        showToast('Failed to fetch user profile', 'error');
      }
    } catch (error) {
      showToast('Error fetching user profile', 'error');
    } finally {
      setIsFetchingProfile(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Key className="text-blue-500" size={20} />
        Authentication Info
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
          <div className="flex items-center gap-3">
            <User className="text-slate-400" size={18} />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">User ID</span>
          </div>
          <span className="text-sm font-mono text-slate-800 dark:text-white truncate max-w-[150px]">
            {user.id}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Mail className="text-slate-400" size={18} />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</span>
          </div>
          <span className="text-sm text-slate-800 dark:text-white truncate max-w-[150px]">
            {user.email}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Key className="text-slate-400" size={18} />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Token Expiry</span>
          </div>
          <span className="text-sm text-slate-800 dark:text-white">
            {user.exp ? new Date(user.exp * 1000).toLocaleString() : 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleFetchProfile}
          disabled={isFetchingProfile}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-70"
        >
          <Download size={16} className={isFetchingProfile ? 'animate-spin' : ''} />
          {isFetchingProfile ? 'Fetching...' : 'Fetch Profile'}
        </button>
        
        <button
          onClick={handleRefreshToken}
          disabled={isRefreshing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-70"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
        </button>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-70"
        >
          <LogOut size={16} className={isLoggingOut ? 'animate-spin' : ''} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default UserAuthInfo;