-- Create couple via RPC: bypasses RLS for insert (auth.uid() still required for the call)
-- Run this in Supabase SQL Editor, then update create-couple.tsx to use supabase.rpc()

CREATE OR REPLACE FUNCTION public.create_couple(couple_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  cid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.couples (name, created_by)
  VALUES (couple_name, uid)
  RETURNING id INTO cid;

  INSERT INTO public.couple_members (couple_id, user_id, role)
  VALUES (cid, uid, 'member');

  RETURN cid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_couple(text) TO authenticated;

-- Set couple lock via RPC: bypasses RLS for couple_lock insert
CREATE OR REPLACE FUNCTION public.set_couple_lock(p_couple_id uuid, p_key_hash text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_id = p_couple_id AND user_id = uid
  ) THEN
    RAISE EXCEPTION 'Not a member of this couple';
  END IF;

  INSERT INTO public.couple_lock (couple_id, key_hash, updated_at)
  VALUES (p_couple_id, p_key_hash, now())
  ON CONFLICT (couple_id) DO UPDATE SET
    key_hash = EXCLUDED.key_hash,
    updated_at = EXCLUDED.updated_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_couple_lock(uuid, text) TO authenticated;
