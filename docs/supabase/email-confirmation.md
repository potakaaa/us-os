# Email Confirmation

UsOS uses Supabase Auth with email confirmation for sign-up. Users receive a verification link after registering.

## Supabase Dashboard Setup

### Enable Email Confirmation

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and select your project
2. Navigate to **Authentication** > **Providers** > **Email**
3. Ensure **"Confirm email"** is enabled (on by default for hosted projects)

### URL Configuration

1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL** to your app's base URL (e.g. `https://yourapp.com` for web, or `usOS://` for deep linking)
3. Under **Redirect URLs**, add:
   - `usOS://**` (for Expo deep linking — app scheme from `app.json`)
   - Your web URL if applicable, e.g. `https://yourapp.com/**`

### Email Templates

1. Go to **Authentication** > **Email Templates**
2. Select **"Confirm signup"**
3. Customize the subject and HTML body as needed
4. Use variables: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`

### Confirm Signup HTML Template

Copy this into the **Confirm signup** template body. Subject suggestion: `Confirm your UsOS account`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 420px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px; text-align: center;">
              <div style="width: 64px; height: 64px; margin: 0 auto 24px; background: linear-gradient(135deg, #fecdd3 0%, #fda4af 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">❤️</span>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #0f172a;">You're almost in</h1>
              <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #64748b;">
                Hi there! Click the button below to confirm your email and start building your couple space.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 14px rgba(225,29,72,0.35);">
                Confirm my email
              </a>
              <p style="margin: 28px 0 0; font-size: 13px; color: #94a3b8;">
                If you didn't create an account, you can safely ignore this email.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #cbd5e1;">
                UsOS — Your private couple space
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### SMTP Settings (Production)

- **Development:** Supabase's default SMTP sends to pre-authorized emails only (limited)
- **Production:** Go to **Authentication** > **SMTP Settings** and configure a custom SMTP provider (SendGrid, Mailgun, AWS SES, Resend, etc.)

## App Flow

1. User signs up → `supabase.auth.signUp()` with `emailRedirectTo` (from `expo-linking`'s `createURL`)
2. User sees "Check your email" screen
3. Supabase sends confirmation email with link
4. User clicks link → Supabase verifies token → redirects to app via deep link
5. User lands on index (lock screen) as authenticated

## Redirect URL

The app uses `createURL('auth/callback')` from `expo-linking` to generate the redirect URL. This produces:
- `usOS://auth/callback` for production builds
- `exp://...` for Expo Go development

Ensure the generated URL pattern is added to Supabase **Redirect URLs** in URL Configuration.
