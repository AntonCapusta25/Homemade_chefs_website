'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NewsletterContextType {
    isSubscribed: boolean;
    checkSubscription: (email: string) => Promise<boolean>;
    setSubscribed: (value: boolean) => void;
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export function NewsletterProvider({ children }: { children: ReactNode }) {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Check if user has subscribed (stored in localStorage)
        const subscribed = localStorage.getItem('newsletter_subscribed') === 'true';
        setIsSubscribed(subscribed);
    }, []);

    const checkSubscription = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.subscribed) {
                localStorage.setItem('newsletter_subscribed', 'true');
                localStorage.setItem('subscriber_email', email);
                setIsSubscribed(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    };

    const setSubscribed = (value: boolean) => {
        localStorage.setItem('newsletter_subscribed', value.toString());
        setIsSubscribed(value);
    };

    return (
        <NewsletterContext.Provider value={{ isSubscribed, checkSubscription, setSubscribed }}>
            {children}
        </NewsletterContext.Provider>
    );
}

export function useNewsletter() {
    const context = useContext(NewsletterContext);
    if (context === undefined) {
        throw new Error('useNewsletter must be used within a NewsletterProvider');
    }
    return context;
}
