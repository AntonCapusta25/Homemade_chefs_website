# Lovable Integration Guide

## Overview

This guide shows you how to integrate the chef account creation from your Lovable catering website to the learning platform.

## Configuration

### Learning Platform Details
- **URL**: `https://www.homemadechefs.com`
- **Supabase URL**: `https://vfkmcamplptlkgurnnzi.supabase.co`
- **Anon Key**: Get from Supabase Dashboard → Settings → API

### SendGrid
- **From Email**: `Chefs@homemademeals.net`

## Integration Code for Lovable

### Option 1: Direct Fetch (Recommended)

Add this function to your Lovable project:

```typescript
const createChefAccount = async (chefEmail: string, chefName: string) => {
  try {
    const response = await fetch(
      'https://vfkmcamplptlkgurnnzi.supabase.co/functions/v1/send-chef-invite',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_LEARNING_PLATFORM_ANON_KEY', // Get from Supabase
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: chefEmail,
          name: chefName
        })
      }
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      throw new Error(data.error || 'Failed to create account')
    }

    return {
      success: true,
      message: `Account created! Login credentials sent to ${chefEmail}`
    }
    
  } catch (error) {
    console.error('Error creating chef account:', error)
    return {
      success: false,
      message: 'Failed to create account. Please try again.'
    }
  }
}
```

### Usage Example

In your "Go to Learning Platform" button handler:

```typescript
const handleGoToLearning = async () => {
  // Assuming you have chef data from your form or state
  const chef = {
    email: 'chef@example.com',
    name: 'Chef Marco'
  }

  // Show loading state
  setIsCreatingAccount(true)

  // Create the account
  const result = await createChefAccount(chef.email, chef.name)

  setIsCreatingAccount(false)

  if (result.success) {
    // Show success message
    toast.success(result.message)
    
    // Optionally open learning platform in new tab
    window.open('https://www.homemadechefs.com/learning', '_blank')
  } else {
    // Show error
    toast.error(result.message)
  }
}
```

### Option 2: Using Supabase Client

If you prefer to use the Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js'

// Create a client for the LEARNING PLATFORM (not your Lovable Supabase)
const learningPlatformSupabase = createClient(
  'https://vfkmcamplptlkgurnnzi.supabase.co',
  'YOUR_LEARNING_PLATFORM_ANON_KEY'
)

const createChefAccount = async (chefEmail: string, chefName: string) => {
  const { data, error } = await learningPlatformSupabase.functions.invoke(
    'send-chef-invite',
    {
      body: { 
        email: chefEmail, 
        name: chefName 
      }
    }
  )

  if (error || data?.error) {
    return {
      success: false,
      message: data?.error || error.message
    }
  }

  return {
    success: true,
    message: `Account created! Credentials sent to ${chefEmail}`
  }
}
```

## Getting the Anon Key

1. Go to https://supabase.com/dashboard/project/vfkmcamplptlkgurnnzi
2. Navigate to **Settings → API**
3. Copy the `anon` `public` key
4. Use it in the code above

**Note**: The anon key is safe to use in frontend code. It only allows calling the Edge Function, which has its own security.

## Testing

### Test the Integration

```bash
# Test from your browser console or Postman
fetch('https://vfkmcamplptlkgurnnzi.supabase.co/functions/v1/send-chef-invite', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    name: 'Test Chef'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Expected Response

**Success:**
```json
{
  "success": true,
  "message": "Chef account created and credentials sent via email",
  "email": "test@example.com"
}
```

**Error (User exists):**
```json
{
  "error": "Chef already has an account"
}
```

## User Flow

1. **Catering Site**: Chef clicks "Go to Learning Platform"
2. **API Call**: Lovable calls the Edge Function
3. **Account Creation**: Edge Function creates account with random password
4. **Email Sent**: Chef receives email with credentials from `Chefs@homemademeals.net`
5. **Chef Logs In**: Chef goes to `https://www.homemadechefs.com/learning` and logs in
6. **Full Access**: Chef has immediate access to all learning resources

## Error Handling

Handle these scenarios in your Lovable UI:

- **User already exists**: Show message "You already have an account. Check your email for credentials."
- **Invalid email**: Show validation error before calling API
- **Network error**: Show "Connection failed. Please try again."
- **Email failed to send**: Account is still created, show "Account created but email failed. Contact support."

## Security Notes

- ✅ CORS is enabled on the Edge Function
- ✅ Anon key is safe for frontend use
- ✅ RLS policies protect the database
- ✅ Service role key stays secure in Edge Function
- ✅ Passwords are randomly generated and sent securely

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify anon key is correct
3. Check Edge Function logs in Supabase dashboard
4. Verify SendGrid is configured correctly
