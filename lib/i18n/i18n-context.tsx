"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, LanguageCode } from "./dictionaries";

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("zeus-language") as LanguageCode | null;
    if (storedLang && dictionaries[storedLang]) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    if (dictionaries[lang]) {
      setLanguageState(lang);
      localStorage.setItem("zeus-language", lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[language] || dictionaries.en;
    return dict[key] || fallback || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
