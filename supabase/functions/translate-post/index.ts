import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslateRequest {
    postId: number
    targetLang: 'nl' | 'fr'
    fields?: string[]
}

const LANGUAGE_NAMES = {
    nl: 'Dutch',
    fr: 'French'
}

async function translateText(text: string, targetLang: 'nl' | 'fr', geminiKey: string): Promise<string> {
    const langName = LANGUAGE_NAMES[targetLang]

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

Translated ${langName} text:`

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': geminiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error:', response.status, errorText)
        throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text.trim()
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get Supabase client with user's auth
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Verify user is authenticated and is admin
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check if user is admin
        const { data: adminUser } = await supabaseClient
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single()

        if (!adminUser) {
            return new Response(
                JSON.stringify({ error: 'Forbidden - Admin access required' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse request
        const { postId, targetLang, fields = ['title', 'excerpt', 'content', 'meta_title', 'meta_description'] }: TranslateRequest = await req.json()

        // Get the English post
        const { data: englishPost, error: fetchError } = await supabaseClient
            .from('blog_posts')
            .select('*')
            .eq('id', postId)
            .eq('language', 'en')
            .single()

        if (fetchError || !englishPost) {
            return new Response(
                JSON.stringify({ error: 'Post not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get Gemini API key from secrets
        const geminiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiKey) {
            throw new Error('GEMINI_API_KEY not configured')
        }

        // Translate requested fields
        const translations: Record<string, string> = {}

        for (const field of fields) {
            if (englishPost[field]) {
                console.log(`Translating ${field} to ${targetLang}...`)
                translations[field] = await translateText(englishPost[field], targetLang, geminiKey)
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                translations,
                targetLang
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Translation error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
})
