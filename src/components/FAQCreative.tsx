"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MessageCircle } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';

type Category = 'Essentials' | 'Money' | 'Logistics' | 'Growth';

interface FAQItem {
    question: string;
    answer: string;
    category: Category;
}

export default function FAQCreative() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<Category | 'All'>('All');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        { category: 'Essentials', question: t('faq.q1'), answer: t('faq.a1') },
        { category: 'Essentials', question: t('faq.q2'), answer: t('faq.a2') },
        { category: 'Money', question: t('faq.q3'), answer: t('faq.a3') },
        { category: 'Money', question: t('faq.q4'), answer: t('faq.a4') },
        { category: 'Logistics', question: t('faq.q5'), answer: t('faq.a5') },
        { category: 'Logistics', question: t('faq.q6'), answer: t('faq.a6') },
        { category: 'Essentials', question: t('faq.q7'), answer: t('faq.a7') },
        { category: 'Growth', question: t('faq.q8'), answer: t('faq.a8') },
        { category: 'Logistics', question: t('faq.q9'), answer: t('faq.a9') }
    ];

    const categories: (Category | 'All')[] = ['All', 'Essentials', 'Money', 'Logistics', 'Growth'];
    const categoryLabels = {
        'All': t('faq.all'),
        'Essentials': t('faq.essentials'),
        'Money': t('faq.money'),
        'Logistics': t('faq.logistics'),
        'Growth': t('faq.growth')
    };

    const filteredFaqs = activeTab === 'All' ? faqs : faqs.filter(f => f.category === activeTab);

    return (
        <section className="py-32 bg-[#FDFBF7] text-[#0F1E19]">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="font-serif text-5xl md:text-6xl font-bold mb-6"
                        >
                            {t('faq.title')}
                        </motion.h2>

                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveTab(cat); setExpandedIndex(null); }}
                                    className={`px-6 py-2 rounded-full border-2 font-bold text-sm transition-all duration-300 ${activeTab === cat
                                        ? 'bg-[#0F1E19] text-white border-[#0F1E19]'
                                        : 'bg-transparent border-[#0F1E19]/10 hover:border-[#F47A44] text-[#0F1E19]/60'
                                        }`}
                                >
                                    {categoryLabels[cat]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="bg-[#F47A44] p-4 rounded-full inline-flex items-center gap-3 pr-6 text-white font-bold cursor-pointer hover:bg-[#d6602d] transition-colors">
                            <div className="bg-white text-[#F47A44] p-2 rounded-full">
                                <MessageCircle size={20} fill="currentColor" />
                            </div>
                            {t('faq.chatWithUs')}
                        </div>
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredFaqs.map((faq, index) => (
                            <motion.div
                                layout
                                key={faq.question}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                className={`
                                    cursor-pointer rounded-[2rem] p-8 border-2 transition-all duration-300 relative overflow-hidden group
                                    ${expandedIndex === index ? 'bg-[#0F1E19] text-white border-[#0F1E19] shadow-2xl scale-[1.02]' : 'bg-white border-transparent hover:border-[#F47A44]/30 hover:shadow-lg'}
                                `}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider mb-4 block ${expandedIndex === index ? 'text-[#F47A44]' : 'text-[#0F1E19]/40'}`}>
                                        {categoryLabels[faq.category]}
                                    </span>
                                    <ChevronRight
                                        size={20}
                                        className={`transform transition-transform duration-300 ${expandedIndex === index ? 'rotate-90 text-[#F47A44]' : 'text-[#0F1E19]/20'}`}
                                    />
                                </div>

                                <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
                                    {faq.question}
                                </h3>

                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className={`text-lg leading-relaxed ${expandedIndex === index ? 'text-white/80' : 'text-[#0F1E19]/60'}`}>
                                        {faq.answer}
                                    </p>
                                </div>

                                <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full transition-all duration-500 bg-[#F47A44] opacity-0 group-hover:opacity-10 pointer-events-none blur-xl`} />

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </div>
        </section>
    );
}
