import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Key, RefreshCw, LogOut, Shield, Calendar, Download } from 'lucide-react';

const AuthTestPage: React.FC = () => {
  const { user, isAuthenticated, refreshToken, logout, fetchUserProfile } = useAuth();
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
          <Shield className="mx-auto text-amber-500" size={48} />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">Not Authenticated</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Please log in to view authentication information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Authentication Test</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Test various authentication features including token refresh and logout.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">User Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Name</span>
                <span className="font-medium text-slate-800 dark:text-white">{user?.name}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Email</span>
                <span className="font-medium text-slate-800 dark:text-white">{user?.email}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">User ID</span>
                <span className="font-mono text-sm text-slate-800 dark:text-white truncate max-w-[150px]">
                  {user?.id}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="text-green-500" size={24} />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Token Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Token Expiry</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {user?.exp ? new Date(user.exp * 1000).toLocaleString() : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Plan</span>
                <span className="font-medium text-slate-800 dark:text-white capitalize">
                  {user?.plan || 'free'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Joined</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {user?.joinedDate || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleFetchProfile}
            disabled={isFetchingProfile}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors disabled:opacity-70"
          >
            <Download size={20} className={isFetchingProfile ? 'animate-spin' : ''} />
            {isFetchingProfile ? 'Fetching Profile...' : 'Fetch Profile'}
          </button>
          
          <button
            onClick={handleRefreshToken}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors disabled:opacity-70"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing Token...' : 'Refresh Token'}
          </button>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-70"
          >
            <LogOut size={20} />
            {isLoggingOut ? 'Logging Out...' : 'Logout'}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <User className="text-blue-500" size={20} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">User Info</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Displays information about the currently authenticated user, including name, email, and user ID.
            </p>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <RefreshCw className="text-green-500" size={20} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Token Refresh</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Refreshes the authentication token to extend the session without requiring re-login.
            </p>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <LogOut className="text-red-500" size={20} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Secure Logout</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Safely logs out the user by clearing the authentication token and redirecting to the login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;