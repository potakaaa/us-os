# Couples & Tenancy Tables

Couples represent the **core shared space** in UsOS.
Every shared feature (photos, letters, notes, events) belongs to a couple.

---

## couples

Represents a single shared “Us” space.

### Columns
- `id` (uuid, primary key)
- `name` (text, optional display name)
- `created_by` (uuid → auth.users)
- `created_at` (timestamptz)

### Notes
- Created when a user selects “Create Us”
- Acts as the tenant root for all shared data

### RLS Policies
- **SELECT**: allowed only if user is a member of the couple
- **INSERT**: allowed for any authenticated user

---

## couple_members

Join table between users and couples.

### Columns
- `couple_id` (uuid → couples)
- `user_id` (uuid → auth.users)
- `role` (text, default: `member`)
- `joined_at` (timestamptz)

### Notes
- Defines access rights
- Supports roles for future admin actions
- Composite primary key (`couple_id`, `user_id`)

### RLS Policies
- **SELECT**: allowed if user belongs to the couple
- **INSERT**: user may only insert themselves (`user_id = auth.uid()`)

---

## couple_settings

Shared UI and experience preferences.

### Columns
- `couple_id` (uuid, primary key)
- `theme` (`light` | `dark` | `system`)
- `wallpaper_photo_id` (uuid → photos)
- `updated_at` (timestamptz)

### Usage
- Desktop wallpaper
- Theme sync between partners

### RLS Policies
- **ALL**: allowed if user is a couple member

---

## couple_lock

Optional shared lock for additional privacy.

### Columns
- `couple_id` (uuid, primary key)
- `key_hash` (text)
- `updated_at` (timestamptz)

### Notes
- Stores **hash only**, never plaintext
- Used for app-level re-locking (not authentication)

### RLS Policies
- **ALL**: allowed if user is a couple member

---

## Helper Function

```sql
is_couple_member(couple_id uuid) → boolean
