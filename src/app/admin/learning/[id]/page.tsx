'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LearningTranslationEditor from '@/components/admin/LearningTranslationEditor';

export default function LearningEditorPage() {
    const params = useParams();
    const isNew = params.id === 'new';
    const pageId = isNew ? null : parseInt(params.id as string);

    if (isNew) {
        return (
            <div className="min-h-screen bg-[#FDFBF7]">
                {/* Header */}
                <nav className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <Link
                            href="/admin/learning"
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> Back to Pages
                        </Link>
                    </div>
                </nav>

                {/* Content */}
                <main className="max-w-6xl mx-auto px-6 py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Create New Learning Page
                        </h2>
                        <p className="text-gray-600 mb-4">
                            To create a new learning page with translations, please create an English page first.
                        </p>
                        <Link
                            href="/admin/learning"
                            className="inline-block bg-[#F47A44] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e66935]"
                        >
                            Back to Learning Pages
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
                    <Link
                        href="/admin/learning"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back to Pages
                    </Link>
                </div>
            </nav>

            {/* Editor */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <LearningTranslationEditor pageId={pageId} />
            </main>
        </div>
    );
}
