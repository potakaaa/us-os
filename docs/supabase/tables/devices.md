# Device Tokens

Used for push notifications (Expo).

## device_tokens

Columns:
- user_id
- device_id
- expo_push_token
- updated_at

Rules:
- One token per device
- User-scoped access only

RLS:
- Read/write: token owner only
