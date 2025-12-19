// authService.ts
const API_BASE_URL = 'http://localhost:3002';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  exp: number;
  class?: string | null;
  bio?: string;
  location?: string;
  joinedDate?: string;
  schoolName?: string;
  board?: string;
  subjects?: string;
  age?: number;
  phone?: string;
  aim?: string;
}

interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
}

/**
 * Get user information from the server
 */
export const getUserInfo = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return { message: 'Failed to fetch user information' };
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return { message: 'Failed to refresh token' };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<AuthResponse> => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return { message: 'No active session found' };
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    return data;
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if server request fails, clear local token
    localStorage.removeItem('auth_token');
    return { message: 'Logged out successfully' };
  }
};

/**
 * Initiate Google login flow
 */
export const initiateGoogleLogin = (): void => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};