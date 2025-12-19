import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslateRequest {
    pageId: number
    targetLang: 'nl' | 'fr'
    fields?: string[]
}

const LANGUAGE_NAMES = {
    nl: 'Dutch',
    fr: 'French'
}

async function translateText(text: string, targetLang: 'nl' | 'fr', geminiKey: string): Promise<string> {
    const langName = LANGUAGE_NAMES[targetLang]

    const prompt = `You are a professional translator specializing in food, culinary, educational, and business content.
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

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verify user is admin
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

        // Parse request body
        const { pageId, targetLang, fields = ['title', 'body_content', 'meta_title', 'meta_description'] }: TranslateRequest = await req.json()

        if (!pageId || !targetLang) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: pageId, targetLang' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get the source page (English)
        const { data: sourcePage, error: fetchError } = await supabaseClient
            .from('learning_pages')
            .select('*')
            .eq('id', pageId)
            .eq('language', 'en')
            .single()

        if (fetchError || !sourcePage) {
            return new Response(
                JSON.stringify({ error: 'Source page not found or not in English' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get Gemini API key
        const geminiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiKey) {
            return new Response(
                JSON.stringify({ error: 'Gemini API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Translate fields
        const translations: any = {
            language: targetLang,
            source_id: sourcePage.id,
            hero_image: sourcePage.hero_image, // Same image for all languages
            youtube_url: sourcePage.youtube_url, // Same video for all languages
            is_published: false, // Start as draft
        }

        for (const field of fields) {
            if (sourcePage[field] && sourcePage[field].trim()) {
                console.log(`Translating ${field}...`)
                translations[field] = await translateText(sourcePage[field], targetLang, geminiKey)
            }
        }

        // Check if translation already exists
        const { data: existingTranslation } = await supabaseClient
            .from('learning_pages')
            .select('id')
            .eq('source_id', sourcePage.id)
            .eq('language', targetLang)
            .maybeSingle()

        let result
        if (existingTranslation) {
            // Update existing translation
            const { data, error } = await supabaseClient
                .from('learning_pages')
                .update(translations)
                .eq('id', existingTranslation.id)
                .select()
                .single()

            if (error) throw error
            result = data
        } else {
            // Create new translation
            const { data, error } = await supabaseClient
                .from('learning_pages')
                .insert([translations])
                .select()
                .single()

            if (error) throw error
            result = data
        }

        return new Response(
            JSON.stringify({ success: true, data: result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Translation error:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Translation failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
