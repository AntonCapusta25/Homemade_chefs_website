"use client";

import { LanguageProvider } from '@/context/LanguageContext';
import { NewsletterProvider } from '@/context/NewsletterContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <NewsletterProvider>
                {children}
            </NewsletterProvider>
        </LanguageProvider>
    );
}
