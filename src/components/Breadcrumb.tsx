'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    url?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
            {/* Home Icon */}
            <Link
                href="/"
                className="text-[#0F1E19]/60 hover:text-[#F47A44] transition-colors flex items-center gap-1"
                aria-label="Home"
            >
                <Home size={16} />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight size={16} className="text-[#0F1E19]/30" />

                        {item.url && !isLast ? (
                            <Link
                                href={item.url}
                                className="text-[#0F1E19]/60 hover:text-[#F47A44] transition-colors"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-[#F47A44] font-medium" : "text-[#0F1E19]/60"}>
                                {item.name}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
