import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'hi' | 'hinglish';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    notes: 'Notes Library',
    tutor: 'Tutor AI',
    settings: 'Settings',
    profile: 'Profile',
    upload: 'Upload',
    search: 'Search...',
    welcome: 'Welcome',
    streak: 'Streak',
    startLearning: 'Start Learning',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    notes: 'नोट्स लाइब्रेरी',
    tutor: 'ट्यूटर एआई',
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',
    upload: 'अपलोड करें',
    search: 'खोजें...',
    welcome: 'स्वागत है',
    streak: 'लगातार अध्ययन',
    startLearning: 'सीखना शुरू करें',
  },
  hinglish: {
    dashboard: 'Dashboard',
    notes: 'Notes Library',
    tutor: 'Tutor AI',
    settings: 'Settings',
    profile: 'Profile',
    upload: 'Upload karein',
    search: 'Search karein...',
    welcome: 'Welcome',
    streak: 'Streak',
    startLearning: 'Learning Shuru Karein',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};