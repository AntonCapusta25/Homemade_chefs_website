"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, Star, Plus } from 'lucide-react';

const products = [
    {
        id: 1,
        name: "Professional Chef Knife",
        price: "€89.99",
        category: "Tools",
        image: "/merch-knife.png", // Using generated image
        rating: 4.9,
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Premium Chef Hoodie",
        price: "€49.99",
        category: "Apparel",
        image: "/merch-hoodie.png", // Using generated image
        rating: 4.8,
        badge: "New"
    },
    {
        id: 3,
        name: "Insulated Delivery Bag",
        price: "€34.99",
        category: "Gear",
        image: "/official-bag-ref.png", // Using the exact user-uploaded reference image
        rating: 4.9
    },
    {
        id: 4,
        name: "Homemade Apron",
        price: "€29.99",
        category: "Apparel",
        image: "/merch-apron.png", // Reusing an existing one or placeholder if not generated yet, will fallback to generic if missing
        rating: 4.7
    },
    {
        id: 5,
        name: "Eco-Friendly Containers",
        price: "€19.99",
        category: "Supplies",
        image: "/merch-containers.png", // Placeholder
        rating: 4.6
    },
    {
        id: 6,
        name: "Chef's Cap",
        price: "€14.99",
        category: "Apparel",
        image: "/merch-cap.png", // Placeholder
        rating: 4.5
    }
];

export default function AccessoriesShop() {
    return (
        <section className="py-24 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="font-serif text-5xl font-bold text-[#0F1E19] mb-4">Essential Gear</h2>
                    <div className="w-24 h-1 bg-[#F47A44] mx-auto rounded-full" />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#FDFBF7] rounded-none overflow-hidden hover:shadow-2xl transition-shadow duration-500 border border-gray-100"
                        >
                            {/* Product Badge */}
                            {product.badge && (
                                <div className="absolute top-6 left-6 z-10 bg-[#0F1E19] text-white text-xs font-bold px-3 py-1 rounded-none uppercase tracking-wider">
                                    {product.badge}
                                </div>
                            )}

                            {/* Image Container - Boxed with slim border effect via the parent padding/border */}
                            <div className="relative h-80 w-full p-8 flex items-center justify-center bg-white border-b border-gray-50 group-hover:bg-gray-50 transition-colors duration-500">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={400}
                                    height={400}
                                    className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        // Fallback logic if image missing
                                        const target = e.target as HTMLImageElement;
                                        target.style.opacity = '0.5';
                                    }}
                                />

                                {/* Quick Add Button Overlay */}
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                    <button aria-label="Add to cart" className="bg-[#F47A44] text-white p-3 rounded-none shadow-none hover:bg-[#d65f2c] transition-colors">
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-bold text-[#F47A44] uppercase tracking-wider">{product.category}</p>
                                    <div className="flex items-center gap-1 text-[#F47A44]">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-sm font-bold text-[#0F1E19]">{product.rating}</span>
                                    </div>
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-2">{product.name}</h3>
                                <div className="flex justify-between items-end">
                                    <p className="text-xl font-medium text-[#0F1E19]/60">{product.price}</p>
                                    <button className="text-sm font-bold text-[#0F1E19] border-b-2 border-[#0F1E19] hover:text-[#F47A44] hover:border-[#F47A44] transition-colors pb-0.5">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
