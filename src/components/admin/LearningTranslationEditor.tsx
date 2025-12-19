'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Languages, Loader2, Save, RefreshCw } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface LearningPage {
    id: number;
    title: string;
    slug: string;
    body_content: string;
    hero_image: string | null;
    youtube_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
    language: string;
}

interface LearningTranslationEditorProps {
    pageId: number | null;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', color: 'blue' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', color: 'orange' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', color: 'indigo' }
] as const;

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
    if (!url) return '';
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return '';
}

export default function LearningTranslationEditor({ pageId }: LearningTranslationEditorProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'nl' | 'fr'>('en');
    const [pages, setPages] = useState<Record<string, LearningPage | null>>({
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
        if (pageId) loadPages();
    }, [pageId]);

    async function loadPages() {
        setLoading(true);
        setError(null);

        try {
            const { data: enPage } = await supabase
                .from('learning_pages')
                .select('*')
                .eq('id', pageId)
                .eq('language', 'en')
                .single();

            if (!enPage) {
                setError('English page not found');
                return;
            }

            const { data: nlPage } = await supabase
                .from('learning_pages')
                .select('*')
                .eq('source_id', pageId)
                .eq('language', 'nl')
                .maybeSingle();

            const { data: frPage } = await supabase
                .from('learning_pages')
                .select('*')
                .eq('source_id', pageId)
                .eq('language', 'fr')
                .maybeSingle();

            setPages({
                en: enPage,
                nl: nlPage,
                fr: frPage
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load pages');
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
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/translate-learning-page`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pageId,
                        targetLang
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Translation failed');
            }

            const { translations } = await response.json();

            setPages(prev => ({
                ...prev,
                [targetLang]: {
                    ...prev[targetLang],
                    ...translations
                } as LearningPage
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
        const page = pages[lang];
        if (!page) return;

        setSaving(true);
        try {
            const { error: saveError } = await supabase
                .from('learning_pages')
                .update({
                    title: page.title,
                    body_content: page.body_content,
                    hero_image: page.hero_image,
                    youtube_url: page.youtube_url,
                    meta_title: page.meta_title,
                    meta_description: page.meta_description
                })
                .eq('id', page.id);

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

    const currentPage = pages[activeTab];
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
                                {!pages[lang.code] && lang.code !== 'en' && (
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
                                    {currentPage ? 'Update translation' : 'Create translation'} from English using Gemini AI
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
            {currentPage ? (
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
                                Title *
                            </label>
                            <input
                                type="text"
                                value={currentPage.title}
                                onChange={(e) => setPages(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPage, title: e.target.value }
                                }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent"
                                placeholder="Post title..."
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Slug * (URL path)
                            </label>
                            <input
                                type="text"
                                value={currentPage.slug}
                                onChange={(e) => setPages(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }
                                }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent font-mono text-sm"
                                placeholder="page-url-slug"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Used in URL: /{currentPage.language}/learning/<span className="font-semibold">{currentPage.slug || 'slug'}</span>
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={currentPage.body_content}
                                onChange={(e) => setPages(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPage, excerpt: e.target.value }
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
                                value={currentPage.body_content}
                                onChange={(e) => setPages(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPage, content: e.target.value }
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
                                value={currentPage.hero_image || ''}
                                onChange={(url) => setPages(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPage, hero_image: url }
                                }))}
                            />
                        </div>

                        {/* YouTube URL */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-red-600">▶</span>
                                YouTube Video URL
                            </label>
                            <input
                                type="text"
                                value={currentPage.youtube_url || ''}
                                onChange={(e) => setPages(prev => ({
                                    ...prev,
                                    [activeTab]: { ...currentPage, youtube_url: e.target.value }
                                }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent"
                                placeholder="https://www.youtube.com/watch?v=... or video ID"
                            />
                            {currentPage.youtube_url && extractYouTubeId(currentPage.youtube_url) && (
                                <div className="mt-3 rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
                                    <div className="relative pb-[56.25%]">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${extractYouTubeId(currentPage.youtube_url)}`}
                                            className="absolute top-0 left-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Video will be the same across all languages
                            </p>
                        </div>

                        {/* SEO Fields */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-gray-100">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={currentPage.meta_title || ''}
                                    onChange={(e) => setPages(prev => ({
                                        ...prev,
                                        [activeTab]: { ...currentPage, meta_title: e.target.value }
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
                                    value={currentPage.meta_description || ''}
                                    onChange={(e) => setPages(prev => ({
                                        ...prev,
                                        [activeTab]: { ...currentPage, meta_description: e.target.value }
                                    }))}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F47A44] focus:border-transparent text-sm"
                                    placeholder="SEO description..."
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                            <button
                                onClick={() => loadPages()}
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
