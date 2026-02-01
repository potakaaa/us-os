# UsOS — App Context

## What UsOS is

**UsOS** is a private, shared "couple space" that feels like a tiny operating system. Each couple gets their own **UsOS instance** (their "Us"), where they can keep memories and messages in a modern mobile app interface.

UsOS runs on **iOS + Android + Web** with one codebase (React Native / Expo) and uses **Supabase** for authentication, database, realtime, and storage.

---

## Why it exists

Couples already use a mix of chat apps, camera rolls, notes, and calendars—but those things are scattered and don’t feel personal.

UsOS aims to be:

- **Private** (couple-only access)
- **Cozy** (letters, notes, memories)
- **Organized** (albums/favorites/comments)
- **Playful** (intuitive and engaging)

---

## Core product concept

### “Create Us”

New users go through onboarding where they:

1. Create their **Us** (couple space) or join one via invite code/link.
2. Optionally set a **Couple Key** (a passcode lock screen) for extra privacy on-device.
3. Enter the UsOS home screen where features are accessible.

### Couple Space (multi-tenant)

Every piece of content belongs to a `couple_id`. Users only see and edit content for couples they’re a member of.

---

## MVP features

### 1) Photos

- Albums
- Captions
- Favorite toggle
- Basic comments

### 2) Letters

- Rich text letters
- Sealed letters (locks editing)
- Scheduled letters (unlock at a future date/time)

### 3) Sticky Notes / Reminder Notes

- Draggable notes (position saved)
- Note color selection

### 4) Calendar

- Add events
- Remind when an event is near (push notifications)

### 5) Settings

- Pick wallpaper from the couple’s photos
- Theme toggle (light/dark)
- Logout

---

## UI / UX direction

UsOS should feel like:

- A **modern mobile app** with intuitive navigation
- Features accessible from the home screen
- Content organized in **albums** and collections
- Simple **screens** with a clean, cute aesthetic

Design principles:

- Minimal friction: quick open, quick write, quick save
- Soft + intimate tone (not corporate)
- Strong sense of "this is ours"

---

## Security and privacy model

### Primary security: authentication + RLS

- Users authenticate via Supabase Auth (email/password initially).
- Data access is enforced with **Row Level Security (RLS)**:
  - A user can only read/write records tied to a `couple_id` they belong to.

### Storage security

- Photos are stored in Supabase Storage buckets with access restricted to the couple via policies.

### Couple Key (MVP)

- Optional lock screen passcode per couple.
- Stored as a **hash** (not plaintext).
- Intended as _extra privacy on a shared/unlocked device_, not a replacement for real auth.

---

## Backend architecture (no separate server required for MVP)

- **Supabase** handles auth, database, and storage.
- **Scheduled letters** and **event reminders** are handled by:
  - Cron/scheduled jobs + server-side functions (e.g., Supabase Edge Functions)
  - Sending push notifications to devices using stored Expo push tokens

---

## Key user flows

### Onboarding

- Sign up / log in
- Create Us (make a couple space) OR Join Us (invite code/link)
- Set Couple Key (optional)
- Enter Home Screen

### Photos

- Create album → upload photos → add captions → favorite/comment

### Letters

- Write letter → send → optionally seal → optionally schedule unlock
- Recipient views in Inbox (locked until unlock time if scheduled)

### Notes

- Create note → reposition on screen → pick color → autosave

### Calendar

- Add event → set reminder time → receive push notification

---

## Future expansion (post-MVP ideas)

- “Time Capsule” unlocks
- Relationship timeline / scrapbook
- Strong privacy mode: end-to-end encryption for letters
- Recycle bin / restores
- Enhanced mobile interactions (gestures, multi-select, improved navigation)

---

## One-sentence pitch

**UsOS is a private mobile app for couples—photos in albums, letters in an inbox, notes on the home screen, and important dates on a shared calendar—accessible on iOS, Android, and the web.**
