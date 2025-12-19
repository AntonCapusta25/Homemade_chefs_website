'use client';

import { Facebook, Twitter, Instagram, Link as LinkIcon, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SocialSidebar() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-4 sticky top-32">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F47A44]/10 text-[#F47A44] mb-2">
                <Share2 size={20} />
            </div>

            <Link
                href="https://www.facebook.com/homemademeals.net"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2]/20 transition-colors shadow-sm"
                aria-label="Visit us on Facebook"
            >
                <Facebook size={18} />
            </Link>

            <Link
                href="https://x.com/Homemade___"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:border-black/20 transition-colors shadow-sm"
                aria-label="Visit us on X (Twitter)"
            >
                <Twitter size={18} />
            </Link>

            <Link
                href="https://www.instagram.com/homemade.bv/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#E4405F] hover:border-[#E4405F]/20 transition-colors shadow-sm"
                aria-label="Visit us on Instagram"
            >
                <Instagram size={18} />
            </Link>

            <button
                onClick={handleCopy}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#F47A44] hover:border-[#F47A44]/20 transition-colors shadow-sm relative group"
                aria-label="Copy Link"
            >
                {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}

                {/* Tooltip */}
                <span className={`absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${copied ? 'opacity-100' : ''}`}>
                    {copied ? 'Copied!' : 'Copy Link'}
                </span>
            </button>
        </div>
    );
}
