import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
    Name: string;
    Slug: string;
    'Post Body': string;
    'Header Image': string;
    'youtube link': string;
    Draft: string;
    Archived: string;
}

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
    if (!url) return '';
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }

    return '';
}

async function importLearningPosts() {
    try {
        console.log('📖 Reading CSV file...');

        const csvPath = path.join(process.env.HOME!, 'Downloads', 'Homemade Chefs - Learning Posts.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');

        const records: CSVRow[] = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`✅ Found ${records.length} learning posts in CSV\n`);

        let imported = 0;
        let skipped = 0;

        for (const record of records) {
            // Skip archived or draft posts
            if (record.Archived === 'true' || record.Draft === 'true') {
                console.log(`⏭️  Skipping "${record.Name}" (archived or draft)`);
                skipped++;
                continue;
            }

            // Extract YouTube ID
            const youtubeId = extractYouTubeId(record['youtube link']);
            const youtubeUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : '';

            // Prepare learning page data
            const pageData = {
                title: record.Name,
                slug: record.Slug,
                body_content: record['Post Body'] || `<p>${record.Name}</p>`,
                hero_image: record['Header Image'] || null,
                youtube_url: youtubeUrl || null,
                meta_title: record.Name,
                meta_description: record.Name,
                language: 'en',
                is_published: true
            };

            // Check if page already exists
            const { data: existing } = await supabase
                .from('learning_pages')
                .select('id, title')
                .eq('slug', pageData.slug)
                .eq('language', 'en')
                .maybeSingle();

            if (existing) {
                console.log(`⚠️  Page "${record.Name}" already exists (ID: ${existing.id})`);
                skipped++;
                continue;
            }

            // Insert the page
            const { data, error } = await supabase
                .from('learning_pages')
                .insert([pageData])
                .select()
                .single();

            if (error) {
                console.error(`❌ Error importing "${record.Name}":`, error.message);
                skipped++;
            } else {
                console.log(`✅ Imported "${record.Name}" (ID: ${data.id})${youtubeUrl ? ' with video' : ''}`);
                imported++;
            }
        }

        console.log(`\n📊 Import Summary:`);
        console.log(`   ✅ Imported: ${imported}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   📝 Total: ${records.length}`);

    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

// Run the import
importLearningPosts()
    .then(() => {
        console.log('\n🎉 Import complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
