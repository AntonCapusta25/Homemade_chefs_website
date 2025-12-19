import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Beautiful HTML email template
function getWelcomeEmailHTML(articles: any[]) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Homemade Chefs</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FDFBF7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFBF7;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0F1E19 0%, #1a2f28 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">Welcome to Homemade Chefs! 🎉</h1>
                            <p style="color: #E6DCC3; font-size: 16px; margin: 0;">Thank you for subscribing to our newsletter</p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #0F1E19; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hi there! 👋
                            </p>
                            <p style="color: #0F1E19; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                We're thrilled to have you join our community of passionate home chefs! You'll now receive exclusive updates, cooking tips, and inspiring stories directly to your inbox.
                            </p>
                            <p style="color: #0F1E19; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                To get you started, here are some of our most popular articles:
                            </p>
                        </td>
                    </tr>

                    <!-- Articles Grid -->
                    ${articles.map(article => `
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E6DCC3; border-radius: 12px; overflow: hidden;">
                                ${article.hero_image ? `
                                <tr>
                                    <td>
                                        <img src="${article.hero_image}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover; display: block;">
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="color: #0F1E19; font-size: 20px; margin: 0 0 10px 0; font-weight: bold;">${article.title}</h3>
                                        <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0;">${article.excerpt || ''}</p>
                                        <a href="https://homemadechefs.com/blog/${article.slug}" style="display: inline-block; background-color: #F47A44; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">Read More →</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    `).join('')}

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 30px; background-color: #F9F6F0; border-top: 1px solid #E6DCC3;">
                            <h3 style="color: #0F1E19; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">Need Help?</h3>
                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                                Have questions or feedback? We'd love to hear from you!
                            </p>
                            <a href="mailto:support@homemadechefs.com" style="color: #F47A44; text-decoration: none; font-weight: bold;">Contact Us →</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #0F1E19;">
                            <img src="https://homemadechefs.com/logo-white.png" alt="Homemade Chefs" style="height: 40px; margin-bottom: 20px;">
                            <p style="color: #E6DCC3; font-size: 14px; margin: 0 0 15px 0;">
                                Turn your cooking creations into revenue
                            </p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="padding: 0 10px;">
                                        <a href="https://instagram.com/homemadechefs" style="color: #F47A44; text-decoration: none; font-size: 24px;">📸</a>
                                    </td>
                                    <td style="padding: 0 10px;">
                                        <a href="https://facebook.com/homemadechefs" style="color: #F47A44; text-decoration: none; font-size: 24px;">📘</a>
                                    </td>
                                    <td style="padding: 0 10px;">
                                        <a href="https://twitter.com/homemadechefs" style="color: #F47A44; text-decoration: none; font-size: 24px;">🐦</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
                                © 2024 Homemade Chefs. All rights reserved.<br>
                                <a href="https://homemadechefs.com/unsubscribe" style="color: #999; text-decoration: underline;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { email } = await req.json()

        if (!email || !email.includes('@')) {
            return new Response(
                JSON.stringify({ error: 'Invalid email address' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            return new Response(
                JSON.stringify({ message: 'Already subscribed!' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Add to database
        const { data: newSubscriber, error: dbError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, source: 'website' }])
            .select('id')
            .single()

        if (dbError) throw dbError

        // Fetch latest 3 blog posts that haven't been sent to this subscriber
        // Since this is a new subscriber, just get the latest 3
        const { data: articles } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, hero_image')
            .eq('language', 'en')
            .eq('is_published', true)
            .order('published_date', { ascending: false })
            .limit(3)

        const articleSlugs = (articles || []).map(a => a.slug)

        // Send welcome email via SendGrid
        const emailHTML = getWelcomeEmailHTML(articles || [])

        const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email }],
                    subject: 'Welcome to Homemade Chefs! 🎉',
                }],
                from: {
                    email: 'chefs@homemademeals.net',
                    name: 'Homemade Chefs'
                },
                content: [{
                    type: 'text/html',
                    value: emailHTML
                }]
            })
        })

        if (!sendGridResponse.ok) {
            console.error('SendGrid error:', await sendGridResponse.text())
            throw new Error('Failed to send email')
        }

        // Track the email sent with articles included
        await supabase
            .from('newsletter_emails_sent')
            .insert([{
                subscriber_id: newSubscriber.id,
                email_type: 'welcome',
                articles_included: articleSlugs,
                metadata: {
                    article_count: articleSlugs.length,
                    sent_via: 'sendgrid'
                }
            }])

        return new Response(
            JSON.stringify({ message: 'Successfully subscribed! Check your email.' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
