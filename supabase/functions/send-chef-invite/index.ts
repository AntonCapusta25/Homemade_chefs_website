import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteRequest {
  email: string
  name: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse request body
    const { email, name, metadata = {} }: InviteRequest = await req.json()

    // Validate input
    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Email and name are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('chef_users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Chef already has an account' }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate a secure random password (12 characters)
    const generatePassword = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
      let password = ''
      const array = new Uint8Array(12)
      crypto.getRandomValues(array)
      for (let i = 0; i < 12; i++) {
        password += chars[array[i] % chars.length]
      }
      return password
    }

    const temporaryPassword = generatePassword()

    // Create the Supabase Auth user immediately
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm email since they were invited
      user_metadata: {
        full_name: name,
      }
    })

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError)
      return new Response(
        JSON.stringify({
          error: 'Failed to create user account',
          details: authError?.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Created auth user for ${email}`)

    // Create chef profile
    const { error: profileError } = await supabaseAdmin
      .from('chef_users')
      .insert({
        id: authData.user.id,
        email,
        full_name: name,
        metadata: metadata || {}
      })

    if (profileError) {
      console.error('Error creating chef profile:', profileError)
      // Try to clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)

      return new Response(
        JSON.stringify({
          error: 'Failed to create chef profile',
          details: profileError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Created chef profile for ${email}`)

    // Send credentials email
    const learningPlatformUrl = Deno.env.get('LEARNING_PLATFORM_URL') ?? 'https://www.homemadechefs.com'
    const loginUrl = `${learningPlatformUrl}/learning`

    // Use SendGrid API to send email
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
    const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'Chefs@homemademeals.net'

    if (sendgridApiKey) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Homemade Learning Platform</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FDFBF7;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFBF7; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #0F1E19; padding: 40px 40px 30px; text-align: center;">
                      <h1 style="color: #FDFBF7; font-size: 32px; margin: 0; font-weight: 700;">Welcome to Homemade</h1>
                      <p style="color: #F47A44; font-size: 14px; margin: 10px 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Chef Learning Platform</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #0F1E19; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Hi ${name},</p>
                      
                      <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                        Your Chef Learning Platform account has been created! Get access to premium resources, training videos, and essential guides on food safety, hygiene, and kitchen operations.
                      </p>
                      
                      <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">
                        Here are your login credentials:
                      </p>
                      
                      <!-- Credentials Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 30px;">
                        <tr>
                          <td style="background-color: #F7FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0;">
                                  <p style="color: #718096; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Email</p>
                                  <p style="color: #0F1E19; font-size: 16px; margin: 0; font-weight: 600; font-family: 'Courier New', monospace;">${email}</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 16px 0 8px;">
                                  <p style="color: #718096; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Temporary Password</p>
                                  <p style="color: #F47A44; font-size: 20px; margin: 0; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">${temporaryPassword}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${loginUrl}" style="display: inline-block; background-color: #F47A44; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 6px rgba(244, 122, 68, 0.3);">
                              Access Learning Platform
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                        <strong>Important:</strong> We recommend changing your password after your first login for security.
                      </p>
                      
                      <p style="color: #A0AEC0; font-size: 12px; margin: 20px 0 0;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${loginUrl}" style="color: #F47A44; word-break: break-all;">${loginUrl}</a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F7FAFC; padding: 30px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
                      <p style="color: #718096; font-size: 14px; margin: 0 0 10px;">
                        <strong>Homemade</strong> - Premium Catering & Chef Resources
                      </p>
                      <p style="color: #A0AEC0; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Homemade. All rights reserved.
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

      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: email }],
            subject: 'Welcome to Homemade - Your Account is Ready!'
          }],
          from: { email: fromEmail },
          content: [{
            type: 'text/html',
            value: emailHtml
          }]
        }),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text()
        console.error('Error sending email:', errorData)
        // Don't fail the whole request if email fails - account is already created
        console.warn('Account created but email failed to send')
      } else {
        console.log(`Credentials email sent to ${email}`)
      }
    } else {
      console.warn('SENDGRID_API_KEY not set, skipping email send')
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Chef account created and credentials sent via email',
        email: email
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in send-chef-invite function:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
