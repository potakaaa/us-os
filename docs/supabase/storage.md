# Supabase Storage — Photos

UsOS uses Supabase Storage to store photos uploaded by couples.

All photos are stored in a **private bucket** and access is controlled
entirely through Row Level Security (RLS) policies.

---

## Bucket Configuration

- Bucket name: `photos`
- Visibility: PRIVATE
- Public access: disabled

There are no public URLs for photos.

---

## Object Path Structure

Every photo is stored using a deterministic path format:

```

couple/{couple_id}/album/{album_id}/{photo_id}.jpg

```

### Why this matters
- Ownership is encoded directly in the path
- Policies can extract `couple_id` from the path
- Prevents cross-couple access by design

---

## Access Rules

### Read
- Allowed only if the user belongs to the couple in the path

### Upload
- Allowed only if the user belongs to the couple in the path

### Delete
- Allowed only if the user belongs to the couple in the path

All rules are enforced by database policies on `storage.objects`.

---

## Security Model

Storage access is validated by:

1. Extracting `couple_id` from the object path
2. Calling `is_couple_member(couple_id)`
3. Allowing or rejecting the operation

This guarantees:
- No public access
- No guessed URLs
- No accidental data leaks between couples

---

## Relationship to Database Tables

Storage objects do not contain metadata.
All meaning comes from the `photos` table, which stores:

- `storage_path`
- `couple_id`
- `album_id`

When deleting a photo:
1. Delete the database row
2. Delete the storage object

The database remains the source of truth.
