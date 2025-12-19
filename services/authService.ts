// authService.ts
const API_BASE_URL = 'https://three-0-4jps.onrender.com';

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

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  name?: string;
  [key: string]: any;
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
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return { message: `Failed to fetch user information: ${error instanceof Error ? error.message : 'Unknown error'}` };
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
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return { message: `Failed to refresh token: ${error instanceof Error ? error.message : 'Unknown error'}` };
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
      // Clear local storage anyway to ensure clean state
      localStorage.removeItem('auth_token');
      return { message: 'No active session found. Local session cleared.' };
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    return data;
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if server request fails, clear local token
    localStorage.removeItem('auth_token');
    return { message: `Logged out locally. Server error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

/**
 * Initiate Google login flow
 */
export const initiateGoogleLogin = (): void => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  
  // Optionally check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (e) {
    // If token is invalid, remove it
    localStorage.removeItem('auth_token');
    return false;
  }
};