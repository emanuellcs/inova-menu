import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";

/**
 * Default font configuration for the application.
 * Poppins is used as the base font. Individual menus may load their own fonts dynamically.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * Global SEO metadata configuration for the application.
 */
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

/**
 * Viewport configuration, optimized for totem devices and mobile screens.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/**
 * The root layout component shared by all pages in the application.
 * Injects the default font, provides the main HTML structure, and includes global providers like Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans antialiased">
        {children}

        {/* Global toast notification system for user feedback */}
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
