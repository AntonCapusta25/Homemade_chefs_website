'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Lock, X } from 'lucide-react';
import { useNewsletter } from '@/context/NewsletterContext';

interface NewsletterGateProps {
    onClose?: () => void;
}

export default function NewsletterGate({ onClose }: NewsletterGateProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { setSubscribed } = useNewsletter();
    const router = useRouter();

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
                setMessage('Successfully subscribed! Unlocking content...');
                setSubscribed(true);
                localStorage.setItem('subscriber_email', email);

                // Refresh the page after 2 seconds
                setTimeout(() => {
                    router.refresh();
                    if (onClose) onClose();
                }, 2000);
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                )}

                {/* Lock Icon */}
                <div className="w-16 h-16 bg-[#F47A44]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-[#F47A44]" />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-serif font-bold text-[#0F1E19] text-center mb-3">
                    Unlock Learning Resources
                </h2>

                <p className="text-gray-600 text-center mb-8">
                    Subscribe to our newsletter to access exclusive guides, tutorials, and chef insights.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-[#0F1E19] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F47A44] focus:border-transparent disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-[#F47A44] hover:bg-[#E86825] text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Subscribing...
                            </>
                        ) : status === 'success' ? (
                            'Unlocking...'
                        ) : (
                            <>
                                Subscribe & Unlock
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    {/* Status Messages */}
                    {message && (
                        <div className={`text-sm text-center p-3 rounded-lg ${status === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message}
                        </div>
                    )}
                </form>

                {/* Benefits */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm font-bold text-gray-700 mb-3">You'll get:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="text-[#F47A44]">✓</span>
                            Access to all learning resources
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-[#F47A44]">✓</span>
                            Weekly cooking tips & guides
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-[#F47A44]">✓</span>
                            Exclusive chef stories
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
