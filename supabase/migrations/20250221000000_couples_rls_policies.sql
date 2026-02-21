-- RLS policies for couples, couple_members, and couple_lock
-- Run this in Supabase SQL Editor if you get "row-level security policy" errors
--
-- IMPORTANT: Uses is_couple_member() SECURITY DEFINER function to avoid
-- infinite recursion when policies reference couple_members.

-- ============================================
-- HELPER FUNCTION (bypasses RLS to prevent recursion)
-- ============================================
-- Uses parameter name "cid" to match existing function (avoids DROP CASCADE).

CREATE OR REPLACE FUNCTION public.is_couple_member(cid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_id = cid
    AND user_id = auth.uid()
  );
$$;

-- ============================================
-- COUPLES TABLE
-- ============================================

-- Allow authenticated users to insert a new couple (they become created_by)
DROP POLICY IF EXISTS "Allow authenticated users to insert couples" ON public.couples;
CREATE POLICY "Allow authenticated users to insert couples"
ON public.couples
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow users to select couples they are members of
DROP POLICY IF EXISTS "Allow couple members to select couples" ON public.couples;
CREATE POLICY "Allow couple members to select couples"
ON public.couples
FOR SELECT
TO authenticated
USING (public.is_couple_member(id));

-- ============================================
-- COUPLE_MEMBERS TABLE
-- ============================================

-- Allow users to insert themselves as a member (user_id must match auth.uid())
DROP POLICY IF EXISTS "Allow users to add themselves as couple members" ON public.couple_members;
CREATE POLICY "Allow users to add themselves as couple members"
ON public.couple_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow couple members to select other members of their couple
DROP POLICY IF EXISTS "Allow couple members to select members" ON public.couple_members;
CREATE POLICY "Allow couple members to select members"
ON public.couple_members
FOR SELECT
TO authenticated
USING (public.is_couple_member(couple_id));

