/**
 * Script to create Dutch and French versions of all English blog posts
 * 
 * This creates duplicate posts with:
 * - Same content (English text initially - to be translated manually later)
 * - Same slug (will work with /nl/ and /fr/ URL prefixes)
 * - language set to 'nl' or 'fr'
 * - translated_from_id linking to original English post
 * 
 * Usage: npx tsx scripts/create-blog-translations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBlogTranslations() {
    console.log('🌍 Creating blog post translations...\n');

    // 1. Fetch all English blog posts
    const { data: englishPosts, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('language', 'en')
        .is('translated_from_id', null); // Only original posts

    if (fetchError) {
        console.error('❌ Error fetching English posts:', fetchError);
        return;
    }

    if (!englishPosts || englishPosts.length === 0) {
        console.log('ℹ️  No English blog posts found.');
        return;
    }

    console.log(`📝 Found ${englishPosts.length} English blog posts\n`);

    let nlCreated = 0;
    let frCreated = 0;
    let nlSkipped = 0;
    let frSkipped = 0;

    // 2. For each English post, create NL and FR versions
    for (const post of englishPosts) {
        console.log(`Processing: "${post.title}"`);

        // Check if Dutch version already exists
        const { data: existingNL } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', `${post.slug}-nl`)
            .eq('language', 'nl')
            .single();

        if (!existingNL) {
            // Create Dutch version (same content, will be translated manually later)
            const nlPost = {
                title: post.title, // Keep English for now
                slug: `${post.slug}-nl`, // Unique slug for Dutch
                excerpt: post.excerpt,
                content: post.content, // Keep English for now
                hero_image: post.hero_image,
                category: post.category,
                tags: post.tags,
                author_name: post.author_name,
                is_published: post.is_published,
                published_date: post.published_date,
                language: 'nl',
                translated_from_id: post.id
            };

            const { error: nlError } = await supabase
                .from('blog_posts')
                .insert(nlPost);

            if (nlError) {
                console.error(`  ❌ Error creating Dutch version:`, nlError.message);
            } else {
                console.log(`  ✅ Created Dutch version (NL)`);
                nlCreated++;
            }
        } else {
            console.log(`  ⏭️  Dutch version already exists`);
            nlSkipped++;
        }

        // Check if French version already exists
        const { data: existingFR } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', `${post.slug}-fr`)
            .eq('language', 'fr')
            .single();

        if (!existingFR) {
            // Create French version (same content, will be translated manually later)
            const frPost = {
                title: post.title, // Keep English for now
                slug: `${post.slug}-fr`, // Unique slug for French
                excerpt: post.excerpt,
                content: post.content, // Keep English for now
                hero_image: post.hero_image,
                category: post.category,
                tags: post.tags,
                author_name: post.author_name,
                is_published: post.is_published,
                published_date: post.published_date,
                language: 'fr',
                translated_from_id: post.id
            };

            const { error: frError } = await supabase
                .from('blog_posts')
                .insert(frPost);

            if (frError) {
                console.error(`  ❌ Error creating French version:`, frError.message);
            } else {
                console.log(`  ✅ Created French version (FR)`);
                frCreated++;
            }
        } else {
            console.log(`  ⏭️  French version already exists`);
            frSkipped++;
        }

        console.log('');
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ Dutch versions created: ${nlCreated}`);
    console.log(`  ✅ French versions created: ${frCreated}`);
    console.log(`  ⏭️  Dutch versions skipped (already exist): ${nlSkipped}`);
    console.log(`  ⏭️  French versions skipped (already exist): ${frSkipped}`);
    console.log(`\n🎉 Done! Blog posts are now available at:`);
    console.log(`  - /en/blog/[slug] (English - original)`);
    console.log(`  - /nl/blog/[slug] (Dutch - ready for translation)`);
    console.log(`  - /fr/blog/[slug] (French - ready for translation)`);
    console.log(`\n💡 Next: Manually translate the content in the admin panel`);
}

// Run the script
createBlogTranslations()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
