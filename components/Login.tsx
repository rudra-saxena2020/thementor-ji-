import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, ArrowRight, Github, Twitter, Linkedin, Globe, Eye, EyeOff, AlertTriangle, Mail, Lock, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PREMIUM_AVATARS } from '../data/staticData';

const Login: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSkipping, setIsSkipping] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-fill email if passed from Signup or other pages
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSkipLogin = () => {
    setIsSkipping(true);
    loginAsGuest();
  };

  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    setIsLoggingIn(true);
    // Simulate login delay
    setTimeout(() => {
        login(); 
    }, 1500);
  };

  const handleForgotPassword = () => {
      if (!email) {
          showToast('Please enter your email first', 'info');
          return;
      }
      showToast(`Reset link sent to ${email}`, 'success');
  };

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.getModifierState('CapsLock')) {
          setCapsLockOn(true);
      } else {
          setCapsLockOn(false);
      }
  };

  const handleSocialClick = (platform: string) => {
      showToast(`Connecting to ${platform}...`, 'info');
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-[#0F172A] font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Left Section - Visual Identity (Static across Auth pages) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-6 h-full">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] group">
            {/* Background - Deep Navy/Purple Gradient as per spec */}
            <div className="absolute inset-0 bg-[#1a1f3a]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a] via-[#2d1b4e] to-[#1a1f3a] opacity-90"></div>
                
                {/* Mesh Gradient / Orbs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5B8FF9]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF6B9D]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                 
                 {/* Image Overlay (Subtle) */}
                 <img 
                   src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                   alt="Abstract Art" 
                   className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110"
                 />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-12 text-white">
                {/* Header */}
                <div className="flex items-center gap-3 animate-fade-in">
                   <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-lg">
                      <BrandLogo className="w-8 h-8 invert brightness-0 filter drop-shadow-md" /> 
                   </div>
                   <span className="font-extrabold text-xl tracking-wide text-white drop-shadow-sm">Tutor Ji</span>
                </div>

                {/* Hero Text */}
                <div className="space-y-8 max-w-lg animate-slide-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold uppercase tracking-widest shadow-sm text-indigo-200">
                        <Sparkles size={14} className="text-[#FF6B9D]" /> Education Reimagined
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                        "Be Unique, <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] to-[#FFB6D9]">Be Creative"</span>
                    </h2>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-sm drop-shadow-md">
                        Unlock your full potential with AI-driven personalized learning paths and smart note generation.
                    </p>
                    
                    {/* Social Proof */}
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {[0,1,2,3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1f3a] bg-slate-700 flex items-center justify-center text-xs font-bold shadow-md relative overflow-hidden">
                                    <img src={PREMIUM_AVATARS[i % PREMIUM_AVATARS.length]} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-medium">
                            <span className="font-bold text-white block">10k+ Students</span>
                            <span className="text-slate-400 text-xs">joined this week</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center animate-fade-in">
                    <div className="text-sm font-medium text-slate-400">© 2024 Tutor Ji Inc.</div>
                    <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm group/arrow bg-white/5">
                             <ArrowRight size={20} className="rotate-180 text-white group-hover/arrow:-translate-x-1 transition-transform" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Section - Auth Form (Scrollable) */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white dark:bg-[#0F172A] relative">
          <div className="min-h-full flex flex-col justify-center items-center p-6 md:p-12">
              <div className="absolute top-6 right-6 md:top-8 md:right-8 animate-fade-in z-20">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-[#FF6B9D] outline-none">
                      <Globe size={16} /> EN
                  </button>
              </div>

              <div className="max-w-md w-full space-y-8 animate-slide-in py-8">
                  <div className="text-center lg:text-left space-y-2">
                      <div className="lg:hidden flex justify-center mb-6">
                          <div className="w-16 h-16 bg-[#F5F3FF] dark:bg-[#1a1f3a] rounded-2xl flex items-center justify-center mb-4">
                            <BrandLogo className="w-10 h-10" />
                          </div>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hi Student</h1>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Welcome back to Tutor Ji</p>
                  </div>

                  <form onSubmit={handleRegularLogin} className="space-y-6">
                      <div className="space-y-5">
                          <div className="space-y-2 group">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B9D] transition-colors pointer-events-none" size={20} />
                                <input 
                                    type="email" 
                                    placeholder="student@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B9D]/20 focus:border-[#FF6B9D] dark:text-white font-medium transition-all placeholder:text-slate-400"
                                    required
                                    autoFocus={!email}
                                />
                              </div>
                          </div>
                          <div className="space-y-2 group">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B9D] transition-colors pointer-events-none" size={20} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={checkCapsLock}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B9D]/20 focus:border-[#FF6B9D] dark:text-white font-medium transition-all placeholder:text-slate-400"
                                    required
                                    autoFocus={!!email}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                              {capsLockOn && (
                                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mt-1 px-1 animate-fade-in">
                                      <AlertTriangle size={12} /> Caps Lock is ON
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="flex justify-end">
                          <button 
                            type="button" 
                            onClick={handleForgotPassword}
                            className="text-sm font-bold text-[#FF6B9D] hover:text-[#FF4B77] transition-colors hover:underline decoration-2 underline-offset-4"
                          >
                              Forgot password?
                          </button>
                      </div>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                      </div>

                      <a
                        href="https://mentor-omni-backend-2.onrender.com/auth/google" 
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-lg hover:-translate-y-0.5 group active:scale-[0.98]"
                      >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.38.01-.58z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Login with Google
                      </a>

                      <div className="grid grid-cols-2 gap-4">
                            <button 
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF6B9D] to-[#FF4B77] hover:from-[#FF5E8A] hover:to-[#FF3864] text-white rounded-2xl font-bold shadow-lg shadow-[#FF6B9D]/30 hover:shadow-[#FF6B9D]/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                {isLoggingIn ? <Loader2 size={20} className="animate-spin" /> : 'Login'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkipLogin}
                                disabled={isSkipping}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95"
                            >
                                 {isSkipping ? <Loader2 size={20} className="animate-spin" /> : 'Guest Mode'}
                            </button>
                      </div>
                  </form>

                  <div className="text-center pt-4">
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                          Don't have an account? 
                          <Link 
                            to="/signup" 
                            state={{ email }}
                            className="ml-1 text-[#FF6B9D] font-bold hover:underline hover:text-[#FF4B77] transition-colors"
                          >
                            Sign up
                          </Link>
                      </p>
                  </div>

                  <div className="flex justify-center gap-6 pt-6 opacity-60">
                       <button onClick={() => handleSocialClick('Twitter')} className="text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors transform hover:scale-110"><Twitter size={20} /></button>
                       <button onClick={() => handleSocialClick('LinkedIn')} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-110"><Linkedin size={20} /></button>
                       <button onClick={() => handleSocialClick('GitHub')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors transform hover:scale-110"><Github size={20} /></button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Login;