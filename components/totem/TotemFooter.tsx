import type { ThemeConfig } from "@/types/database";

interface TotemFooterProps {
  theme: ThemeConfig;
}

/**
 * TotemFooter renders the bottom footer bar from the reference index.html.
 * All text content is driven by theme_config.footer to allow per-establishment
 * customisation from the admin panel.
 */
export function TotemFooter({ theme }: TotemFooterProps) {
  const { footer, colors } = theme;

  return (
    <footer
      className="relative z-10 py-8 px-4 text-center"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
        marginTop: theme.layout.sectionSpacing,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-white font-medium flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-3" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
          </svg>
          {footer.text}
        </p>

        {footer.subtext && (
          <p className="text-white/80 text-sm mt-2 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {footer.subtext}
          </p>
        )}
      </div>
    </footer>
  );
}
