-- Rollback invite flow: drop couple_invites table and related RPCs

DROP FUNCTION IF EXISTS public.join_couple_by_invite(text);
DROP FUNCTION IF EXISTS public.create_invite(uuid, text);
DROP TABLE IF EXISTS public.couple_invites;
