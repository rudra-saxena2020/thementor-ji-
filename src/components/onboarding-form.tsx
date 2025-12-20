import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight,
  ChevronLeft,
  GraduationCap, 
  School, 
  BookOpen, 
  Heart, 
  Target,
  MapPin,
  Phone,
  Star,
  Calendar,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Coffee,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

// --- Shared Types ---
interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  user: any;
}

// --- Helper Components ---
const FloatingCard = ({ children, delay = 0 }: { children?: React.ReactNode, delay?: number }) => (
  <div 
    className="relative group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
      {children}
    </div>
  </div>
);

const GlassmorphicInput = ({ icon: Icon, label, required, ...props }: any) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
      {Icon && <Icon size={16} className="text-blue-500" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <input 
        {...props}
        className="w-full h-14 px-5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white text-base font-medium placeholder:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50"
      />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  </div>
);

const SelectableChip = ({ value, label, emoji, selected, onClick, delay = 0 }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative py-4 px-4 sm:px-6 rounded-2xl border-2 font-bold text-sm transition-all duration-300 hover:scale-105 animate-fadeInUp w-full ${
      selected 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/20' 
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {selected && (
      <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounceIn">
        <Check size={14} className="text-white" />
      </div>
    )}
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl sm:text-3xl">{emoji}</span>
      <span className="truncate max-w-full">{label}</span>
    </div>
  </button>
);

// --- Step Components (Moved Outside) ---

const Step1 = ({ formData, setFormData, handleChange, user }: StepProps) => (
  <div className="space-y-6 sm:space-y-8 animate-slideIn">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-blue-500/50 animate-float">
        <BookOpen size={36} className="text-white sm:w-[44px] sm:h-[44px]" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
        Let's Get Started! 🚀
      </h2>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
        Hi <span className="font-bold text-blue-600 dark:text-blue-400">{user?.name}</span>, first tell us about your current education.
      </p>
    </div>

    <FloatingCard delay={100}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Which class? <span className="text-red-500">*</span></h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "Class 9", emoji: "📚" },
            { value: "Class 10", emoji: "📖" },
            { value: "Class 11", emoji: "🎯" },
            { value: "Class 12", emoji: "🎓" },
            { value: "Dropper", emoji: "💪" }
          ].map((cls, idx) => (
            <SelectableChip
              key={cls.value}
              value={cls.value}
              label={cls.value}
              emoji={cls.emoji}
              selected={formData.class === cls.value}
              onClick={() => setFormData((prev: any) => ({ ...prev, class: cls.value }))}
              delay={idx * 50}
            />
          ))}
        </div>
      </div>
    </FloatingCard>

    <FloatingCard delay={200}>
      <GlassmorphicInput
        icon={Calendar}
        label="Your Age"
        required
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="How old are you?"
        min="10"
        max="25"
      />
    </FloatingCard>
  </div>
);

const Step2 = ({ formData, setFormData, handleChange }: StepProps) => (
  <div className="space-y-6 sm:space-y-8 animate-slideIn">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 via-pink-500 to-red-600 rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-purple-500/50 animate-float">
        <School size={36} className="text-white sm:w-[44px] sm:h-[44px]" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 dark:from-white dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-3">
        School Details 🏫
      </h2>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
        Let's know more about your institution
      </p>
    </div>

    <FloatingCard delay={100}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Education Board</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { value: "CBSE", emoji: "📘" },
            { value: "ICSE", emoji: "📗" },
            { value: "State Board", emoji: "📙" },
            { value: "IB", emoji: "🌍" },
            { value: "IGCSE", emoji: "🎯" },
            { value: "Other", emoji: "📚" }
          ].map((board, idx) => (
            <SelectableChip
              key={board.value}
              value={board.value}
              label={board.value}
              emoji={board.emoji}
              selected={formData.board === board.value}
              onClick={() => setFormData((prev: any) => ({ ...prev, board: board.value }))}
              delay={idx * 50}
            />
          ))}
        </div>
      </div>
    </FloatingCard>

    <FloatingCard delay={200}>
      <GlassmorphicInput
        icon={School}
        label="School / College Name"
        type="text"
        name="schoolName"
        value={formData.schoolName}
        onChange={handleChange}
        placeholder="Your institution name"
      />
    </FloatingCard>

    <FloatingCard delay={300}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassmorphicInput
          icon={Star}
          label="Favorite Subject"
          type="text"
          name="favSubject"
          value={formData.favSubject}
          onChange={handleChange}
          placeholder="e.g. Physics"
        />
        <GlassmorphicInput
          icon={Zap}
          label="Current Subjects"
          type="text"
          name="subjects"
          value={formData.subjects}
          onChange={handleChange}
          placeholder="e.g. PCM"
        />
      </div>
    </FloatingCard>
  </div>
);

const Step3 = ({ formData, handleChange }: StepProps) => (
  <div className="space-y-6 sm:space-y-8 animate-slideIn">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-orange-500/50 animate-float">
        <Target size={36} className="text-white sm:w-[44px] sm:h-[44px]" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-800 via-orange-600 to-red-600 dark:from-white dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-2 sm:mb-3">
        Dream Big! 🎯
      </h2>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
        What's your target? Let's achieve it together
      </p>
    </div>

    <FloatingCard delay={100}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Your Goal <span className="text-red-500">*</span></h3>
        </div>
        <textarea 
          name="aim"
          value={formData.aim}
          onChange={handleChange}
          rows={5}
          placeholder="What exam or goal are you preparing for? (e.g. JEE 2025, NEET, Board Exams)"
          className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all dark:text-white text-base font-medium resize-none hover:bg-white dark:hover:bg-slate-800/50"
        />
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <Award size={18} className="text-orange-500 flex-shrink-0" />
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            We'll create a personalized study plan just for you!
          </p>
        </div>
      </div>
    </FloatingCard>

    <FloatingCard delay={200}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">About You</h3>
        </div>
        <textarea 
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          rows={6}
          maxLength={500}
          placeholder="Tell us about your interests, hobbies, strengths... (max 500 characters)"
          className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white text-base font-medium resize-none hover:bg-white dark:hover:bg-slate-800/50"
        />
        {formData.aboutMe && (
          <p className="text-xs text-slate-500 text-right font-semibold">
            {formData.aboutMe.length}/500 characters
          </p>
        )}
      </div>
    </FloatingCard>
  </div>
);

const Step4 = ({ formData, handleChange }: StepProps) => (
  <div className="space-y-6 sm:space-y-8 animate-slideIn">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-emerald-500/50 animate-float">
        <Heart size={36} className="text-white sm:w-[44px] sm:h-[44px]" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-white dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-2 sm:mb-3">
        Almost There! 🎉
      </h2>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
        Just a few contact details and we're done
      </p>
    </div>

    <FloatingCard delay={100}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassmorphicInput
          icon={Phone}
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
        />
        <GlassmorphicInput
          icon={MapPin}
          label="Location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, State"
        />
      </div>
    </FloatingCard>

    <FloatingCard delay={200}>
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-6">
          <Coffee size={24} className="text-blue-600" />
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">Profile Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Class</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{formData.class || '—'}</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Age</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{formData.age || '—'}</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Board</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{formData.board || '—'}</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Goal</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{formData.aim ? '✓ Set' : '—'}</p>
          </div>
        </div>
      </div>
    </FloatingCard>
  </div>
);

// --- Main Component ---

const OnboardingForm = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    class: '',
    schoolName: '',
    board: '',
    favSubject: '',
    subjects: '',
    age: '',
    phone: '',
    location: user?.location || 'Mumbai, India',
    aboutMe: user?.bio || '',
    aim: ''
  });

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection('forward');
      setCurrentStep(prev => prev + 1);
      // Ensure smooth scrolling to top on step change for mobile
      const container = document.getElementById('onboarding-scroll-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep(prev => prev - 1);
      const container = document.getElementById('onboarding-scroll-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
        updateProfile({
            class: formData.class,
            schoolName: formData.schoolName,
            board: formData.board,
            favSubject: formData.favSubject,
            subjects: formData.subjects,
            age: formData.age ? parseInt(formData.age) : undefined,
            phone: formData.phone,
            location: formData.location,
            bio: formData.aboutMe,
            aim: formData.aim
        });
        showToast('🎉 Welcome aboard! Your learning journey begins now!', 'success');
        setIsSubmitting(false);
    }, 1500);
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 0:
        return formData.class && formData.age;
      case 1:
        return true; // Optional fields
      case 2:
        return formData.aim;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const ProgressBar = () => {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    
    return (
      <div className="relative mb-8 sm:mb-12 px-2">
        {/* Background track */}
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Step markers */}
        <div className="flex justify-between mt-4">
          {['Academic', 'School', 'Goals', 'Contact'].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all duration-300 ${
                idx < currentStep 
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white scale-100 shadow-lg shadow-emerald-500/50' 
                  : idx === currentStep 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 shadow-xl shadow-blue-500/50 animate-pulse-soft' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 scale-90'
              }`}>
                {idx < currentStep ? <Check size={14} /> : idx + 1}
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold transition-colors ${
                idx <= currentStep ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="onboarding-scroll-container" className="h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 relative overflow-y-auto">
      
      {/* Animated background elements - Fixed so they don't scroll away */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="min-h-full flex items-center justify-center p-4 py-12 relative z-10">
        <div className="w-full max-w-3xl">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-12">
            
            <ProgressBar />

            {currentStep === 0 && <Step1 formData={formData} setFormData={setFormData} handleChange={handleChange} user={user} />}
            {currentStep === 1 && <Step2 formData={formData} setFormData={setFormData} handleChange={handleChange} user={user} />}
            {currentStep === 2 && <Step3 formData={formData} setFormData={setFormData} handleChange={handleChange} user={user} />}
            {currentStep === 3 && <Step4 formData={formData} setFormData={setFormData} handleChange={handleChange} user={user} />}

            {/* Navigation */}
            <div className="flex gap-4 mt-10">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 sm:px-8 h-14 sm:h-16 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft size={24} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}
              
              {currentStep < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 h-14 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 active:scale-95 relative overflow-hidden group"
                >
                  <span className="relative z-10">Continue</span>
                  <ChevronRight size={24} className="relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-14 sm:h-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                      <>
                          <Loader2 size={24} className="relative z-10 animate-spin" />
                          <span className="relative z-10">Saving...</span>
                      </>
                  ) : (
                      <>
                          <Check size={24} className="relative z-10" />
                          <span className="relative z-10">Complete Setup</span>
                      </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </button>
              )}
            </div>
          </div>

          {/* Skip link */}
          {currentStep < totalSteps - 1 && (
            <div className="text-center mt-6 mb-8">
              <button
                type="button"
                onClick={() => setCurrentStep(totalSteps - 1)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-sm underline underline-offset-4 transition-colors"
              >
                Skip to the end →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(${direction === 'forward' ? '50px' : '-50px'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #7c3aed);
        }

        /* Remove number input arrows */
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default OnboardingForm;