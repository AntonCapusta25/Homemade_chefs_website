'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Languages, Loader2, Save, RefreshCw } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    hero_image: string | null;
    meta_title: string | null;
    meta_description: string | null;
    category: string;
    tags: string[] | null;
    language: string;
}

interface BlogTranslationEditorProps {
    postId: number;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', color: 'blue' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', color: 'orange' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', color: 'indigo' }
] as const;

export default function BlogTranslationEditor({ postId }: BlogTranslationEditorProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'nl' | 'fr'>('en');
    const [posts, setPosts] = useState<Record<string, BlogPost | null>>({
        en: null,
        nl: null,
        fr: null
    });
    const [translating, setTranslating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        loadPosts();
    }, [postId]);

    async function loadPosts() {
        setLoading(true);
        setError(null);

        try {
            const { data: enPost } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', postId)
                .eq('language', 'en')
                .single();

            if (!enPost) {
                setError('English post not found');
                return;
            }

            const { data: nlPost } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('translated_from_id', postId)
                .eq('language', 'nl')
                .maybeSingle();

            const { data: frPost } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('translated_from_id', postId)
                .eq('language', 'fr')
                .maybeSingle();

            setPosts({
                en: enPost,
                nl: nlPost,
                fr: frPost
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }

    async function handleTranslate(targetLang: 'nl' | 'fr') {
        setTranslating(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/translate-post`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        postId,
                        targetLang
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Translation failed');
            }

            const { translations } = await response.json();

            setPosts(prev => ({
                ...prev,
                [targetLang]: {
                    ...prev[targetLang],
                    ...translations
                } as BlogPost
            }));

            alert(`✅ Translation complete! Review and save when ready.`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Translation failed');
            alert(`❌ Translation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setTranslating(false);
        }
    }

    async function handleSave(lang: 'en' | 'nl' | 'fr') {
        const post = posts[lang];
        if (!post) return;

        setSaving(true);
        try {
            const { error: saveError } = await supabase
                .from('blog_posts')
                .update({
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    hero_image: post.hero_image,
                    meta_title: post.meta_title,
                    meta_description: post.meta_description
                })
                .eq('id', post.id);

            if (saveError) throw saveError;

            alert(`✅ ${lang.toUpperCase()} version saved!`);
        } catch (err) {
            alert(`❌ Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-[#F47A44]" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                <p className="text-red-800 font-medium">❌ {error}</p>
            </div>
        );
    }

    const currentPost = posts[activeTab];
    const currentLang = LANGUAGES.find(l => l.code === activeTab)!;

    return (
        <div className="space-y-6">
            {/* Language Tabs - Modern Design */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-2">
                <div className="flex gap-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setActiveTab(lang.code)}
                            className={`flex-1 py-4 px-6 rounded-lg font-semibold text-sm transition-all ${activeTab === lang.code
                                ? 'bg-gradient-to-r from-[#F47A44] to-[#E86825] text-white shadow-lg shadow-[#F47A44]/30'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl">{lang.flag}</span>
                                <span>{lang.name}</span>
                                {!posts[lang.code] && lang.code !== 'en' && (
                                    <span className="text-xs opacity-75">(Not created)</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Translation Action Bar */}
            {activeTab !== 'en' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <Languages className="text-[#F47A44]" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">AI Translation</h3>
                                <p className="text-sm text-gray-600">
                                    {currentPost ? 'Update translation' : 'Create translation'} from English using Gemini AI
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleTranslate(activeTab)}
                            disabled={translating}
                            className="px-6 py-3 bg-gradient-to-r from-[#F47A44] to-[#E86825] text-white rounded-lg font-bold hover:shadow-lg hover:shadow-[#F47A44]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                        >
                            {translating ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Translating...
                                </>
                            ) : (
                                <>
                                    <Languages size={18} />
                                    Translate from English
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Editor Form */}
            {currentPost ? (
                <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
                        <h2 className="font-bold text-lg text-gray-900">
                            {currentLang.flag} {currentLang.name} Content
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={currentPost.title}
                                onChange={(e) => setPosts(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPost, title: e.target.value }
                                }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent font-semibold text-lg"
                                placeholder="Post title..."
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={currentPost.excerpt}
                                onChange={(e) => setPosts(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPost, excerpt: e.target.value }
                                }))}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent"
                                placeholder="Short description..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Content (HTML)
                            </label>
                            <textarea
                                value={currentPost.content}
                                onChange={(e) => setPosts(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPost, content: e.target.value }
                                }))}
                                rows={20}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent font-mono text-sm"
                                placeholder="HTML content..."
                            />
                        </div>

                        {/* Hero Image */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Hero Image
                            </label>
                            <ImageUpload
                                value={currentPost.hero_image || ''}
                                onChange={(url) => setPosts(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPost, hero_image: url }
                                }))}
                            />
                        </div>

                        {/* SEO Fields */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-gray-100">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={currentPost.meta_title || ''}
                                    onChange={(e) => setPosts(prev => ({
                                        ...prev,
                                        [activeTab]: { ...currentPost, meta_title: e.target.value }
                                    }))}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent text-sm"
                                    placeholder="SEO title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Meta Description
                                </label>
                                <input
                                    type="text"
                                    value={currentPost.meta_description || ''}
                                    onChange={(e) => setPosts(prev => ({
                                        ...prev,
                                        [activeTab]: { ...currentPost, meta_description: e.target.value }
                                    }))}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent text-sm"
                                    placeholder="SEO description..."
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                            <button
                                onClick={() => loadPosts()}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Reset
                            </button>
                            <button
                                onClick={() => handleSave(activeTab)}
                                disabled={saving}
                                className="px-8 py-3 bg-gradient-to-r from-[#0F1E19] to-[#1a2f28] text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save {activeTab.toUpperCase()}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-16 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Languages className="text-[#F47A44]" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No {activeTab.toUpperCase()} translation yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Click the button above to create a translation using AI
                    </p>
                </div>
            )}
        </div>
    );
}
