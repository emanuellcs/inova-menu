import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Acesso",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#FFF0F5] to-[#FFE4F1] p-4">
      {/* Dot pattern background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07] z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #FF69B4 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / brand mark */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-brand"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            🍹
          </div>
          <h1 className="text-2xl font-bold text-[#3D003D]">Inova Menu</h1>
          <p className="text-sm text-[#3D003D]/60 text-center">
            Cardápios digitais para bares e restaurantes
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-[20px] shadow-brand border-2 border-[#FFB6C1] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
