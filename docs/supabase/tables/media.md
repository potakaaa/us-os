# Photos, Albums & Comments

## albums
Logical grouping for photos.

Columns:
- id
- couple_id
- name
- created_by
- created_at

RLS:
- Full access: couple members

---

## photos
Metadata for images stored in Supabase Storage.

Columns:
- id
- couple_id
- album_id
- storage_path
- caption
- created_by
- created_at

RLS:
- Full access: couple members

---

## photo_favorites
User-specific favorites.

Columns:
- photo_id
- user_id
- created_at

Rules:
- Users can only favorite as themselves
- Must belong to same couple as photo

---

## photo_comments
Basic comments on photos.

Columns:
- id
- couple_id
- photo_id
- user_id
- body
- created_at

RLS:
- Read/write: couple members
