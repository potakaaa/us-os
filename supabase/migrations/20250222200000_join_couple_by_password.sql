-- Add unique couple name (case-insensitive) and join_couple_by_password RPC
-- Partner joins by entering couple space name + password (first to log in wins)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Unique index on couple name (case-insensitive, ignore empty)
CREATE UNIQUE INDEX IF NOT EXISTS idx_couples_name_unique
ON public.couples (lower(trim(name)))
WHERE name IS NOT NULL AND trim(name) != '';

-- Update create_couple to enforce name uniqueness
CREATE OR REPLACE FUNCTION public.create_couple(couple_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  cid uuid;
  name_trimmed text;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  name_trimmed := trim(couple_name);
  IF name_trimmed = '' OR name_trimmed IS NULL THEN
    RAISE EXCEPTION 'Couple space name is required';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.couples
    WHERE lower(trim(name)) = lower(name_trimmed)
  ) THEN
    RAISE EXCEPTION 'This couple space name is already taken';
  END IF;

  INSERT INTO public.couples (name, created_by)
  VALUES (name_trimmed, uid)
  RETURNING id INTO cid;

  INSERT INTO public.couple_members (couple_id, user_id, role)
  VALUES (cid, uid, 'member');

  RETURN cid;
END;
$$;

-- RPC: join_couple_by_password - partner enters name + password to join
CREATE OR REPLACE FUNCTION public.join_couple_by_password(p_couple_name text, p_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  cid uuid;
  key_hash_val text;
  member_count int;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF trim(p_couple_name) = '' OR trim(p_password) = '' THEN
    RAISE EXCEPTION 'Couple space name and password are required';
  END IF;

  SELECT c.id, cl.key_hash
  INTO cid, key_hash_val
  FROM public.couples c
  LEFT JOIN public.couple_lock cl ON cl.couple_id = c.id
  WHERE lower(trim(c.name)) = lower(trim(p_couple_name))
  LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Couple space not found';
  END IF;

  IF key_hash_val IS NULL THEN
    RAISE EXCEPTION 'This couple space has no password set';
  END IF;

  IF key_hash_val != crypt(p_password, key_hash_val) THEN
    RAISE EXCEPTION 'Incorrect password';
  END IF;

  SELECT count(*) INTO member_count
  FROM public.couple_members
  WHERE couple_id = cid;

  IF member_count >= 2 THEN
    RAISE EXCEPTION 'This couple space is already full';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_id = cid AND user_id = uid
  ) THEN
    RETURN cid;
  END IF;

  INSERT INTO public.couple_members (couple_id, user_id, role)
  VALUES (cid, uid, 'member');

  RETURN cid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_couple_by_password(text, text) TO authenticated;
