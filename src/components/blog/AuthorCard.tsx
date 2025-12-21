import Image from 'next/image';
// import { Author } from '@/data/blogPosts';
export interface Author {
    name: string;
    role: string;
    avatar: string;
}

export default function AuthorCard({ author }: { author: Author }) {
    return (
        <div className="bg-[#E6DCC3]/20 p-8 rounded-2xl flex items-center gap-6 mt-16 border border-[#E6DCC3]/50">
            <div className="relative w-20 h-20 flex-shrink-0">
                <div className="absolute inset-0 bg-[#F47A44] rounded-full opacity-10 scale-110" />
                <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    sizes="80px"
                    className="object-cover rounded-full border-2 border-white shadow-md bg-gray-200"
                />
            </div>
            <div>
                <span className="text-[#F47A44] font-bold text-xs uppercase tracking-wider mb-1 block">
                    Written By
                </span>
                <h4 className="font-serif text-xl font-bold text-[#0F1E19]">
                    {author.name}
                </h4>
                <p className="text-[#0F1E19]/60 text-sm mt-1">
                    {author.role}
                </p>
                <p className="text-[#0F1E19]/70 text-sm mt-3 leading-relaxed">
                    Passionate about sharing insights on culinary trends and kitchen management. Bringing you the latest updates from the heart of the industry.
                </p>
            </div>
        </div>
    );
}
