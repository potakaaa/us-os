
# Letters

Letters are private messages between two users within a couple.

## letters

Columns:
- id
- couple_id
- from_user
- to_user
- body_rich
- sealed_at
- unlock_at
- notified_at
- created_at

## Features Supported

- Editable drafts
- Sealed letters (immutable)
- Scheduled letters (unlock_at)

## RLS Rules

- Select: couple members
- Insert: from_user must be auth.uid()
- Update:
  - Only sender
  - Only if not sealed
