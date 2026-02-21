-- Fix couples INSERT RLS: ensure authenticated users can create couples
-- Run this in Supabase SQL Editor if you get "row-level security policy" on couples INSERT
--
-- Uses TO public so policy applies regardless of role; WITH CHECK ensures
-- only authenticated users (auth.uid() not null) can insert and created_by must match.

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

-- Drop all possible INSERT policies on couples
DROP POLICY IF EXISTS "Allow authenticated users to insert couples" ON public.couples;
DROP POLICY IF EXISTS "couples_insert_policy" ON public.couples;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.couples;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.couples;

-- Policy: allow INSERT when auth.uid() matches created_by (any role with valid JWT)
CREATE POLICY "Allow authenticated users to insert couples"
ON public.couples
FOR INSERT
TO public
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);
