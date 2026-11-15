"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationSchema } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "EN",
  setLanguage: () => {},
  t: translations.EN,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("odaboo_lang") as Language | null;
    if (saved === "EN" || saved === "DE") {
      setLanguageState(saved);
    }

    // Clean any third-party browser extension attributes to keep DOM pristine
    try {
      const cleanAttrs = () => {
        document.querySelectorAll("[bis_skin_checked], [bis_register], a[contenteditable]").forEach((el) => {
          el.removeAttribute("bis_skin_checked");
          el.removeAttribute("bis_register");
          el.removeAttribute("contenteditable");
        });
      };
      cleanAttrs();
    } catch {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("odaboo_lang", lang);
  };

  const t = translations[language] || translations.EN;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
