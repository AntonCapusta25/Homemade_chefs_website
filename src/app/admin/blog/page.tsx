'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, CheckCheck } from 'lucide-react';
import { getAllPostsAdmin, deletePost, publishAllUnpublished } from '@/actions/blog';

interface BlogPost {
    id: number;
    title: string;
    is_published: boolean;
    created_at: string;
    slug: string;
    language: string;
}

export default function BlogManagementPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        setLoading(true);
        const result = await getAllPostsAdmin();
        if (result.success && result.data) {
            // Only show English posts (translations are managed within each post)
            const englishPosts = result.data.filter((p: BlogPost) => p.language === 'en');
            setPosts(englishPosts);
        }
        setLoading(false);
    }

    async function handlePublishAll() {
        const unpublishedCount = posts.filter(p => !p.is_published).length;

        if (unpublishedCount === 0) {
            alert('All posts are already published!');
            return;
        }

        if (!confirm(`Publish ${unpublishedCount} unpublished post(s)?`)) return;

        const result = await publishAllUnpublished();
        if (result.success) {
            alert(`Successfully published ${result.count} post(s)!`);
            loadPosts();
        } else {
            alert(`Failed to publish posts: ${result.error}`);
        }
    }

    async function handleDelete(id: number, title: string) {
        if (!confirm(`Delete "${title}"?`)) return;

        const result = await deletePost(id);
        if (result.success) {
            loadPosts();
        } else {
            alert('Failed to delete post');
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            ← Dashboard
                        </Link>
                        <h1 className="font-serif text-2xl font-bold text-[#0F1E19]">
                            Blog Posts
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePublishAll}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <CheckCheck size={18} /> Publish All Unpublished
                        </button>
                        <Link
                            href="/admin/blog/new"
                            className="bg-[#F47A44] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e66935] transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} /> New Post
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No blog posts yet</p>
                        <Link
                            href="/admin/blog/new"
                            className="text-[#F47A44] hover:underline"
                        >
                            Create your first post
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                                        Title
                                    </th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                                        Created
                                    </th>
                                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {post.title}
                                            </div>
                                            <div className="text-sm text-gray-500">/{post.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${post.is_published
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {post.is_published ? (
                                                    <>
                                                        <Eye size={12} /> Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff size={12} /> Draft
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/blog/${post.id}`}
                                                    className="p-2 text-gray-600 hover:text-[#F47A44] hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
