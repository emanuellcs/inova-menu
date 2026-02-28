-- =============================================================================
-- FUNCTION: create_establishment_on_signup
-- Allows a newly signed-up user to create their establishment and become
-- the owner in a single atomic transaction.
-- =============================================================================

create or replace function public.create_establishment_on_signup(
  p_owner_id uuid,
  p_name     text,
  p_slug     text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_establishment_id uuid;
begin
  -- 1. Create the establishment
  insert into public.establishments (owner_id, name, slug)
  values (p_owner_id, p_name, p_slug)
  returning id into v_establishment_id;

  -- 2. Add the user as the owner member immediately
  insert into public.establishment_members (establishment_id, profile_id, role, accepted_at)
  values (v_establishment_id, p_owner_id, 'owner', now());

  return v_establishment_id;
exception
  when unique_violation then
    -- If slug or owner already exists, handle appropriately
    -- For registration, we expect unique slug.
    raise exception 'Establishment already exists or slug in use.';
end;
$$;

-- Ensure RLS allows the signUp user to call this if needed, 
-- but since it's security definer it bypasses most checks.

-- Also, let's fix the initial RLS for establishment_members
-- to allow the user to see their own membership even if it's the only one.
create policy "establishment_members: read own"
  on public.establishment_members for select
  using (profile_id = auth.uid());
