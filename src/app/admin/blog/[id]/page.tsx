'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogTranslationEditor from '@/components/admin/BlogTranslationEditor';

export default function BlogEditorPage() {
    const params = useParams();
    const isNew = params.id === 'new';
    const postId = isNew ? null : parseInt(params.id as string);

    if (isNew) {
        return (
            <div className="min-h-screen bg-[#FDFBF7]">
                {/* Header */}
                <nav className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <Link
                            href="/admin/blog"
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> Back to Posts
                        </Link>
                    </div>
                </nav>

                {/* Content */}
                <main className="max-w-6xl mx-auto px-6 py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Create New Blog Post
                        </h2>
                        <p className="text-gray-600 mb-4">
                            To create a new blog post with translations, please use the import feature or create an English post first.
                        </p>
                        <Link
                            href="/admin/blog"
                            className="inline-block bg-[#F47A44] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e66935]"
                        >
                            Back to Blog List
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/blog"
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> Back to Posts
                        </Link>
                        <h1 className="font-serif text-2xl font-bold text-[#0F1E19]">
                            Edit Blog Post
                        </h1>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <BlogTranslationEditor postId={postId!} />
            </main>
        </div>
    );
}
