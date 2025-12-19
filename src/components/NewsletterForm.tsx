'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useNewsletter } from '@/context/NewsletterContext';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { setSubscribed } = useNewsletter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
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
                setMessage(data.message || 'Successfully subscribed!');
                setEmail('');
                // Mark user as subscribed
                setSubscribed(true);
                localStorage.setItem('subscriber_email', email);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    return (
        <div className="lg:w-1/3 bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-2">Stay in the loop</h3>
            <p className="text-gray-400 mb-6 text-sm">
                Join our newsletter for fresh updates and chef stories.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                            aria-hidden="true"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F47A44] disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        aria-label="Subscribe"
                        className="bg-[#F47A44] hover:bg-[#E86825] text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : status === 'success' ? (
                            <Check size={20} />
                        ) : (
                            <ArrowRight size={20} />
                        )}
                    </button>
                </div>

                {/* Status Messages */}
                {message && (
                    <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${status === 'success'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {status === 'success' ? (
                            <Check size={16} />
                        ) : (
                            <AlertCircle size={16} />
                        )}
                        <span>{message}</span>
                    </div>
                )}
            </form>
        </div>
    );
}
