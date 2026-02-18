import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";

// ---------------------------------------------------------------------------
// Font — Poppins as the default. Individual menu pages may load additional
// fonts via a <link> injected by the ThemeProvider based on theme_config.
// ---------------------------------------------------------------------------

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    template: "%s | Inova Menu",
    default: "Inova Menu — Cardápios digitais para bares",
  },
  description:
    "Crie e gerencie cardápios digitais personalizados para totens e displays. Plataforma No-Code para bares e restaurantes.",
  keywords: [
    "cardápio digital",
    "totem",
    "bar",
    "drinks",
    "inova",
    "menu digital",
  ],
  authors: [{ name: "Inova Menu" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Inova Menu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Totem devices should not scale
  maximumScale: 1,
};

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans antialiased">
        {children}

        {/* Global toast notifications — used by admin actions */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.9rem",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#FF69B4",
                secondary: "#fff",
              },
              style: {
                border: "1px solid #FFB6C1",
              },
            },
            error: {
              style: {
                border: "1px solid #fca5a5",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
