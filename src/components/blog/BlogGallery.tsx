"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BlogGallery({ images }: { images: string[] }) {
    if (!images || images.length === 0) return null;

    return (
        <section className="my-16">
            <h3 className="font-serif text-3xl font-bold text-[#0F1E19] mb-8 border-l-4 border-[#F47A44] pl-4">
                Gallery
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300 ${index === 0 ? "md:col-span-2 md:row-span-2 h-96" : "h-64"}`}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        {/* Placeholder fallback since we might not have real images yet */}
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />

                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium z-0">
                            Image {index + 1}
                        </div>

                        <Image
                            src={img}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/chefs-cooking.png';
                                target.onerror = null;
                            }}
                        />

                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-20 pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
