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
            EN: '/blog',
            NL: '/nl/blog',
            FR: '/fr/blog'
        };

        // Populate paths from translations
        translations.forEach(t => {
            const langCode = t.language.toUpperCase();
            if (langCode === 'EN') {
                paths.EN = `/blog/${t.slug}`;
            } else if (langCode === 'NL') {
                paths.NL = `/nl/blog/${t.slug}`;
            } else if (langCode === 'FR') {
                paths.FR = `/fr/blog/${t.slug}`;
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
