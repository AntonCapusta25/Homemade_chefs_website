"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";

const faqs = [
    {
        question: "What is Homemade?",
        answer: "Homemade is an innovative food delivery platform that transforms home kitchens into personal restaurants. We empower passionate home chefs to create and sell delicious, fresh meals directly to hungry customers locally."
    },
    {
        question: "Do I need professional cooking credentials?",
        answer: "No, you don't need to be a trained chef. You just need to register with the KVK, follow food safety standards, and comply with NVWA regulations. Your passion for cooking is what matters most!"
    },
    {
        question: "How do I get paid for my meals?",
        answer: "Payments are simple. Set your prices, sell meals, and request payouts whenever you like. Funds typically arrive in your account within 2-4 business days."
    },
    {
        question: "How does packaging work?",
        answer: "You handle packaging to ensure it matches your brand and keeps food fresh. We provide recommendations for eco-friendly and professional packaging suppliers."
    },
    {
        question: "How does delivery work?",
        answer: "You choose: deliver yourself or set up a pickup location. You control your delivery radius and schedule, making it easy to manage logistics on your terms."
    },
    {
        question: "How much can I earn per week/month?",
        answer: "Many chefs earn between €200 and €2,000+ monthly. It depends on your menu, pricing, and how often you cook. The sky is the limit if your food is a hit!"
    },
    {
        question: "How will customers find my meals?",
        answer: "We market your profile via our app, social media, and email campaigns. You also get a personal storefront link to share with your own network."
    },
    {
        question: "Can I choose my cooking schedule?",
        answer: "Yes! You have total freedom. Cook every day or just on weekends. Update your availability instantly in the app to match your life."
    },
    {
        question: "Is Homemade available everywhere?",
        answer: "We are currently active in major Dutch cities including Amsterdam, Rotterdam, and Enschede, and we are rapidly expanding to new regions."
    }
];

export default function FAQHorizontal() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 400; // Approx card width
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-[#EBE9E1] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header with Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="font-serif text-4xl md:text-5xl font-bold text-[#0F1E19] mb-4"
                        >
                            Common Questions
                        </motion.h2>
                        <p className="text-[#0F1E19]/70 text-lg">
                            Everything you need to know to get started.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button onClick={() => scroll('left')} className="p-4 rounded-full border border-[#0F1E19]/20 hover:bg-[#0F1E19] hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-4 rounded-full border border-[#0F1E19]/20 hover:bg-[#0F1E19] hover:text-white transition-colors">
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Area */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center"
                        >
                            <div
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={`h-full bg-white rounded-[2rem] p-8 cursor-pointer border-2 transition-all duration-300 ${openIndex === index ? 'border-[#F47A44] shadow-lg' : 'border-transparent shadow-sm hover:shadow-md'}`}
                            >
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <h3 className={`font-serif text-2xl font-bold leading-tight ${openIndex === index ? 'text-[#F47A44]' : 'text-[#0F1E19]'}`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`p-2 rounded-full flex-shrink-0 transition-colors ${openIndex === index ? 'bg-[#F47A44] text-white' : 'bg-[#EBE9E1] text-[#0F1E19]'}`}>
                                        {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-[#0F1E19]/70 leading-relaxed text-lg">
                                        {faq.answer}
                                    </p>
                                </div>

                                {/* Hint Content if closed? Optional. 
                                    Let's keep it clean. Just title when closed. 
                                */}
                                {openIndex !== index && (
                                    <p className="text-[#0F1E19]/40 mt-4 line-clamp-2">
                                        {faq.answer.substring(0, 80)}...
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
