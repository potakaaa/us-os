# Supabase Database Overview — UsOS

This directory documents the Supabase backend for **UsOS**, a private, shared operating system for couples.

Supabase is used as:
- Authentication provider (Supabase Auth)
- PostgreSQL database
- File storage (private buckets)
- Authorization layer via Row Level Security (RLS)

## Core Principles

- **Couple-first tenancy**: all data belongs to a `couple`
- **Zero trust by default**: RLS enabled on all tables
- **No shared data across couples**
- **Client-safe access**: anon key is safe due to strict RLS

## High-Level Components

- Auth: `auth.users`
- Tenancy: `couples`, `couple_members`
- Content: photos, letters, notes, events
- Settings: themes, wallpapers, couple lock
- Notifications: device tokens

See individual docs for schema and policy details.
