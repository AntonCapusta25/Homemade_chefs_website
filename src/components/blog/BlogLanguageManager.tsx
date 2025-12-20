'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Translation {
    language: string;
    slug: string;
}

export default function BlogLanguageManager({ translations }: { translations: Translation[] }) {
    const { setAlternatePaths } = useLanguage();

    useEffect(() => {
        const paths: Record<string, string> = {
            en: '/blog',
            nl: '/nl/blog',
            fr: '/fr/blog'
        };

        // Populate paths from translations
        translations.forEach(t => {
            const langCode = t.language.toLowerCase();
            if (langCode === 'en') {
                paths.en = `/blog/${t.slug}`;
            } else if (langCode === 'nl') {
                paths.nl = `/nl/blog/${t.slug}`;
            } else if (langCode === 'fr') {
                paths.fr = `/fr/blog/${t.slug}`;
            }
        });

        // Register paths in context
        setAlternatePaths(paths);

        // Cleanup on unmount
        return () => {
            setAlternatePaths({});
        };
    }, [translations, setAlternatePaths]);

    return null; // This is a logic-only component
}
