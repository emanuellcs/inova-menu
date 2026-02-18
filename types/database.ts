// ---------------------------------------------------------------------------
// Enums (mirror PostgreSQL custom types)
// ---------------------------------------------------------------------------

export type MenuStatus = "draft" | "published" | "archived";
export type MemberRole = "owner" | "admin" | "editor";
export type PlanTier = "free" | "pro" | "enterprise";

// ---------------------------------------------------------------------------
// Theme Configuration — the schema-driven UI contract
// Stored as JSONB in menus.theme_config. The public totem page reads this
// object to dynamically render all styles without hardcoded values.
// ---------------------------------------------------------------------------

export interface ThemeColors {
  primary: string; // e.g. "#FF69B4"
  secondary: string; // e.g. "#FFB6C1"
  background: string; // e.g. "#FFF0F5"
  text: string; // e.g. "#3D003D"
  accent: string; // e.g. "#FF1493"
  cardBorder: string; // e.g. "#FFB6C1"
  cardBackground: string; // e.g. "rgba(255,255,255,0.9)"
}

export type BackgroundType = "gradient" | "image" | "solid";

export interface ThemeBackground {
  type: BackgroundType;
  gradientStart: string; // e.g. "#FFF0F5"
  gradientEnd: string; // e.g. "#FFE4F1"
  gradientAngle: number; // e.g. 135
  imageUrl: string | null;
  imageOverlayOpacity: number; // 0–1
}

export interface ThemeTypography {
  fontFamily: string; // e.g. "Poppins"
  fontUrl: string; // Google Fonts URL
  baseFontSize: string; // e.g. "1.1rem"
  sectionTitleSize: string; // e.g. "2.5rem"
  productTitleSize: string; // e.g. "1.4rem"
}

export type ButtonStyle = "pill" | "square" | "outlined";

export interface ThemeHeader {
  showLogo: boolean;
  logoUrl: string | null;
  title: string;
  subtitle: string | null;
  backgroundType: BackgroundType;
  backgroundValue: string | null; // gradient string, image URL, or hex color
  showAnimatedBackground: boolean;
}

export interface ThemeNavigation {
  showNavBar: boolean;
  buttonStyle: ButtonStyle;
  stickyNav: boolean;
}

export type HoverEffect = "lift" | "glow" | "none";

export interface ThemeProductCard {
  showIcon: boolean;
  showBadge: boolean;
  showDescription: boolean;
  showPrice: boolean;
  showImage: boolean;
  hoverEffect: HoverEffect;
  borderRadius: string; // e.g. "20px"
}

export interface ThemeFooter {
  text: string;
  subtext: string | null;
  showSocialLinks: boolean;
}

export interface ThemeLayout {
  sectionSpacing: string; // e.g. "mt-5" (Tailwind class or CSS value)
  gridMinColumnWidth: string; // e.g. "300px"
  gridGap: string; // e.g. "2rem"
  maxWidth: string; // e.g. "1400px"
  containerPadding: string; // e.g. "1rem"
}

/** Full theme configuration stored in menus.theme_config */
export interface ThemeConfig {
  colors: ThemeColors;
  background: ThemeBackground;
  typography: ThemeTypography;
  header: ThemeHeader;
  navigation: ThemeNavigation;
  productCard: ThemeProductCard;
  footer: ThemeFooter;
  layout: ThemeLayout;
}

/** Default theme — mirrors the reference index.html design */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  colors: {
    primary: "#FF69B4",
    secondary: "#FFB6C1",
    background: "#FFF0F5",
    text: "#3D003D",
    accent: "#FF1493",
    cardBorder: "#FFB6C1",
    cardBackground: "rgba(255, 255, 255, 0.9)",
  },
  background: {
    type: "gradient",
    gradientStart: "#FFF0F5",
    gradientEnd: "#FFE4F1",
    gradientAngle: 135,
    imageUrl: null,
    imageOverlayOpacity: 0.5,
  },
  typography: {
    fontFamily: "Poppins",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    baseFontSize: "1.1rem",
    sectionTitleSize: "2.5rem",
    productTitleSize: "1.4rem",
  },
  header: {
    showLogo: true,
    logoUrl: null,
    title: "Inova Drinks",
    subtitle: null,
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
    showAnimatedBackground: true,
  },
  navigation: {
    showNavBar: true,
    buttonStyle: "pill",
    stickyNav: false,
  },
  productCard: {
    showIcon: true,
    showBadge: true,
    showDescription: true,
    showPrice: true,
    showImage: false,
    hoverEffect: "lift",
    borderRadius: "20px",
  },
  footer: {
    text: "© 2025 Inova Drinks - Todos os direitos reservados",
    subtext: "Feito com amor por @paulo.mml",
    showSocialLinks: false,
  },
  layout: {
    sectionSpacing: "5rem",
    gridMinColumnWidth: "300px",
    gridGap: "2rem",
    maxWidth: "1400px",
    containerPadding: "1rem",
  },
};

// ---------------------------------------------------------------------------
// Section style overrides (per-section customisation)
// ---------------------------------------------------------------------------

export interface SectionStyleOverrides {
  titleBackground?: string;
  titleColor?: string;
  titleFontSize?: string;
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------------
// Item style overrides and modal config
// ---------------------------------------------------------------------------

export interface ItemStyleOverrides {
  badgeColor?: string;
  badgeBackground?: string;
  cardBackground?: string;
  titleColor?: string;
  [key: string]: string | undefined;
}

export interface ItemModalConfig {
  iconClass: string; // Font Awesome class, e.g. "fas fa-cocktail"
  showIngredients: boolean;
  showPrice: boolean;
  extraInfo: string | null;
}

// ---------------------------------------------------------------------------
// Database Row Types
// These mirror the exact columns returned by Supabase queries.
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Establishment {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: PlanTier;
  plan_expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentMember {
  id: string;
  establishment_id: string;
  profile_id: string;
  role: MemberRole;
  invited_at: string;
  accepted_at: string | null;
}

export interface Menu {
  id: string;
  establishment_id: string;
  name: string;
  description: string | null;
  status: MenuStatus;
  is_default: boolean;
  theme_config: ThemeConfig;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  menu_id: string;
  title: string;
  icon_class: string | null;
  anchor_id: string | null;
  description: string | null;
  display_order: number;
  is_visible: boolean;
  style_overrides: SectionStyleOverrides;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  section_id: string;
  name: string;
  description: string | null;
  ingredients: string | null;
  category_badge: string | null;
  icon_class: string | null;
  image_url: string | null;
  price: number | null;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  style_overrides: ItemStyleOverrides;
  modal_config: ItemModalConfig;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  establishment_id: string;
  uploaded_by: string | null;
  bucket_name: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  width_px: number | null;
  height_px: number | null;
  alt_text: string | null;
  created_at: string;
}

export interface TotemDevice {
  id: string;
  establishment_id: string;
  menu_id: string | null;
  name: string;
  device_token: string;
  last_seen_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuVersion {
  id: string;
  menu_id: string;
  created_by: string | null;
  version_number: number;
  label: string | null;
  snapshot: MenuSnapshot;
  published_at: string;
}

// ---------------------------------------------------------------------------
// Composite / Joined Types
// Returned by queries that JOIN multiple tables.
// ---------------------------------------------------------------------------

/** A section with its items pre-loaded. Used by the totem page and editor. */
export interface SectionWithItems extends Section {
  items: Item[];
}

/** A full menu with sections and items. Used by the totem page. */
export interface MenuWithSections extends Menu {
  sections: SectionWithItems[];
}

/** Snapshot shape stored in menu_versions.snapshot */
export interface MenuSnapshot {
  menu: Menu;
  sections: Array<{
    section: Section;
    items: Item[];
  }>;
}

/** Establishment with the active user's role. Returned by dashboard queries. */
export interface EstablishmentWithRole extends Establishment {
  role: MemberRole;
}

// ---------------------------------------------------------------------------
// Supabase Database type map (used when typing the Supabase client)
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      establishments: {
        Row: Establishment;
        Insert: Omit<Establishment, "id" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<Establishment, "id" | "created_at" | "updated_at">
        >;
      };
      establishment_members: {
        Row: EstablishmentMember;
        Insert: Omit<EstablishmentMember, "id" | "invited_at">;
        Update: Partial<Omit<EstablishmentMember, "id" | "invited_at">>;
      };
      menus: {
        Row: Menu;
        Insert: Omit<Menu, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Menu, "id" | "created_at" | "updated_at">>;
      };
      sections: {
        Row: Section;
        Insert: Omit<Section, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Section, "id" | "created_at" | "updated_at">>;
      };
      items: {
        Row: Item;
        Insert: Omit<Item, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Item, "id" | "created_at" | "updated_at">>;
      };
      media_assets: {
        Row: MediaAsset;
        Insert: Omit<MediaAsset, "id" | "created_at">;
        Update: Partial<Omit<MediaAsset, "id" | "created_at">>;
      };
      totem_devices: {
        Row: TotemDevice;
        Insert: Omit<TotemDevice, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TotemDevice, "id" | "created_at" | "updated_at">>;
      };
      menu_versions: {
        Row: MenuVersion;
        Insert: Omit<MenuVersion, "id" | "published_at">;
        Update: never; // Versions are immutable
      };
    };
    Enums: {
      menu_status: MenuStatus;
      member_role: MemberRole;
      plan_tier: PlanTier;
    };
  };
};
