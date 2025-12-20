import React, { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { RefreshCw, LogOut, User, Mail, Key, Download } from 'lucide-react';
import { useToast } from '../context/toast-context';
import { Card } from './ui/card';
import { Button } from './ui/button';

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
    <Card className="p-6 border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Key className="text-primary" size={20} />
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
        <Button
          onClick={handleFetchProfile}
          isLoading={isFetchingProfile}
          className="flex-1"
          variant="default"
        >
          {!isFetchingProfile && <Download size={16} className="mr-2" />}
          {isFetchingProfile ? 'Fetching...' : 'Fetch Profile'}
        </Button>
        
        <Button
          onClick={handleRefreshToken}
          isLoading={isRefreshing}
          className="flex-1"
          variant="secondary"
        >
          {!isRefreshing && <RefreshCw size={16} className="mr-2" />}
          {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
        </Button>
        
        <Button
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="flex-1"
          variant="destructive"
        >
          {!isLoggingOut && <LogOut size={16} className="mr-2" />}
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </Card>
  );
};

export default UserAuthInfo;