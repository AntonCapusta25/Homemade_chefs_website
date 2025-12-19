'use client';

import Link from 'next/link';
import { FileText, BookOpen, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/actions/auth';
import { useEffect, useState } from 'react';
import { getAllPostsAdmin } from '@/actions/blog';
import { getAllLearningPagesAdmin } from '@/actions/learning';

export default function AdminDashboard() {
    const router = useRouter();
    const [blogCount, setBlogCount] = useState({ total: 0, drafts: 0 });
    const [learningCount, setLearningCount] = useState({ total: 0, drafts: 0 });

    useEffect(() => {
        async function loadStats() {
            try {
                const blogResult = await getAllPostsAdmin();
                if (blogResult.success && blogResult.data) {
                    const total = blogResult.data.length;
                    const drafts = blogResult.data.filter((p: any) => !p.is_published).length;
                    setBlogCount({ total, drafts });
                }
            } catch (error) {
                console.error('Error loading blog stats:', error);
            }

            try {
                const learningResult = await getAllLearningPagesAdmin();
                if (learningResult.success && learningResult.data) {
                    const total = learningResult.data.length;
                    const drafts = learningResult.data.filter((p: any) => !p.is_published).length;
                    setLearningCount({ total, drafts });
                }
            } catch (error) {
                console.error('Error loading learning stats:', error);
            }
        }
        loadStats();
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="font-serif text-2xl font-bold text-[#0F1E19]">
                    CMS Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Blog Posts Card */}
                    <Link
                        href="/admin/blog"
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="w-14 h-14 bg-[#F47A44]/10 rounded-xl flex items-center justify-center text-[#F47A44] mb-4">
                            <FileText size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F1E19] mb-2">
                            Blog Posts
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {blogCount.total} {blogCount.total === 1 ? 'post' : 'posts'}
                            {blogCount.drafts > 0 && ` • ${blogCount.drafts} ${blogCount.drafts === 1 ? 'draft' : 'drafts'}`}
                        </p>
                        <div className="text-[#F47A44] font-medium group-hover:translate-x-1 transition-transform inline-block">
                            Manage Posts →
                        </div>
                    </Link>

                    {/* Learning Pages Card */}
                    <Link
                        href="/admin/learning"
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="w-14 h-14 bg-[#F47A44]/10 rounded-xl flex items-center justify-center text-[#F47A44] mb-4">
                            <BookOpen size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F1E19] mb-2">
                            Learning Pages
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {learningCount.total} {learningCount.total === 1 ? 'page' : 'pages'}
                            {learningCount.drafts > 0 && ` • ${learningCount.drafts} ${learningCount.drafts === 1 ? 'draft' : 'drafts'}`}
                        </p>
                        <div className="text-[#F47A44] font-medium group-hover:translate-x-1 transition-transform inline-block">
                            Manage Pages →
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
