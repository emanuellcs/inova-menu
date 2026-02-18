-- =============================================================================
-- EXTENSIONS
-- =============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "moddatetime"; -- auto-updates updated_at columns

-- =============================================================================
-- CUSTOM TYPES (ENUMS)
-- =============================================================================

-- Determines the publication state of a menu
create type public.menu_status as enum (
  'draft',      -- Being edited, not publicly visible
  'published',  -- Live and visible on totem
  'archived'    -- Deactivated, kept for history
);

-- Determines the role of a user within an establishment
create type public.member_role as enum (
  'owner',    -- Full access, billing control
  'admin',    -- Full access except billing
  'editor'    -- Can edit menus/items but not global settings
);

-- Subscription plan for the establishment
create type public.plan_tier as enum (
  'free',
  'pro',
  'enterprise'
);

-- =============================================================================
-- TABLE: profiles
-- Extends auth.users with application-level user data.
-- =============================================================================

create table public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is
  'Application-level user profile, linked 1-to-1 with auth.users.';

-- =============================================================================
-- TABLE: establishments
-- Represents a cocktail bar or venue using the platform.
-- =============================================================================

create table public.establishments (
  id              uuid        primary key default uuid_generate_v4(),
  owner_id        uuid        not null references public.profiles(id) on delete restrict,
  name            text        not null,
  slug            text        not null unique,  -- URL-friendly identifier for public menu
  logo_url        text,
  plan            plan_tier   not null default 'free',
  plan_expires_at timestamptz,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint establishments_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

comment on table public.establishments is
  'A cocktail bar or venue that subscribes to the platform.';
comment on column public.establishments.slug is
  'URL-safe identifier used for public totem routes, e.g. /menu/inova-drinks.';

-- =============================================================================
-- TABLE: establishment_members
-- Manages team access (multi-user per establishment).
-- =============================================================================

create table public.establishment_members (
  id                uuid        primary key default uuid_generate_v4(),
  establishment_id  uuid        not null references public.establishments(id) on delete cascade,
  profile_id        uuid        not null references public.profiles(id) on delete cascade,
  role              member_role not null default 'editor',
  invited_at        timestamptz not null default now(),
  accepted_at       timestamptz,

  unique (establishment_id, profile_id)
);

comment on table public.establishment_members is
  'Links users to establishments with a specific role for access control.';

-- =============================================================================
-- TABLE: menus
-- A menu belongs to one establishment. Contains the top-level theme/layout JSON.
-- =============================================================================

create table public.menus (
  id                uuid          primary key default uuid_generate_v4(),
  establishment_id  uuid          not null references public.establishments(id) on delete cascade,
  name              text          not null,                  -- Internal name, e.g. "Cardápio Principal"
  description       text,                                    -- Internal notes
  status            menu_status   not null default 'draft',
  is_default        boolean       not null default false,    -- The default menu shown on totem

  -- -------------------------------------------------------------------------
  -- SCHEMA-DRIVEN UI: The entire visual configuration lives in this JSONB blob.
  -- The public menu page reads this object to render styles dynamically.
  --
  -- Shape reference:
  -- {
  --   "colors": {
  --     "primary": "#FF69B4",
  --     "secondary": "#FFB6C1",
  --     "background": "#FFF0F5",
  --     "text": "#3D003D",
  --     "accent": "#FF1493",
  --     "cardBorder": "#FFB6C1",
  --     "cardBackground": "rgba(255,255,255,0.9)"
  --   },
  --   "background": {
  --     "type": "gradient",        -- "gradient" | "image" | "solid"
  --     "gradientStart": "#FFF0F5",
  --     "gradientEnd": "#FFE4F1",
  --     "gradientAngle": 135,
  --     "imageUrl": null,
  --     "imageOverlayOpacity": 0.5
  --   },
  --   "typography": {
  --     "fontFamily": "Poppins",
  --     "fontUrl": "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700",
  --     "baseFontSize": "1.1rem",
  --     "sectionTitleSize": "2.5rem",
  --     "productTitleSize": "1.4rem"
  --   },
  --   "header": {
  --     "showLogo": true,
  --     "logoUrl": null,
  --     "title": "Inova Drinks",
  --     "subtitle": null,
  --     "backgroundType": "gradient",   -- "gradient" | "image" | "solid"
  --     "backgroundValue": null,
  --     "showAnimatedBackground": true
  --   },
  --   "navigation": {
  --     "showNavBar": true,
  --     "buttonStyle": "pill",          -- "pill" | "square" | "outlined"
  --     "stickyNav": false
  --   },
  --   "productCard": {
  --     "showIcon": true,
  --     "showBadge": true,
  --     "showDescription": true,
  --     "showPrice": true,
  --     "showImage": false,
  --     "hoverEffect": "lift",          -- "lift" | "glow" | "none"
  --     "borderRadius": "20px"
  --   },
  --   "footer": {
  --     "text": "© 2025 Inova Drinks - Todos os direitos reservados",
  --     "subtext": "Feito com amor por @paulo.mml",
  --     "showSocialLinks": false
  --   },
  --   "layout": {
  --     "sectionSpacing": "mt-5",
  --     "gridMinColumnWidth": "300px",
  --     "gridGap": "2rem",
  --     "maxWidth": "1400px",
  --     "containerPadding": "1rem"
  --   }
  -- }
  -- -------------------------------------------------------------------------
  theme_config      jsonb         not null default '{}'::jsonb,

  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now()
);

comment on table public.menus is
  'A versioned menu for an establishment. theme_config drives the entire public UI rendering.';
comment on column public.menus.theme_config is
  'JSONB blob containing all visual/layout settings. Interpreted by the public totem page.';
comment on column public.menus.is_default is
  'Only one menu per establishment should have this flag set. Enforced via partial unique index.';

-- Ensures only one default menu per establishment
create unique index menus_one_default_per_establishment
  on public.menus (establishment_id)
  where (is_default = true);

-- =============================================================================
-- TABLE: sections
-- Represents a named group of items within a menu (e.g., "Estação Gin").
-- =============================================================================

create table public.sections (
  id              uuid        primary key default uuid_generate_v4(),
  menu_id         uuid        not null references public.menus(id) on delete cascade,
  title           text        not null,             -- e.g., "ESTAÇÃO GIN"
  icon_class      text,                             -- Font Awesome class, e.g., "fas fa-wine-glass"
  anchor_id       text,                             -- HTML anchor, e.g., "EstacaoGin"
  description     text,                             -- Optional subtitle under section title
  display_order   integer     not null default 0,   -- Drag-and-drop position
  is_visible      boolean     not null default true,

  -- Per-section style overrides (can override the menu's global theme_config)
  -- Shape: { "titleBackground": "#FF69B4", "titleColor": "#fff", ... }
  style_overrides jsonb        not null default '{}'::jsonb,

  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

comment on table public.sections is
  'A named group of items within a menu. display_order controls drag-and-drop position.';
comment on column public.sections.style_overrides is
  'Optional per-section style overrides that take precedence over the menu theme_config.';

-- =============================================================================
-- TABLE: items
-- A product (drink, food, add-on) within a section.
-- =============================================================================

create table public.items (
  id              uuid        primary key default uuid_generate_v4(),
  section_id      uuid        not null references public.sections(id) on delete cascade,
  name            text        not null,                      -- e.g., "GIN TROPICAL"
  description     text,                                      -- e.g., "Gin premium com mix de citrus..."
  ingredients     text,                                      -- e.g., "Gin • Citrus • Morango • Tangerina"
  category_badge  text,                                      -- e.g., "Gins Especiais"
  icon_class      text,                                      -- Font Awesome class, e.g., "fas fa-wine-glass"
  image_url       text,                                      -- Optional product image
  price           numeric(10, 2),                            -- e.g., 29.90
  is_available    boolean     not null default true,         -- Toggle off when sold out
  is_featured     boolean     not null default false,        -- Highlight card in UI
  display_order   integer     not null default 0,            -- Drag-and-drop position

  -- Per-item style/behaviour overrides
  -- Shape: { "badgeColor": "#FF69B4", "cardBackground": "#fff0f5", ... }
  style_overrides jsonb       not null default '{}'::jsonb,

  -- Metadata for modal detail (matches the openProductDetailModal JS function)
  modal_config    jsonb       not null default '{}'::jsonb,
  -- Shape: {
  --   "iconClass": "fas fa-cocktail",
  --   "showIngredients": true,
  --   "showPrice": true,
  --   "extraInfo": null
  -- }

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.items is
  'A product (drink, food, add-on) within a menu section.';
comment on column public.items.price is
  'Stored as numeric to avoid floating-point rounding. NULL means price not displayed.';
comment on column public.items.modal_config is
  'Config for the product detail modal rendered in the public totem view.';

-- =============================================================================
-- TABLE: media_assets
-- Centralised registry of all uploaded files (logos, backgrounds, item images).
-- =============================================================================

create table public.media_assets (
  id                uuid        primary key default uuid_generate_v4(),
  establishment_id  uuid        not null references public.establishments(id) on delete cascade,
  uploaded_by       uuid        references public.profiles(id) on delete set null,
  bucket_name       text        not null default 'media',
  storage_path      text        not null,     -- Path inside the Supabase Storage bucket
  public_url        text        not null,     -- Full CDN URL
  file_name         text        not null,
  file_size_bytes   bigint,
  mime_type         text,
  width_px          integer,
  height_px         integer,
  alt_text          text,
  created_at        timestamptz not null default now(),

  unique (bucket_name, storage_path)
);

comment on table public.media_assets is
  'Registry of all media files uploaded for an establishment, pointing to Supabase Storage.';

-- =============================================================================
-- TABLE: totem_devices
-- Registered display devices per establishment.
-- =============================================================================

create table public.totem_devices (
  id                uuid        primary key default uuid_generate_v4(),
  establishment_id  uuid        not null references public.establishments(id) on delete cascade,
  menu_id           uuid        references public.menus(id) on delete set null, -- Which menu to show
  name              text        not null,               -- e.g., "Totem Entrada"
  device_token      text        not null unique default encode(gen_random_bytes(32), 'hex'),
  last_seen_at      timestamptz,
  is_active         boolean     not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.totem_devices is
  'A registered display device (totem/tablet) that renders a specific menu.';
comment on column public.totem_devices.device_token is
  'Unique token used to authenticate a totem device without a user session.';

-- =============================================================================
-- TABLE: menu_versions
-- Immutable audit log of menu snapshots. Created on each "publish" action.
-- =============================================================================

create table public.menu_versions (
  id              uuid        primary key default uuid_generate_v4(),
  menu_id         uuid        not null references public.menus(id) on delete cascade,
  created_by      uuid        references public.profiles(id) on delete set null,
  version_number  integer     not null,
  label           text,                                 -- e.g., "v1.0 - Lançamento"
  -- Full snapshot of the menu at publication time
  snapshot        jsonb       not null,
  published_at    timestamptz not null default now(),

  unique (menu_id, version_number)
);

comment on table public.menu_versions is
  'Immutable snapshot of a menu captured on each publish. Enables rollback.';
comment on column public.menu_versions.snapshot is
  'Full JSON snapshot of menu + sections + items at publish time.';

-- =============================================================================
-- INDEXES
-- Optimise common query patterns
-- =============================================================================

-- Establishments
create index idx_establishments_owner_id   on public.establishments (owner_id);
create index idx_establishments_slug       on public.establishments (slug);

-- Establishment members
create index idx_establishment_members_profile   on public.establishment_members (profile_id);
create index idx_establishment_members_est       on public.establishment_members (establishment_id);

-- Menus
create index idx_menus_establishment_id    on public.menus (establishment_id);
create index idx_menus_status              on public.menus (status);

-- Sections
create index idx_sections_menu_id          on public.sections (menu_id, display_order);

-- Items
create index idx_items_section_id          on public.items (section_id, display_order);
create index idx_items_is_available        on public.items (is_available);

-- Media assets
create index idx_media_assets_establishment on public.media_assets (establishment_id);

-- Totem devices
create index idx_totem_devices_establishment on public.totem_devices (establishment_id);
create index idx_totem_devices_token         on public.totem_devices (device_token);

-- Menu versions
create index idx_menu_versions_menu_id     on public.menu_versions (menu_id, version_number desc);

-- =============================================================================
-- TRIGGERS: auto-update updated_at columns
-- =============================================================================

create or replace trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function moddatetime(updated_at);

create or replace trigger trg_establishments_updated_at
  before update on public.establishments
  for each row execute function moddatetime(updated_at);

create or replace trigger trg_menus_updated_at
  before update on public.menus
  for each row execute function moddatetime(updated_at);

create or replace trigger trg_sections_updated_at
  before update on public.sections
  for each row execute function moddatetime(updated_at);

create or replace trigger trg_items_updated_at
  before update on public.items
  for each row execute function moddatetime(updated_at);

create or replace trigger trg_totem_devices_updated_at
  before update on public.totem_devices
  for each row execute function moddatetime(updated_at);

-- =============================================================================
-- FUNCTION: handle_new_user
-- Automatically creates a profile row when a new user signs up via Supabase Auth.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- FUNCTION: is_establishment_member
-- Returns true if the current user is a member of the given establishment.
-- Used as a building block for RLS policies.
-- =============================================================================

create or replace function public.is_establishment_member(
  p_establishment_id uuid,
  p_min_role member_role default 'editor'
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.establishment_members em
    where em.establishment_id = p_establishment_id
      and em.profile_id       = auth.uid()
      and em.accepted_at      is not null
      and (
        -- Role hierarchy: owner > admin > editor
        (p_min_role = 'editor') or
        (p_min_role = 'admin'  and em.role in ('admin', 'owner')) or
        (p_min_role = 'owner'  and em.role = 'owner')
      )
  );
$$;

-- =============================================================================
-- FUNCTION: get_menu_establishment_id
-- Helper to look up the establishment_id from a menu_id.
-- Avoids repeated joins in RLS policies.
-- =============================================================================

create or replace function public.get_menu_establishment_id(p_menu_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select establishment_id from public.menus where id = p_menu_id limit 1;
$$;

-- =============================================================================
-- FUNCTION: get_section_establishment_id
-- Helper to look up the establishment_id from a section_id.
-- =============================================================================

create or replace function public.get_section_establishment_id(p_section_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.establishment_id
  from public.sections s
  join public.menus m on m.id = s.menu_id
  where s.id = p_section_id
  limit 1;
$$;

-- =============================================================================
-- FUNCTION: create_menu_version
-- Creates an immutable snapshot of a menu when it is published.
-- Called manually or via a trigger when status changes to 'published'.
-- =============================================================================

create or replace function public.create_menu_version(p_menu_id uuid, p_label text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_version_number integer;
  v_snapshot       jsonb;
  v_new_id         uuid;
begin
  -- Determine the next version number
  select coalesce(max(version_number), 0) + 1
  into v_version_number
  from public.menu_versions
  where menu_id = p_menu_id;

  -- Build a full JSON snapshot of the menu, its sections, and items
  select jsonb_build_object(
    'menu', row_to_json(m.*),
    'sections', (
      select jsonb_agg(
        jsonb_build_object(
          'section', row_to_json(s.*),
          'items', (
            select jsonb_agg(row_to_json(i.*) order by i.display_order)
            from public.items i
            where i.section_id = s.id
          )
        ) order by s.display_order
      )
      from public.sections s
      where s.menu_id = m.id
    )
  )
  into v_snapshot
  from public.menus m
  where m.id = p_menu_id;

  insert into public.menu_versions (menu_id, created_by, version_number, label, snapshot)
  values (p_menu_id, auth.uid(), v_version_number, p_label, v_snapshot)
  returning id into v_new_id;

  return v_new_id;
end;
$$;

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles             enable row level security;
alter table public.establishments       enable row level security;
alter table public.establishment_members enable row level security;
alter table public.menus                enable row level security;
alter table public.sections             enable row level security;
alter table public.items                enable row level security;
alter table public.media_assets         enable row level security;
alter table public.totem_devices        enable row level security;
alter table public.menu_versions        enable row level security;

-- =============================================================================
-- RLS POLICIES: profiles
-- =============================================================================

-- Users can read their own profile
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =============================================================================
-- RLS POLICIES: establishments
-- =============================================================================

-- Members can read their establishment
create policy "establishments: read if member"
  on public.establishments for select
  using (
    owner_id = auth.uid()
    or public.is_establishment_member(id, 'editor')
  );

-- Any authenticated user can create an establishment (they become the owner)
create policy "establishments: insert own"
  on public.establishments for insert
  with check (owner_id = auth.uid());

-- Only owner/admin can update
create policy "establishments: update if admin"
  on public.establishments for update
  using (public.is_establishment_member(id, 'admin') or owner_id = auth.uid())
  with check (public.is_establishment_member(id, 'admin') or owner_id = auth.uid());

-- Only owner can delete
create policy "establishments: delete if owner"
  on public.establishments for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- RLS POLICIES: establishment_members
-- =============================================================================

-- Members can see their own team
create policy "establishment_members: read if member"
  on public.establishment_members for select
  using (public.is_establishment_member(establishment_id, 'editor'));

-- Only admins/owners can add members
create policy "establishment_members: insert if admin"
  on public.establishment_members for insert
  with check (public.is_establishment_member(establishment_id, 'admin'));

-- Only admins/owners can update members
create policy "establishment_members: update if admin"
  on public.establishment_members for update
  using (public.is_establishment_member(establishment_id, 'admin'));

-- Only admins/owners can remove members
create policy "establishment_members: delete if admin"
  on public.establishment_members for delete
  using (public.is_establishment_member(establishment_id, 'admin'));

-- =============================================================================
-- RLS POLICIES: menus
-- =============================================================================

-- Public can read published menus (for totem display)
create policy "menus: public read if published"
  on public.menus for select
  using (status = 'published');

-- Members can read all menus of their establishment (including drafts)
create policy "menus: members read all"
  on public.menus for select
  using (public.is_establishment_member(establishment_id, 'editor'));

-- Editors and above can create menus
create policy "menus: insert if editor"
  on public.menus for insert
  with check (public.is_establishment_member(establishment_id, 'editor'));

-- Editors and above can update menus
create policy "menus: update if editor"
  on public.menus for update
  using (public.is_establishment_member(establishment_id, 'editor'))
  with check (public.is_establishment_member(establishment_id, 'editor'));

-- Only admins can delete menus
create policy "menus: delete if admin"
  on public.menus for delete
  using (public.is_establishment_member(establishment_id, 'admin'));

-- =============================================================================
-- RLS POLICIES: sections
-- =============================================================================

-- Public can read sections of published menus
create policy "sections: public read if menu published"
  on public.sections for select
  using (
    exists (
      select 1 from public.menus m
      where m.id = menu_id and m.status = 'published'
    )
  );

-- Members can read all sections
create policy "sections: members read all"
  on public.sections for select
  using (public.is_establishment_member(public.get_menu_establishment_id(menu_id), 'editor'));

-- Editors can create/update/delete sections
create policy "sections: insert if editor"
  on public.sections for insert
  with check (public.is_establishment_member(public.get_menu_establishment_id(menu_id), 'editor'));

create policy "sections: update if editor"
  on public.sections for update
  using (public.is_establishment_member(public.get_menu_establishment_id(menu_id), 'editor'));

create policy "sections: delete if editor"
  on public.sections for delete
  using (public.is_establishment_member(public.get_menu_establishment_id(menu_id), 'editor'));

-- =============================================================================
-- RLS POLICIES: items
-- =============================================================================

-- Public can read items of published menus
create policy "items: public read if menu published"
  on public.items for select
  using (
    exists (
      select 1
      from public.sections s
      join public.menus m on m.id = s.menu_id
      where s.id = section_id and m.status = 'published'
    )
  );

-- Members can read all items
create policy "items: members read all"
  on public.items for select
  using (public.is_establishment_member(public.get_section_establishment_id(section_id), 'editor'));

-- Editors can create/update/delete items
create policy "items: insert if editor"
  on public.items for insert
  with check (public.is_establishment_member(public.get_section_establishment_id(section_id), 'editor'));

create policy "items: update if editor"
  on public.items for update
  using (public.is_establishment_member(public.get_section_establishment_id(section_id), 'editor'));

create policy "items: delete if editor"
  on public.items for delete
  using (public.is_establishment_member(public.get_section_establishment_id(section_id), 'editor'));

-- =============================================================================
-- RLS POLICIES: media_assets
-- =============================================================================

-- Public can read media assets (images are referenced from public menus)
create policy "media_assets: public read"
  on public.media_assets for select
  using (true);

-- Only members can upload
create policy "media_assets: insert if editor"
  on public.media_assets for insert
  with check (public.is_establishment_member(establishment_id, 'editor'));

-- Only admins can delete assets
create policy "media_assets: delete if admin"
  on public.media_assets for delete
  using (public.is_establishment_member(establishment_id, 'admin'));

-- =============================================================================
-- RLS POLICIES: totem_devices
-- =============================================================================

-- Members can read their totem devices
create policy "totem_devices: read if member"
  on public.totem_devices for select
  using (public.is_establishment_member(establishment_id, 'editor'));

-- Admins can manage devices
create policy "totem_devices: insert if admin"
  on public.totem_devices for insert
  with check (public.is_establishment_member(establishment_id, 'admin'));

create policy "totem_devices: update if admin"
  on public.totem_devices for update
  using (public.is_establishment_member(establishment_id, 'admin'));

create policy "totem_devices: delete if admin"
  on public.totem_devices for delete
  using (public.is_establishment_member(establishment_id, 'admin'));

-- =============================================================================
-- RLS POLICIES: menu_versions
-- =============================================================================

-- Members can read version history
create policy "menu_versions: read if member"
  on public.menu_versions for select
  using (
    public.is_establishment_member(
      public.get_menu_establishment_id(menu_id), 'editor'
    )
  );

-- Versions are created only via the create_menu_version() function (security definer)
-- No direct insert/update/delete allowed from the client side.

-- =============================================================================
-- STORAGE: Create buckets for media assets
-- Run these after enabling Supabase Storage in your project dashboard.
-- =============================================================================

-- Public bucket for all establishment media (logos, backgrounds, item images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,                                           -- Publicly readable CDN URLs
  5242880,                                        -- 5MB per file limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

-- Storage RLS: Allow authenticated users to upload to their establishment folder
-- Storage paths must follow the convention: {establishment_id}/{filename}

create policy "storage media: public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "storage media: authenticated upload"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and auth.role() = 'authenticated'
  );

create policy "storage media: owner can delete"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and auth.role() = 'authenticated'
  );
