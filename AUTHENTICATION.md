# Authentication Implementation

This document explains the authentication features implemented in the Tutor Ji application.

## Features Implemented

### 1. Google OAuth Login
- Added Google login functionality to the Login component
- Users can authenticate using their Google accounts
- Redirects to the backend OAuth endpoint

### 2. Token Management
- Enhanced AuthContext to handle JWT tokens
- Automatic token decoding and user data extraction
- Local storage persistence for authentication state

### 3. Token Refresh
- Implemented token refresh functionality
- Automatically extends user sessions without re-login
- Handles expired tokens gracefully

### 4. User Information Display
- Shows user details in the Profile component
- Displays token expiration information
- Shows user plan and join date

### 5. Secure Logout
- Properly clears authentication tokens
- Calls backend logout endpoint
- Redirects to login page

## Components

### AuthService (`services/authService.ts`)
Centralized service for authentication-related API calls:
- `getUserInfo`: Fetches user information from the server
- `refreshToken`: Refreshes the authentication token
- `logout`: Logs out the user and clears tokens
- `initiateGoogleLogin`: Initiates the Google OAuth flow

### AuthContext (`context/AuthContext.tsx`)
Manages authentication state throughout the application:
- Tracks authentication status
- Stores user information
- Provides login/logout functions
- Handles token refresh

### UserAuthInfo (`components/UserAuthInfo.tsx`)
Authentication information component (for administrative use only):
- Previously displayed user ID, email, and token expiry on profile page
- Provided token refresh and logout buttons
- **Note:** This component is no longer displayed on the user profile page as authentication information is intended for administrative purposes only

### AuthTestPage (`components/AuthTestPage.tsx`)
Dedicated page for testing authentication features:
- Displays detailed user information
- Allows token refresh testing
- Provides logout functionality

## How to Test

1. Navigate to the Login page
2. Click "Login with Google" to authenticate
3. After login, visit the Profile page to see user information
4. Visit the "Auth Test" page in the sidebar to test all features:
   - View detailed authentication information
   - Test token refresh functionality
   - Test secure logout

## API Endpoints

The authentication service communicates with the backend at `https://three-0-4jps.onrender.com` using these endpoints:
- `/auth/google`: Google OAuth initiation
- `/auth/me`: Get user information
- `/auth/refresh`: Refresh authentication token
- `/auth/logout`: Logout user

## Security Considerations

- Tokens are stored in localStorage
- Token expiration is checked on app initialization
- Expired tokens automatically trigger logout
- All authentication requests use HTTPS in production