import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

/* =======================
   Types
======================= */

export type Language = 'hi' | 'en' | 'bn' | 'mr' | 'bho' | 'mai';

export interface Translations {
  appName: string;
  home: string;
  symptomTracker: string;
  healthTips: string;
  medicineStore: string;
  aiAssistant: string;
  sarkariYojana: string;
  nearbyHospitals: string;
  myProfile: string;
  login: string;
  register: string;
  logout: string;
  loading: string;
  addSymptom: string;
  symptomName: string;
  symptomDescription: string;
  addedOn: string;
  noSymptoms: string;
  emptySymptomError: string;
  search: string;
  addToCart: string;
  cart: string;
  checkout: string;
  total: string;
  address: string;
  payment: string;
  proceedToPayment: string;
  orderPlaced: string;
  askHealth: string;
  send: string;
  welcomeMessage: string;
  healthTipsTitle: string;
  governmentSchemes: string;
  freeHealthcare: string;
  schemes: string;
  eligibility: string;
  apply: string;
  email: string;
  password: string;
  otp: string;
  verifyOtp: string;
  name: string;
  phone: string;
  selectLanguage: string;
  changeLanguage: string;
  price: string;
  quantity: string;
  remove: string;
  emptyCart: string;
  continueShopping: string;
  viewCart: string;
  fullName: string;
  streetAddress: string;
  city: string;
  pincode: string;
  paymentMethod: string;
  cod: string;
  upi: string;
  placeOrder: string;
  orderSuccess: string;
  backToHome: string;
  description: string;
  date: string;
  time: string;
  deleteSymptom: string;
  quickLinks: string;
  legal: string;
  privacyPolicy: string;
  termsConditions: string;
  support: string;
  helpCenter: string;
  feedback: string;
  contact: string;
  followUs: string;
  rightsReserved: string;
}

/* =======================
   Translations (UNCHANGED)
======================= */
/* 🔴 Your existing translations object remains exactly the same here */
import { translations } from './translations'; // ← optional future refactor
// If you prefer, keep your original translations object here directly

/* =======================
   Language Names
======================= */

const languageNames: Record<Language, string> = {
  hi: 'हिंदी',
  en: 'English',
  bn: 'বাংলা',
  mr: 'मराठी',
  bho: 'भोजपुरी',
  mai: 'मैथिली',
};

/* =======================
   Context Type
======================= */

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;

  /** ✅ Old usage supported: t.home */
  t: Translations;

  /** ✅ New safer usage: translate('home') */
  translate: (key: keyof Translations) => string;

  languageNames: Record<Language, string>;
  availableLanguages: Language[];
  currentLanguageName: string;
}

/* =======================
   Context
======================= */

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/* =======================
   Helper: Safe Translation
======================= */

const safeTranslate = (
  lang: Language,
  key: keyof Translations
): string => {
  const value =
    translations[lang]?.[key] ?? translations.en[key];

  if (!value && import.meta.env.DEV) {
    console.warn(
      `[i18n] Missing translation key "${key}" for language "${lang}"`
    );
  }

  return value ?? key;
};

/* =======================
   Provider
======================= */

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'hi';
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'hi';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  /* 🔒 Create safe proxy so old code (t.home) never crashes */
  const safeT = useMemo(() => {
    return new Proxy(translations[language], {
      get(target, prop: string) {
        return safeTranslate(language, prop as keyof Translations);
      },
    }) as Translations;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: safeT,
    translate: (key) => safeTranslate(language, key),
    languageNames,
    availableLanguages: ['hi', 'en', 'bn', 'mr', 'bho', 'mai'],
    currentLanguageName: languageNames[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/* =======================
   Hook
======================= */

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider'
    );
  }
  return context;
};
