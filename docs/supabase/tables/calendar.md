# Calendar & Events

## events

Columns:
- id
- couple_id
- title
- starts_at
- remind_at
- notified_at
- created_by
- created_at

## Notification Model

- `remind_at` determines trigger time
- `notified_at` prevents duplicate pushes
- Edge Functions or cron jobs send notifications

RLS:
- Full access: couple members
