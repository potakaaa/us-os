# Row Level Security (RLS)

RLS is enabled on **all tables**.

## Core Rule

> A user can only access rows belonging to a couple they are a member of.

## Enforcement Mechanism

- `auth.uid()` identifies user
- `couple_members` defines membership
- `is_couple_member(couple_id)` enforces access

## Security Guarantees

- No cross-couple access
- No accidental public reads
- Safe to use Supabase anon key
- Serverless-friendly

RLS is the primary security layer for UsOS.
