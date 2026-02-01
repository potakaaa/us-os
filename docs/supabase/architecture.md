# Supabase Architecture — UsOS

UsOS uses Supabase as a serverless backend for authentication,
database access, and file storage.

There is **no traditional backend server** for the MVP.
Client applications talk directly to Supabase, and all authorization
is enforced at the database level using Row Level Security (RLS).

---

## High-Level Overview

```

iOS / Android / Web
(React Native + Expo)
|
v
Supabase Client SDK
|
v
+----------------------------------+

| Supabase                             |
| ------------------------------------ |
| Auth (auth.users)                    |
| PostgreSQL Database                  |
| - Row Level Security (RLS)           |
| Storage (private buckets)            |
| +----------------------------------+ |

```

---

## Key Architectural Decisions

### Client-direct access
- Mobile and web clients use the Supabase anon key
- No API server is required for standard CRUD operations
- Security is not based on hidden endpoints

### Database-enforced authorization
- RLS is enabled on **every table**
- Access rules are evaluated inside PostgreSQL
- Clients cannot bypass authorization logic

### Couple-based tenancy
- A couple represents a private shared space
- All shared tables reference a `couple_id`
- Users can only access couples they belong to

---

## Authorization Model

Authorization relies on:

- `auth.uid()` — identifies the authenticated user
- `couple_members` — defines which couples a user belongs to
- `is_couple_member(couple_id)` — reusable SQL helper function

All policies resolve to a single rule:

> A user may only read or write data belonging to couples they are a member of.

---

## What is *not* included (by design)

- No Express / FastAPI server
- No custom auth service
- No public database access
- No cross-couple queries

Edge Functions may be added later for background tasks such as
scheduled notifications or automation, but are not required for MVP.