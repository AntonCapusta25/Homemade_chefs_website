"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LearningAccessForm() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/newsletter-subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Success! Check your email for access to our resources.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="access-form" className="bg-[#F47A44] py-20 px-6">
            <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">{t('learning.accessTitle')}</h2>
                <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                    {t('learning.accessSubtitle')}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('learning.emailPlaceholder')}
                        className="px-6 py-4 rounded-full text-[#0F1E19] flex-grow outline-none focus:ring-4 focus:ring-white/30"
                        disabled={loading}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#0F1E19] text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : t('learning.accessButton')}
                    </button>
                </form>

                {/* Status Messages */}
                {status !== 'idle' && (
                    <div className={`mt-6 p-4 rounded-lg ${status === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                        <p className="text-white font-medium">{message}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
