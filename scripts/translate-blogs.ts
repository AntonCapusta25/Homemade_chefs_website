import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
    console.error('❌ Missing environment variables');
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    meta_title: string | null;
    meta_description: string | null;
    category: string;
    tags: string[] | null;
}

const LANGUAGE_NAMES = {
    nl: 'Dutch',
    fr: 'French'
};

async function translateText(text: string, targetLang: 'nl' | 'fr'): Promise<string> {
    const langName = LANGUAGE_NAMES[targetLang];

    const prompt = `You are a professional translator specializing in food, culinary, and business content.
Translate the following text from English to ${langName}.

CRITICAL RULES:
1. Preserve ALL HTML tags exactly as they are (including <p>, <h2>, <strong>, <a>, etc.)
2. Translate ONLY the text content between tags
3. Maintain the same tone and professional style
4. Use natural, native-sounding ${langName}
5. Keep technical terms and brand names consistent
6. Do NOT add explanations or notes - output ONLY the translated text

Text to translate:
${text}

Translated ${langName} text:`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error(`❌ Translation error:`, error);
        throw error;
    }
}

async function translateBlogPost(post: BlogPost, targetLang: 'nl' | 'fr'): Promise<Partial<BlogPost>> {
    console.log(`  📝 Translating: "${post.title}"`);

    const [title, excerpt, content, metaTitle, metaDescription] = await Promise.all([
        translateText(post.title, targetLang),
        translateText(post.excerpt, targetLang),
        translateText(post.content, targetLang),
        post.meta_title ? translateText(post.meta_title, targetLang) : Promise.resolve(null),
        post.meta_description ? translateText(post.meta_description, targetLang) : Promise.resolve(null)
    ]);

    return {
        title,
        excerpt,
        content,
        meta_title: metaTitle,
        meta_description: metaDescription
    };
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const limitArg = args.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
    const langArg = args.find(arg => arg.startsWith('--lang='));
    const targetLangs: ('nl' | 'fr')[] = langArg
        ? [langArg.split('=')[1] as 'nl' | 'fr']
        : ['nl', 'fr'];

    console.log('🌍 Blog Translation Script');
    console.log('━'.repeat(50));
    console.log(`Mode: ${dryRun ? '🧪 DRY RUN (no database updates)' : '✅ LIVE'}`);
    console.log(`Languages: ${targetLangs.join(', ').toUpperCase()}`);
    console.log(`Limit: ${limit || 'All posts'}`);
    console.log('━'.repeat(50));
    console.log('');

    // Fetch English posts
    let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('language', 'en')
        .eq('is_published', true)
        .order('id');

    if (limit) {
        query = query.limit(limit);
    }

    const { data: englishPosts, error } = await query;

    if (error || !englishPosts) {
        console.error('❌ Error fetching posts:', error);
        return;
    }

    console.log(`📚 Found ${englishPosts.length} English posts to translate\n`);

    let totalTranslated = 0;
    let totalFailed = 0;

    for (const lang of targetLangs) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`🌐 Translating to ${LANGUAGE_NAMES[lang].toUpperCase()}`);
        console.log(`${'='.repeat(50)}\n`);

        for (let i = 0; i < englishPosts.length; i++) {
            const post = englishPosts[i];
            console.log(`[${i + 1}/${englishPosts.length}] Processing: ${post.title}`);

            try {
                // Translate the post
                const translated = await translateBlogPost(post, lang);

                if (dryRun) {
                    console.log(`  ✅ Translated (dry run - not saved)`);
                    console.log(`  📊 Title: ${translated.title?.substring(0, 60)}...`);
                } else {
                    // Find the corresponding translated post
                    const { data: existingPost } = await supabase
                        .from('blog_posts')
                        .select('id')
                        .eq('translated_from_id', post.id)
                        .eq('language', lang)
                        .single();

                    if (existingPost) {
                        // Update existing translation
                        const { error: updateError } = await supabase
                            .from('blog_posts')
                            .update(translated)
                            .eq('id', existingPost.id);

                        if (updateError) {
                            console.error(`  ❌ Update failed:`, updateError.message);
                            totalFailed++;
                        } else {
                            console.log(`  ✅ Updated translation`);
                            totalTranslated++;
                        }
                    } else {
                        console.log(`  ⚠️  No existing translation found (skipping)`);
                    }
                }

                // Rate limiting - wait 1 second between requests
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`  ❌ Failed:`, error instanceof Error ? error.message : error);
                totalFailed++;
            }
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 SUMMARY');
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Successfully translated: ${totalTranslated}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`🌍 Languages: ${targetLangs.join(', ').toUpperCase()}`);

    if (dryRun) {
        console.log('\n💡 This was a dry run. Run without --dry-run to save translations.');
    }
}

main().catch(console.error);
