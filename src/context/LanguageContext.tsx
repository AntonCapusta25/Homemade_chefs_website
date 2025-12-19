"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import enTranslations from '@/translations/en.json';
import nlTranslations from '@/translations/nl.json';
import frTranslations from '@/translations/fr.json';

type Language = 'EN' | 'NL' | 'FR';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    alternatePaths: Record<string, string | null>;
    setAlternatePaths: (paths: Record<string, string | null>) => void;
}

// Type for nested translation object
type TranslationObject = {
    [key: string]: string | TranslationObject;
};

// Translation dictionaries loaded from JSON files
const translations: Record<Language, TranslationObject> = {
    EN: enTranslations as TranslationObject,
    NL: nlTranslations as TranslationObject,
    FR: frTranslations as TranslationObject,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    // Initialize language from URL or localStorage
    const [language, setLanguageState] = useState<Language>('EN');
    const [isInitialized, setIsInitialized] = useState(false);
    const [alternatePaths, setAlternatePaths] = useState<Record<string, string | null>>({});

    // Load language preference from URL or localStorage on mount
    useEffect(() => {
        // Check URL for language prefix
        const segments = pathname.split('/').filter(Boolean);
        const urlLang = segments[0]?.toUpperCase();

        // If URL has NL or FR prefix, use that
        if (urlLang && ['NL', 'FR'].includes(urlLang)) {
            setLanguageState(urlLang as Language);
        } else {
            // No prefix means English (default)
            setLanguageState('EN');
        }
        setIsInitialized(true);
    }, [pathname]);

    // Save language preference and update URL
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('preferredLanguage', lang);

        // Check if there's an alternate path for this language (e.g. from blog post)
        if (alternatePaths[lang]) {
            router.push(alternatePaths[lang]!);
            return;
        }

        // Update URL with language prefix
        const segments = pathname.split('/').filter(Boolean);
        const currentLang = segments[0]?.toUpperCase();

        // Remove existing language prefix if present
        if (currentLang && ['EN', 'NL', 'FR'].includes(currentLang)) {
            segments.shift();
        }

        // Add new language prefix (except for EN which is default)
        const newPath = lang === 'EN'
            ? `/${segments.join('/')}`
            : `/${lang.toLowerCase()}/${segments.join('/')}`;

        router.push(newPath || '/');
    };

    // Translation function with nested key support (e.g., "nav.pricing")
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: string | TranslationObject = translations[language];

        for (const k of keys) {
            if (typeof value === 'object' && value !== null && k in value) {
                value = value[k];
            } else {
                // Fallback to English if key not found
                let fallback: string | TranslationObject = translations.EN;
                for (const fk of keys) {
                    if (typeof fallback === 'object' && fallback !== null && fk in fallback) {
                        fallback = fallback[fk];
                    } else {
                        return key; // Return key itself if not found in any language
                    }
                }
                return typeof fallback === 'string' ? fallback : key;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    // Don't render children until language is initialized
    if (!isInitialized) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, alternatePaths, setAlternatePaths }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
