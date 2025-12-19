import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, ArrowRight, Eye, EyeOff, Globe, Sparkles, Check, Github, Twitter, Linkedin, User, Mail, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PREMIUM_AVATARS } from '../data/staticData';

const Signup: React.FC = () => {
  const { login } = useAuth(); 
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Check for email passed from Login page
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  // Password strength logic
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length > 5) strength += 20;
    if (pwd.length > 8) strength += 20;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }

    if (!formData.agreeTerms) {
        showToast('Please agree to the Terms of Service', 'error');
        return;
    }

    setIsLoading(true);
    
    // Simulate API signup delay
    setTimeout(() => {
        showToast('Account created successfully! Welcome to Tutor Ji.', 'success');
        login(); // Auto-login
        navigate('/');
    }, 1500);
  };

  const handleSocialClick = (platform: string) => {
      showToast(`Connecting to ${platform}...`, 'info');
  };

  const getStrengthColor = () => {
      if (passwordStrength <= 40) return 'bg-red-500';
      if (passwordStrength <= 80) return 'bg-amber-500';
      return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
      if (passwordStrength <= 40) return 'Weak';
      if (passwordStrength <= 80) return 'Medium';
      return 'Strong';
  };

  return (
    <div className="h-screen w-full flex bg-white dark:bg-slate-900 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Left Section - Visual Identity (MATCHES LOGIN PAGE for smooth transition) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-6 bg-slate-50 dark:bg-slate-950 h-full">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(244,63,94,0.2)] group">
            {/* Background Image / Abstract Gradient */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-bl from-rose-500/30 via-purple-600/30 to-indigo-600/30 mix-blend-overlay"></div>
                {/* Animated Orbs */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-rose-500/30 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                 
                 <img 
                   src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
                   alt="Student Success" 
                   className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110"
                 />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-12 text-white">
                <div className="flex justify-end animate-fade-in">
                   <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                      <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                      <span className="font-bold text-sm tracking-wide">Join 10,000+ Top Students</span>
                   </div>
                </div>

                <div className="space-y-6 max-w-lg animate-slide-in">
                    <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
                        Start Learning <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-yellow-200">Smarter.</span>
                    </h2>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed drop-shadow-md">
                        Create your free account today and unlock AI-powered tutors, smart notes, and personalized study plans.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group/card cursor-default">
                            <div className="text-2xl mb-1 group-hover/card:scale-110 transition-transform">🚀</div>
                            <div className="font-bold text-sm">AI Personal Tutor</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group/card cursor-default">
                            <div className="text-2xl mb-1 group-hover/card:scale-110 transition-transform">📝</div>
                            <div className="font-bold text-sm">Smart Notes</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 opacity-60 animate-fade-in">
                    <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                    <div className="text-xs font-medium uppercase tracking-widest">Trust your potential</div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Section - Signup Form (Scrollable) */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white dark:bg-slate-900 relative">
          <div className="min-h-full flex flex-col justify-center items-center p-6 md:p-12">
              <div className="absolute top-6 right-6 md:top-8 md:right-8 animate-fade-in z-20">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-violet-500 outline-none">
                      <Globe size={16} /> EN
                  </button>
              </div>

              <div className="max-w-md w-full space-y-8 animate-slide-in py-8">
                  <div className="space-y-3">
                       <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                               <BrandLogo className="w-6 h-6" />
                           </div>
                           <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">Tutor Ji</span>
                       </div>
                      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create account</h1>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Start your journey to academic excellence.</p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-5">
                      <div className="space-y-4">
                          <div className="space-y-2 group">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" size={20} />
                                <input 
                                    type="text" 
                                    name="fullName"
                                    placeholder="e.g. Rahul Sharma"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white font-medium transition-all"
                                    required
                                    autoFocus
                                />
                              </div>
                          </div>
                          <div className="space-y-2 group">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" size={20} />
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="student@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white font-medium transition-all"
                                    required
                                />
                              </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 group">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password"
                                        placeholder="8+ characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white font-medium transition-all"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="confirmPassword"
                                        placeholder="Re-enter"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-rose-500/20'} rounded-xl focus:outline-none focus:ring-4 dark:text-white font-medium transition-all`}
                                        required
                                    />
                                </div>
                            </div>
                          </div>
                          
                          {/* Password Strength Meter */}
                          {formData.password && (
                              <div className="space-y-1 animate-fade-in">
                                  <div className="flex justify-between items-center text-xs font-bold px-1">
                                      <span className="text-slate-500 dark:text-slate-400">Password Strength</span>
                                      <span className={`${passwordStrength <= 40 ? 'text-red-500' : passwordStrength <= 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                          {getStrengthLabel()}
                                      </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${passwordStrength}%` }}
                                      ></div>
                                  </div>
                              </div>
                          )}
                      </div>

                      <div className="flex items-start gap-3 px-1">
                          <div className="relative flex items-center pt-0.5">
                            <input 
                                type="checkbox" 
                                name="agreeTerms"
                                id="terms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 transition-all checked:border-rose-500 checked:bg-rose-500 hover:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
                                required
                            />
                            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                          </div>
                          <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 leading-tight select-none">
                              I agree to the <a href="#" className="text-slate-800 dark:text-slate-200 font-bold hover:underline hover:text-rose-500 transition-colors">Terms of Service</a> and <a href="#" className="text-slate-800 dark:text-slate-200 font-bold hover:underline hover:text-rose-500 transition-colors">Privacy Policy</a>.
                          </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed text-lg active:scale-95"
                      >
                          {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Create Account'}
                      </button>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or sign up with</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                      </div>

                      <a
                        href="https://mentor-omni-backend-2.onrender.com/auth/google"
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-md group active:scale-[0.98]"
                      >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.38.01-.58z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Continue with Google
                      </a>
                  </form>

                  <div className="text-center pt-2">
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                          Already have an account? 
                          <Link 
                            to="/login" 
                            state={{ email: formData.email }}
                            className="ml-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                          >
                            Log in
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

export default Signup;