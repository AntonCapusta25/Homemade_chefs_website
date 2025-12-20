import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Beautiful HTML email template for weekly newsletter
function getWeeklyNewsletterHTML(articles: any[]) {
    const articleCards = articles.map(article => `
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F6F3; border-radius: 12px; overflow: hidden;">
                    ${article.hero_image ? `
                    <tr>
                        <td style="padding: 0;">
                            <img src="${article.hero_image}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover; display: block;" />
                        </td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 20px;">
                            <h3 style="color: #0F1E19; font-size: 20px; margin: 0 0 10px 0; font-weight: bold;">${article.title}</h3>
                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">${article.excerpt || ''}</p>
                            <a href="https://homemadechefs.com/blog/${article.slug}" style="display: inline-block; background-color: #F47A44; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 14px;">Read More →</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Weekly Homemade Chefs Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FDFBF7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFBF7;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0F1E19 0%, #1a2f28 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">Your Weekly Chef Digest 📰</h1>
                            <p style="color: #E6DCC3; font-size: 16px; margin: 0;">Fresh recipes, tips, and stories from our community</p>
                        </td>
                    </tr>

                    <!-- Intro -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <p style="color: #0F1E19; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hi Chef! 👋
                            </p>
                            <p style="color: #0F1E19; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                Here are this week's top articles handpicked just for you. From cooking tips to business insights, we've got everything you need to thrive as a home chef!
                            </p>
                        </td>
                    </tr>

                    <!-- Articles -->
                    ${articleCards}

                    <!-- Footer CTA -->
                    <tr>
                        <td style="padding: 20px 30px 40px 30px; text-align: center;">
                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                                Want to share your culinary journey with the world?
                            </p>
                            <a href="https://homemadechefs.com" style="display: inline-block; background-color: #0F1E19; color: white; padding: 14px 32px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">Start Your Chef Business</a>
                        </td>
                    </tr>

                    <!-- Unsubscribe -->
                    <tr>
                        <td style="background-color: #F8F6F3; padding: 20px 30px; text-align: center; border-top: 1px solid #E6DCC3;">
                            <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                                You're receiving this because you subscribed to Homemade Chefs newsletter.
                            </p>
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                <a href="{{unsubscribe_url}}" style="color: #F47A44; text-decoration: underline;">Unsubscribe</a> | 
                                <a href="https://homemadechefs.com" style="color: #F47A44; text-decoration: underline;">Visit Website</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        // Get all active subscribers
        const { data: subscribers, error: subsError } = await supabase
            .from('newsletter_subscribers')
            .select('id, email')
            .eq('is_active', true)

        if (subsError) throw subsError

        if (!subscribers || subscribers.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No active subscribers found' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        let emailsSent = 0
        let emailsFailed = 0

        // Process each subscriber
        for (const subscriber of subscribers) {
            try {
                // Get articles already sent to this subscriber
                const { data: sentEmails } = await supabase
                    .from('newsletter_emails_sent')
                    .select('articles_included')
                    .eq('subscriber_id', subscriber.id)

                // Flatten all sent article slugs
                const sentSlugs = new Set(
                    (sentEmails || [])
                        .flatMap(email => email.articles_included || [])
                )

                // Get latest 3 blog posts that haven't been sent to this subscriber
                const { data: allArticles } = await supabase
                    .from('blog_posts')
                    .select('id, title, slug, excerpt, hero_image')
                    .eq('language', 'en')
                    .eq('is_published', true)
                    .order('published_date', { ascending: false })
                    .limit(20) // Get more to filter from

                // Filter out already sent articles
                const newArticles = (allArticles || [])
                    .filter(article => !sentSlugs.has(article.slug))
                    .slice(0, 3) // Take top 3 new articles

                // Skip if no new articles
                if (newArticles.length === 0) {
                    console.log(`No new articles for ${subscriber.email}`)
                    continue
                }

                const articleSlugs = newArticles.map(a => a.slug)

                // Send weekly newsletter email via SendGrid
                const emailHTML = getWeeklyNewsletterHTML(newArticles)

                const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        personalizations: [{
                            to: [{ email: subscriber.email }],
                            subject: `Your Weekly Chef Digest - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
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
                    console.error(`SendGrid error for ${subscriber.email}:`, await sendGridResponse.text())
                    emailsFailed++
                    continue
                }

                // Track the email sent
                await supabase
                    .from('newsletter_emails_sent')
                    .insert([{
                        subscriber_id: subscriber.id,
                        email_type: 'weekly_digest',
                        articles_included: articleSlugs,
                        metadata: {
                            article_count: articleSlugs.length,
                            sent_via: 'sendgrid',
                            sent_at: new Date().toISOString()
                        }
                    }])

                emailsSent++
                console.log(`Sent weekly newsletter to ${subscriber.email}`)

            } catch (error) {
                console.error(`Error sending to ${subscriber.email}:`, error)
                emailsFailed++
            }
        }

        return new Response(
            JSON.stringify({
                message: 'Weekly newsletter sent',
                stats: {
                    total_subscribers: subscribers.length,
                    emails_sent: emailsSent,
                    emails_failed: emailsFailed
                }
            }),
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
