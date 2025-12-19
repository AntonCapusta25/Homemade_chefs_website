import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
    Name: string;
    Slug: string;
    'Post Body': string;
    'Main Image': string;
    'Featured?': string;
    Category: string;
    'Meta Description': string;
    'Meta Title': string;
    'Created On': string;
    'Published On': string;
}

async function importBlogPosts() {
    try {
        // Read CSV file
        const csvPath = path.join(process.env.HOME || '', 'Downloads', 'Homemade Chefs - Blog Posts (2).csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');

        // Parse CSV
        const records: CSVRow[] = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        console.log(`Found ${records.length} blog posts to import`);

        let successCount = 0;
        let errorCount = 0;

        for (const record of records) {
            try {
                // Map CSV fields to database fields
                const blogPost = {
                    title: record.Name || record['Meta Title'] || 'Untitled',
                    slug: record.Slug,
                    category: record.Category || 'General',
                    excerpt: record['Meta Description'] || '',
                    content: record['Post Body'] || '',
                    hero_image: record['Main Image'] || null,
                    published_date: record['Published On'] ? new Date(record['Published On']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    author_name: 'Homemade Team',
                    author_role: 'Content Team',
                    author_avatar: '/hero-real-1.png',
                    tags: record.Category ? [record.Category] : [],
                    meta_title: record['Meta Title'] || record.Name,
                    meta_description: record['Meta Description'] || '',
                    is_published: record['Featured?'] !== 'false',
                    created_at: record['Created On'] ? new Date(record['Created On']).toISOString() : new Date().toISOString(),
                };

                // Insert into database
                const { data, error } = await supabase
                    .from('blog_posts')
                    .insert([blogPost])
                    .select();

                if (error) {
                    console.error(`Error inserting post "${blogPost.title}":`, error.message);
                    errorCount++;
                } else {
                    console.log(`✓ Imported: ${blogPost.title}`);
                    successCount++;
                }
            } catch (err) {
                console.error(`Error processing record:`, err);
                errorCount++;
            }
        }

        console.log(`\n=== Import Complete ===`);
        console.log(`Success: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log(`Total: ${records.length}`);

    } catch (error) {
        console.error('Fatal error during import:', error);
        process.exit(1);
    }
}

// Run the import
importBlogPosts();
