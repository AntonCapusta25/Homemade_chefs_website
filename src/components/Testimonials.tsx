"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const testimonials = [
    {
        name: "Gilberto",
        role: "STUDENT CHEF",
        text: "Gilberto, a busy student, balances studies and earns money by selling his homemade Mexican tacos through Homemade.",
        image: "/food-tacos.png",
        logo: "/logo-tacos.png",
        accent: "bg-orange-50"
    },
    {
        name: "Mama DD's",
        role: "STAY-AT-HOME MOM",
        text: "Mama DD's turned her love for African food into a thriving home-food business—all from her kitchen.",
        image: "/food-jollof.png",
        logo: "/logo-mama.png",
        accent: "bg-green-50"
    },
    {
        name: "Fresh Bistro",
        role: "INDEPENDENT CHEF",
        text: "1 out of 4 chefs are hitting €200+/day with Homemade's seamless order system. It's truly game changing.",
        image: "/food-mezze.png",
        logo: "/logo-fresh.png",
        accent: "bg-teal-50"
    },
    {
        name: "Tortilla King",
        role: "POP-UPS",
        text: "Weekend pop-ups are now a €500/day success story for home chefs. The platform makes it effortless.",
        image: "/food-tacos.png",
        logo: "/logo-tacos.png",
        accent: "bg-yellow-50"
    },
    {
        name: "Mama's Kitchen",
        role: "COMMUNITY LEADER",
        text: "Building a loyal community of food lovers has never been easier. I love sharing my culture through food.",
        image: "/food-jollof.png",
        logo: "/logo-mama.png",
        accent: "bg-blue-50"
    }
];

export default function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    return (
        <section className="py-24 overflow-hidden bg-[#FDFBF7]" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-serif text-4xl md:text-5xl font-bold text-[#0F1E19] mb-4"
                >
                    Proven success. Real results.
                </motion.h2>
                <div className="w-24 h-1 bg-[#F47A44] mx-auto rounded-full"></div>
            </div>

            <motion.div
                className="flex gap-8 px-6 cursor-grab active:cursor-grabbing w-max"
                drag="x"
                dragConstraints={containerRef}
                style={{ x }}
            >
                {testimonials.map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02, y: -10 }}
                        className={`relative w-[300px] md:w-[350px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 bg-white group flex-shrink-0`}
                    >
                        {/* Quote Decoration */}
                        <div className="absolute top-4 right-4 z-10 opacity-10 font-serif text-8xl leading-none">&quot;</div>

                        {/* Image Section */}
                        <div className="relative h-64 w-full overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Logo Badge */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg z-20 overflow-hidden">
                                <Image
                                    src={item.logo}
                                    alt={`${item.name} logo`}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className={`pt-12 pb-8 px-8 text-center ${item.accent} group-hover:bg-opacity-50 transition-colors`}>
                            <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">{item.role}</h3>
                            <p className="text-gray-700 font-medium leading-relaxed">{item.text}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
