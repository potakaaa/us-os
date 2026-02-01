# Authentication

UsOS uses **Supabase Auth** with email + password.

## Auth Flow

1. User signs up / logs in
2. Supabase issues a JWT
3. JWT is automatically attached to database requests
4. RLS policies enforce access

## Important Notes

- The `anon` key is exposed to clients
- All data protection is enforced via RLS
- `auth.uid()` is used extensively in policies

## Auth-Linked Tables

- `couple_members.user_id`
- `letters.from_user`
- `notes.user_id`
- `photo_comments.user_id`
- `device_tokens.user_id`
