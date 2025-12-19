
import AccessoriesHero from '@/components/AccessoriesHero';
import FAQCreative from '@/components/FAQCreative';
import LiveSupport from '@/components/LiveSupport';
import Image from 'next/image';
import { Star, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AccessoriesTemplate({ data, isEditor = false, onUpdate }: { data: any, isEditor?: boolean, onUpdate?: (field: string, value: any) => void }) {
    const hero = data?.hero || {};
    const products = data?.products || [];

    const LinkWrapper = isEditor ? 'div' : Link;

    return (
        <div className="bg-white min-h-screen">
            <AccessoriesHero title={hero.title} subtitle={hero.subtitle} onUpdate={onUpdate} />

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-5xl font-bold text-[#0F1E19]">Essential Gear</h2>
                    <div className="w-24 h-1 bg-[#F47A44] mx-auto mt-6"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {products.map((product: any, idx: number) => (
                        <div key={product.id || idx} className="group cursor-pointer">
                            <div className="relative aspect-square bg-[#F9F9F9] rounded-xl overflow-hidden mb-6 flex items-center justify-center p-8 group-hover:bg-[#F0EEE6] transition-colors duration-500">
                                {/* Badges */}
                                {product.badge && (
                                    <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 text-white tracking-widest uppercase z-10 ${product.badge === 'BEST SELLER' ? 'bg-[#0F1E19]' :
                                        product.badge === 'NEW' ? 'bg-[#0F1E19]' : 'bg-[#76B041]'
                                        }`}>
                                        {product.badge}
                                    </span>
                                )}

                                {product.image ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <ShoppingBag size={64} className="text-gray-200" />
                                )}
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[#F47A44] text-xs font-bold tracking-[0.15em] uppercase">
                                    {product.category || 'GEAR'}
                                </span>
                                {product.rating && (
                                    <div className="flex items-center gap-1 text-[#0F1E19] font-bold text-xs">
                                        <Star size={12} fill="#F47A44" className="text-[#F47A44]" />
                                        {product.rating}
                                    </div>
                                )}
                            </div>

                            <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-2 group-hover:text-[#F47A44] transition-colors">
                                {product.name}
                            </h3>

                            <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-4">
                                <span className="text-gray-500 text-lg">{product.price}</span>
                                <LinkWrapper
                                    href={!isEditor ? `/accessories/${product.id}` : '#'}
                                    className={`font-bold text-[#0F1E19] text-sm border-b-2 border-[#0F1E19] pb-0.5 hover:text-[#F47A44] hover:border-[#F47A44] transition-all ${isEditor ? 'cursor-default' : ''}`}
                                >
                                    View Details
                                </LinkWrapper>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p>No products available.</p>
                    </div>
                )}
            </section>

            <FAQCreative />
            <LiveSupport />
        </div>
    );
}
