import type { Metadata } from "next";
import { Martini } from "lucide-react";

export const metadata: Metadata = {
  title: "Acesso",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-body p-4 animate-in fade-in duration-700">
      {/* Dot pattern background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07] z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--theme-color-primary, #FF69B4) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / brand mark */}
        <div className="flex flex-col items-center mb-8 gap-3 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-brand"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            <Martini className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-brand-purple">Inova Menu</h1>
          <p className="text-sm text-brand-purple/60 text-center">
            Cardápios digitais para bares e restaurantes
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-[20px] shadow-brand border-2 border-brand-secondary p-8 animate-in zoom-in-95 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}

