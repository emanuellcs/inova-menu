/**
 * Enum representing the status of a menu.
 */
export type MenuStatus = "draft" | "published" | "archived";

/**
 * Enum representing the role of a member in an establishment.
 */
export type MemberRole = "owner" | "admin" | "editor";

/**
 * Enum representing the plan tier of an establishment.
 */
export type PlanTier = "free" | "pro" | "enterprise";

/**
 * Theme color configuration for the UI.
 */
export interface ThemeColors {
  /** Primary brand color (e.g., "#FF69B4") */
  primary: string;
  /** Secondary brand color (e.g., "#FFB6C1") */
  secondary: string;
  /** Main background color (e.g., "#FFF0F5") */
  background: string;
  /** Default text color (e.g., "#3D003D") */
  text: string;
  /** Accent color for highlights (e.g., "#FF1493") */
  accent: string;
  /** Border color for cards (e.g., "#FFB6C1") */
  cardBorder: string;
  /** Background color for cards (e.g., "rgba(255,255,255,0.9)") */
  cardBackground: string;
}

/**
 * Types of backgrounds supported by the theme.
 */
export type BackgroundType = "gradient" | "image" | "solid";

/**
 * Configuration for the application background.
 */
export interface ThemeBackground {
  /** The type of background to display */
  type: BackgroundType;
  /** Starting color for gradient backgrounds (e.g., "#FFF0F5") */
  gradientStart: string;
  /** Ending color for gradient backgrounds (e.g., "#FFE4F1") */
  gradientEnd: string;
  /** Angle of the gradient in degrees (e.g., 135) */
  gradientAngle: number;
  /** Optional URL for an image background */
  imageUrl: string | null;
  /** Opacity of the image overlay (0 to 1) */
  imageOverlayOpacity: number;
}

/**
 * Typography settings for the theme.
 */
export interface ThemeTypography {
  /** Font family name (e.g., "Poppins") */
  fontFamily: string;
  /** URL to load the font from (e.g., Google Fonts URL) */
  fontUrl: string;
  /** Base font size for regular text (e.g., "1.1rem") */
  baseFontSize: string;
  /** Font size for section titles (e.g., "2.5rem") */
  sectionTitleSize: string;
  /** Font size for product titles (e.g., "1.4rem") */
  productTitleSize: string;
}

/**
 * Available button styles for navigation and actions.
 */
export type ButtonStyle = "pill" | "square" | "outlined";

/**
 * Configuration for the menu header.
 */
export interface ThemeHeader {
  /** Whether to show the establishment logo */
  showLogo: boolean;
  /** URL of the logo image */
  logoUrl: string | null;
  /** Main title displayed in the header */
  title: string;
  /** Optional subtitle or description */
  subtitle: string | null;
  /** Background type for the header area */
  backgroundType: BackgroundType;
  /** Value for the background (gradient string, image URL, or hex color) */
  backgroundValue: string | null;
  /** Whether to enable animated background effects */
  showAnimatedBackground: boolean;
}

/**
 * Navigation configuration for the totem.
 */
export interface ThemeNavigation {
  /** Whether to show the navigation bar */
  showNavBar: boolean;
  /** Visual style for navigation buttons */
  buttonStyle: ButtonStyle;
  /** Whether the navigation bar should stick to the top on scroll */
  stickyNav: boolean;
}

/**
 * Hover effects for interactive elements.
 */
export type HoverEffect = "lift" | "glow" | "none";

/**
 * Visual configuration for product cards.
 */
export interface ThemeProductCard {
  /** Whether to show an icon on the card */
  showIcon: boolean;
  /** Whether to show a category or status badge */
  showBadge: boolean;
  /** Whether to show the product description */
  showDescription: boolean;
  /** Whether to show the product price */
  showPrice: boolean;
  /** Whether to show a product image */
  showImage: boolean;
  /** Effect applied when hovering over the card */
  hoverEffect: HoverEffect;
  /** Border radius of the card (e.g., "20px") */
  borderRadius: string;
}

/**
 * Configuration for the menu footer.
 */
export interface ThemeFooter {
  /** Main footer text */
  text: string;
  /** Optional secondary text or credits */
  subtext: string | null;
  /** Whether to display social media links */
  showSocialLinks: boolean;
}

/**
 * Layout and spacing configuration for the menu.
 */
export interface ThemeLayout {
  /** Spacing between sections (Tailwind class or CSS value, e.g., "5rem") */
  sectionSpacing: string;
  /** Minimum width for grid columns (e.g., "300px") */
  gridMinColumnWidth: string;
  /** Gap between grid items (e.g., "2rem") */
  gridGap: string;
  /** Maximum width of the content container (e.g., "1400px") */
  maxWidth: string;
  /** Padding for the content container (e.g., "1rem") */
  containerPadding: string;
}

/**
 * Full theme configuration stored in the database.
 * This contract drives the dynamic UI of the totem page.
 */
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

/**
 * Default theme configuration based on the reference design.
 */
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

/**
 * Style overrides that can be applied to individual sections.
 */
export interface SectionStyleOverrides {
  titleBackground?: string;
  titleColor?: string;
  titleFontSize?: string;
  [key: string]: string | undefined;
}

/**
 * Style overrides that can be applied to individual items.
 */
export interface ItemStyleOverrides {
  badgeColor?: string;
  badgeBackground?: string;
  cardBackground?: string;
  titleColor?: string;
  [key: string]: string | undefined;
}

/**
 * Configuration for the item detail modal.
 */
export interface ItemModalConfig {
  /** Font Awesome class for the icon (e.g., "fas fa-cocktail") */
  iconClass: string;
  /** Whether to list ingredients in the modal */
  showIngredients: boolean;
  /** Whether to show the price in the modal */
  showPrice: boolean;
  /** Additional information or description for the modal */
  extraInfo: string | null;
}

/**
 * Represents a user profile in the system.
 */
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a business establishment.
 */
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

/**
 * Represents a membership relationship between a profile and an establishment.
 */
export interface EstablishmentMember {
  id: string;
  establishment_id: string;
  profile_id: string;
  role: MemberRole;
  invited_at: string;
  accepted_at: string | null;
}

/**
 * Represents a digital menu.
 */
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

/**
 * Represents a section within a menu.
 */
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

/**
 * Represents a product or service item within a section.
 */
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

/**
 * Represents a media asset (image, etc.) uploaded to storage.
 */
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

/**
 * Represents a totem hardware device assigned to an establishment.
 */
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

/**
 * Represents a historical version of a menu.
 */
export interface MenuVersion {
  id: string;
  menu_id: string;
  created_by: string | null;
  version_number: number;
  label: string | null;
  snapshot: MenuSnapshot;
  published_at: string;
}

/**
 * A section with its items pre-loaded.
 */
export interface SectionWithItems extends Section {
  items: Item[];
}

/**
 * A full menu with sections and items included.
 */
export interface MenuWithSections extends Menu {
  sections: SectionWithItems[];
}

/**
 * Data structure for a menu snapshot stored in versions.
 */
export interface MenuSnapshot {
  menu: Menu;
  sections: Array<{
    section: Section;
    items: Item[];
  }>;
}

/**
 * Establishment data combined with the current user's role.
 */
export interface EstablishmentWithRole extends Establishment {
  role: MemberRole;
}

/**
 * Main database type definition for Supabase integration.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Omit<Profile, "id" | "created_at" | "updated_at">> & Pick<Profile, "id">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      establishments: {
        Row: Establishment;
        Insert: Omit<Establishment, "id" | "plan" | "is_active" | "created_at" | "updated_at" | "logo_url" | "plan_expires_at"> & {
          plan?: PlanTier;
          is_active?: boolean;
          logo_url?: string | null;
          plan_expires_at?: string | null;
        };
        Update: Partial<
          Omit<Establishment, "id" | "created_at" | "updated_at">
        >;
        Relationships: [
          {
            foreignKeyName: "establishments_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      establishment_members: {
        Row: EstablishmentMember;
        Insert: Omit<EstablishmentMember, "id" | "role" | "invited_at"> & {
          role?: MemberRole;
        };
        Update: Partial<Omit<EstablishmentMember, "id" | "invited_at">>;
        Relationships: [
          {
            foreignKeyName: "establishment_members_establishment_id_fkey";
            columns: ["establishment_id"];
            isOneToOne: false;
            referencedRelation: "establishments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "establishment_members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      menus: {
        Row: Menu;
        Insert: Omit<Menu, "id" | "status" | "is_default" | "theme_config" | "created_at" | "updated_at" | "description"> & {
          status?: MenuStatus;
          is_default?: boolean;
          theme_config?: ThemeConfig;
          description?: string | null;
        };
        Update: Partial<Omit<Menu, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "menus_establishment_id_fkey";
            columns: ["establishment_id"];
            isOneToOne: false;
            referencedRelation: "establishments";
            referencedColumns: ["id"];
          }
        ];
      };
      sections: {
        Row: Section;
        Insert: Omit<Section, "id" | "display_order" | "is_visible" | "style_overrides" | "created_at" | "updated_at" | "icon_class" | "anchor_id" | "description"> & {
          display_order?: number;
          is_visible?: boolean;
          style_overrides?: SectionStyleOverrides;
          icon_class?: string | null;
          anchor_id?: string | null;
          description?: string | null;
        };
        Update: Partial<Omit<Section, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "sections_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          }
        ];
      };
      items: {
        Row: Item;
        Insert: Omit<Item, "id" | "is_available" | "is_featured" | "display_order" | "style_overrides" | "modal_config" | "created_at" | "updated_at" | "description" | "ingredients" | "category_badge" | "icon_class" | "image_url" | "price"> & {
          is_available?: boolean;
          is_featured?: boolean;
          display_order?: number;
          style_overrides?: ItemStyleOverrides;
          modal_config?: ItemModalConfig;
          description?: string | null;
          ingredients?: string | null;
          category_badge?: string | null;
          icon_class?: string | null;
          image_url?: string | null;
          price?: number | null;
        };
        Update: Partial<Omit<Item, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "items_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "sections";
            referencedColumns: ["id"];
          }
        ];
      };
      media_assets: {
        Row: MediaAsset;
        Insert: Omit<MediaAsset, "id" | "bucket_name" | "created_at" | "uploaded_by" | "mime_type" | "width_px" | "height_px" | "alt_text" | "file_size_bytes"> & {
          bucket_name?: string;
          uploaded_by?: string | null;
          mime_type?: string | null;
          width_px?: number | null;
          height_px?: number | null;
          alt_text?: string | null;
          file_size_bytes?: number | null;
        };
        Update: Partial<Omit<MediaAsset, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "media_assets_establishment_id_fkey";
            columns: ["establishment_id"];
            isOneToOne: false;
            referencedRelation: "establishments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      totem_devices: {
        Row: TotemDevice;
        Insert: Omit<TotemDevice, "id" | "device_token" | "is_active" | "created_at" | "updated_at" | "menu_id" | "last_seen_at"> & {
          device_token?: string;
          is_active?: boolean;
          menu_id?: string | null;
          last_seen_at?: string | null;
        };
        Update: Partial<Omit<TotemDevice, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "totem_devices_establishment_id_fkey";
            columns: ["establishment_id"];
            isOneToOne: false;
            referencedRelation: "establishments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "totem_devices_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          }
        ];
      };
      menu_versions: {
        Row: MenuVersion;
        Insert: Omit<MenuVersion, "id" | "published_at" | "created_by" | "label"> & {
          created_by?: string | null;
          label?: string | null;
        };
        Update: never; // Versions are immutable
        Relationships: [
          {
            foreignKeyName: "menu_versions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_versions_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_menu_version: {
        Args: {
          p_menu_id: string;
          p_label: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      menu_status: MenuStatus;
      member_role: MemberRole;
      plan_tier: PlanTier;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
