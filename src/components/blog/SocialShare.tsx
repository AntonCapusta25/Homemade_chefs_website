"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialShare() {
    return (
        <div className="flex flex-col gap-4 sticky top-32">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F47A44]/10 text-[#F47A44] mb-2">
                <Share2 size={20} />
            </div>

            <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2]/20 transition-colors shadow-sm"
                aria-label="Share on Facebook"
            >
                <Facebook size={18} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/20 transition-colors shadow-sm"
                aria-label="Share on Twitter"
            >
                <Twitter size={18} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#0A66C2] hover:border-[#0A66C2]/20 transition-colors shadow-sm"
                aria-label="Share on LinkedIn"
            >
                <Linkedin size={18} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#F47A44] hover:border-[#F47A44]/20 transition-colors shadow-sm"
                aria-label="Copy Link"
            >
                <LinkIcon size={18} />
            </motion.button>
        </div>
    );
}
