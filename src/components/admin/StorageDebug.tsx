'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function StorageDebug() {
    const [testResult, setTestResult] = useState<string>('');
    const supabase = createClient();

    async function testStorage() {
        try {
            // Test 1: Check if we can connect
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            setTestResult(`Supabase URL: ${url}\n\n`);

            // Test 2: List buckets
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
            if (bucketsError) {
                setTestResult(prev => prev + `❌ Error listing buckets: ${bucketsError.message}\n`);
            } else {
                setTestResult(prev => prev + `✅ Buckets found: ${buckets?.map(b => b.name).join(', ')}\n\n`);
            }

            // Test 3: Check images bucket
            const { data: files, error: filesError } = await supabase.storage
                .from('images')
                .list('', { limit: 5 });

            if (filesError) {
                setTestResult(prev => prev + `❌ Error accessing images bucket: ${filesError.message}\n`);
            } else {
                setTestResult(prev => prev + `✅ Images bucket accessible. Files: ${files?.length || 0}\n\n`);

                // Test 4: Generate a public URL for first file
                if (files && files.length > 0) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('images')
                        .getPublicUrl(files[0].name);

                    setTestResult(prev => prev + `Sample URL: ${publicUrl}\n`);
                }
            }
        } catch (error) {
            setTestResult(prev => prev + `❌ Error: ${error}\n`);
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg border-2 border-red-500 m-4">
            <h2 className="text-xl font-bold mb-4">🔍 Storage Debug Tool</h2>
            <button
                onClick={testStorage}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                Test Supabase Storage
            </button>
            {testResult && (
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {testResult}
                </pre>
            )}
        </div>
    );
}
