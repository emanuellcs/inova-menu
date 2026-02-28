"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Martini, 
  ArrowRight, 
  Leaf, 
  Droplets, 
  Apple, 
  Cherry, 
  Layout, 
  Monitor, 
  Zap, 
  Image as ImageIcon, 
  LayoutList, 
  ShieldCheck 
} from "lucide-react";

/**
 * Custom hook to handle scroll-reveal animations.
 * Observes elements with the `data-reveal` attribute and adds the `is-visible` class when they enter the viewport.
 */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/**
 * Visual mockup of the totem interface, rendered using CSS.
 * Used as a hero asset to demonstrate the product's look and feel.
 */
function TotemMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: 240,
        filter: "drop-shadow(0 40px 80px rgba(255,105,180,0.45))",
        animation: "floatMockup 5s ease-in-out infinite",
      }}
    >
      <div
        className="rounded-[28px] overflow-hidden border"
        style={{
          border: "1.5px solid rgba(255,105,180,0.3)",
          background: "linear-gradient(160deg, #FFF0F5 0%, #FFE4F1 100%)",
        }}
      >
        <div
          className="px-4 py-4 flex flex-col items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/40"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Martini className="w-5 h-5 text-white" />
          </div>
          <p className="text-white font-bold text-sm tracking-wide">
            Inova Drinks
          </p>
        </div>

        <div className="flex gap-1.5 px-3 py-2.5 justify-center flex-wrap">
          {["Gin", "Coquetéis", "Sem Álcool"].map((label) => (
            <span
              key={label}
              className="text-white text-[9px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          className="mx-3 mb-2 py-2 rounded-xl text-center flex items-center justify-center gap-1.5"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          <Martini className="w-3 h-3 text-white/90" />
          <p className="text-white text-[10px] font-bold tracking-wider">
            ESTAÇÃO GIN
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 px-3 pb-4">
          {[
            { name: "GIN TROPICAL", badge: "Especial", icon: Leaf },
            { name: "GIN CLÁSSICO", badge: "Clássico", icon: Droplets },
            { name: "APPLE GIN", badge: "Frutas", icon: Apple },
            { name: "GIN MORANGO", badge: "Frutas", icon: Cherry },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.name}
                className="rounded-xl p-2 text-center border flex flex-col items-center"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderColor: "#FFB6C1",
                }}
              >
                <Icon className="w-4 h-4 text-[#FF69B4] mb-1" />
                <span
                  className="text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full block mb-1 w-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)",
                  }}
                >
                  {card.badge}
                </span>
                <p className="text-[8px] font-bold text-[#3D003D] leading-tight">
                  {card.name}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="py-2 text-center"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          <p className="text-white/80 text-[8px]">© 2025 Inova Drinks</p>
        </div>
      </div>

      <div
        className="absolute -right-4 -top-4 w-16 h-16 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,105,180,0.6) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}

/**
 * Sticky navigation bar for the landing page.
 * Becomes translucent and applies a blur effect as the user scrolls.
 */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(12, 0, 20, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,105,180,0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            <Martini className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Inova <span style={{ color: "#FF69B4" }}>Menu</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/entrar"
            className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * Card representing a platform feature.
 */
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      data-reveal
      className="reveal-card rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,105,180,0.15)",
        backdropFilter: "blur(12px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,105,180,0.2) 0%, rgba(255,20,147,0.2) 100%)",
          border: "1px solid rgba(255,105,180,0.3)",
        }}
      >
        <Icon className="w-6 h-6 text-[#FF69B4]" />
      </div>
      <h3 className="font-bold text-white text-lg mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * Card representing a step in the user's onboarding process.
 */
function StepCard({
  step,
  title,
  description,
  delay,
}: {
  step: number;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      data-reveal
      className="reveal-card flex flex-col items-center text-center"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-5 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          boxShadow: "0 8px 24px rgba(255,105,180,0.4)",
        }}
      >
        {step}
      </div>

      <h3 className="font-bold text-[#3D003D] text-lg mb-2">{title}</h3>
      <p className="text-[#3D003D]/60 text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

/**
 * Visual pill for displaying system statistics.
 */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-4xl font-bold"
        style={{
          background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {value}
      </span>
      <span className="text-white/50 text-sm font-medium">{label}</span>
    </div>
  );
}

/**
 * Main landing page for the Inova Menu platform.
 * Presents the value proposition, features, and call-to-actions.
 */
export default function LandingPage() {
  useScrollReveal();

  return (
    <>
      {/* Google Font: DM Serif Display for headlines */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
        precedence="default"
      />

      <style>{`
        /* Scroll-reveal base state */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                      transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero text entrance */
        .hero-line {
          opacity: 0;
          transform: translateY(24px);
          animation: heroReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes heroReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Totem mockup float animation */
        @keyframes floatMockup {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-14px) rotate(1deg); }
        }

        /* Glow pulse on background orbs */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.08); }
        }

        /* Interactive card hover state */
        .reveal-card {
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                      transform 0.65s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s ease,
                      border-color 0.3s ease;
        }
        .reveal-card:hover {
          box-shadow: 0 0 0 1px rgba(255,105,180,0.35),
                      0 20px 50px rgba(255,105,180,0.15);
          border-color: rgba(255,105,180,0.4) !important;
        }

        /* Shimmer effect for buttons */
        .cta-btn { position: relative; overflow: hidden; }
        .cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .cta-btn:hover::after { transform: translateX(100%); }
      `}</style>

      <div
        className="relative overflow-x-hidden"
        style={{
          background: "#0C0010",
          color: "white",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Navbar />

        {/* Hero Section: Value Proposition */}
        <section className="relative min-h-screen flex items-center pt-16">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,105,180,0.12) 0%, transparent 70%)",
                animation: "glowPulse 6s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,20,147,0.08) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-20 right-0 w-80 h-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,105,180,0.07) 0%, transparent 70%)",
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #FF69B4 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-5 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div>
                <div
                  className="hero-line inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
                  style={{
                    background: "rgba(255,105,180,0.12)",
                    border: "1px solid rgba(255,105,180,0.3)",
                    color: "#FF69B4",
                    animationDelay: "0.1s",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#FF69B4" }}
                  />
                  Plataforma No-Code para bares
                </div>

                <h1
                  className="hero-line leading-[1.08] mb-6"
                  style={{
                    fontFamily: '"DM Serif Display", serif',
                    fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                    animationDelay: "0.22s",
                  }}
                >
                  Seu cardápio digital,
                  <br />
                  <em
                    className="not-italic"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    com a identidade
                  </em>
                  <br />
                  do seu bar.
                </h1>

                <p
                  className="hero-line text-white/55 leading-relaxed mb-10"
                  style={{
                    fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                    maxWidth: "480px",
                    animationDelay: "0.38s",
                  }}
                >
                  Crie cardápios personalizados para totens e displays. Drag &
                  drop, cores, fontes e publicação com um clique — sem escrever
                  uma linha de código.
                </p>

                <div
                  className="hero-line flex flex-wrap gap-3"
                  style={{ animationDelay: "0.52s" }}
                >
                  <Link
                    href="/cadastro"
                    className="cta-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                      boxShadow: "0 12px 32px rgba(255,105,180,0.4)",
                    }}
                  >
                    Começar grátis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/entrar"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-white/8"
                    style={{
                      border: "1.5px solid rgba(255,255,255,0.18)",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    Já tenho conta
                  </Link>
                </div>

                <p
                  className="hero-line mt-5 text-white/30 text-xs"
                  style={{ animationDelay: "0.62s" }}
                >
                  Gratuito para começar · Sem cartão de crédito
                </p>
              </div>

              <div
                className="hero-line flex justify-center lg:justify-end"
                style={{ animationDelay: "0.4s" }}
              >
                <TotemMockup />
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25"
            style={{ animation: "heroReveal 1s 1s ease both" }}
          >
            <span className="text-xs tracking-widest uppercase font-medium">
              scroll
            </span>
            <div
              className="w-px h-8"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,105,180,0.5), transparent)",
              }}
            />
          </div>
        </section>

        {/* Features Section: Platform capabilities */}
        <section className="relative py-28 px-5">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,105,180,0.04) 50%, transparent 100%)",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p
                data-reveal
                className="reveal-card text-xs font-semibold uppercase tracking-[0.2em] mb-4 inline-block"
                style={{ color: "#FF69B4" }}
              >
                Tudo que você precisa
              </p>
              <h2
                data-reveal
                className="reveal-card"
                style={{
                  fontFamily: '"DM Serif Display", serif',
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1.15,
                }}
              >
                Feito para bares.
                <br />
                <span className="text-pink-gradient">
                  Simples para qualquer um.
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                delay={0}
                icon={Layout}
                title="Editor No-Code"
                description="Arraste seções, edite textos e personalize cores em tempo real. Nenhuma linha de código necessária — só criatividade."
              />
              <FeatureCard
                delay={120}
                icon={Monitor}
                title="Otimizado para Totens"
                description="Layout pensado para telas verticais 1080×1920. Animações, fontes e grids que encantam clientes na mesa."
              />
              <FeatureCard
                delay={240}
                icon={Zap}
                title="Publicação Instantânea"
                description="Clicou em publicar, mudou no totem. Atualize preços, adicione itens ou troque o tema sem fechar o bar."
              />
              <FeatureCard
                delay={0}
                icon={ImageIcon}
                title="Temas Customizáveis"
                description="Cores, gradientes, fontes e imagens de fundo. Cada cardápio reflete o DNA visual do seu estabelecimento."
              />
              <FeatureCard
                delay={120}
                icon={LayoutList}
                title="Múltiplos Cardápios"
                description="Crie cardápios diferentes para happy hour, fin de semana ou eventos especiais. Troque o padrão com um clique."
              />
              <FeatureCard
                delay={240}
                icon={ShieldCheck}
                title="Histórico de Versões"
                description="Cada publicação gera um snapshot imutável. Volte para qualquer versão anterior em segundos."
              />
            </div>
          </div>
        </section>

        {/* Workflow Section: How it works */}
        <section
          className="py-28 px-5"
          style={{
            background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                data-reveal
                className="reveal-card text-xs font-semibold uppercase tracking-[0.2em] mb-4 inline-block"
                style={{ color: "#FF1493" }}
              >
                Como funciona
              </p>
              <h2
                data-reveal
                className="reveal-card"
                style={{
                  fontFamily: '"DM Serif Display", serif',
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#3D003D",
                  lineHeight: 1.15,
                }}
              >
                Do cadastro ao totem
                <br />
                em três passos.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-10 relative">
              <div
                className="hidden sm:block absolute top-7 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px"
                style={{
                  background:
                    "linear-gradient(90deg, #FF69B4, #FF1493, #FF69B4)",
                }}
                aria-hidden="true"
              />

              <StepCard
                step={1}
                delay={0}
                title="Crie seu cardápio"
                description="Adicione seções, produtos e preços através do editor visual. Simples como um slide."
              />
              <StepCard
                step={2}
                delay={150}
                title="Personalize o visual"
                description="Ajuste cores, fontes e fundo para combinar com a identidade do seu bar em segundos."
              />
              <StepCard
                step={3}
                delay={300}
                title="Publique no totem"
                description="Clique em publicar. O cardápio aparece instantaneamente em todos os seus totens."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className="py-20 px-5 border-y"
          style={{ borderColor: "rgba(255,105,180,0.12)" }}
        >
          <div
            data-reveal
            className="reveal-card max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-10 text-center"
          >
            <Stat value="∞" label="Itens por cardápio" />
            <Stat value="1s" label="Tempo de publicação" />
            <Stat value="100%" label="No-Code" />
            <Stat value="4K" label="Resolução suportada" />
          </div>
        </section>

        {/* Closing Call-to-Action */}
        <section className="relative py-32 px-5 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className="w-[600px] h-[600px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)",
                animation: "glowPulse 5s ease-in-out infinite",
              }}
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              data-reveal
              className="reveal-card mb-5"
              style={{
                fontFamily: '"DM Serif Display", serif',
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                lineHeight: 1.1,
              }}
            >
              Pronto para encantar
              <br />
              <span className="text-pink-gradient">seus clientes?</span>
            </h2>

            <p
              data-reveal
              className="reveal-card text-white/50 mb-10 leading-relaxed"
              style={{ fontSize: "1.05rem", transitionDelay: "120ms" }}
            >
              Crie sua conta em menos de 2 minutos.
              <br className="hidden sm:block" />
              Sem cartão de crédito. Sem complicação.
            </p>

            <div
              data-reveal
              className="reveal-card flex flex-col sm:flex-row gap-4 justify-center items-center"
              style={{ transitionDelay: "240ms" }}
            >
              <Link
                href="/cadastro"
                className="cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90 active:scale-95 w-full sm:w-auto justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                  boxShadow: "0 16px 48px rgba(255,105,180,0.45)",
                }}
              >
                Criar conta grátis
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer
          className="py-10 px-5 border-t"
          style={{ borderColor: "rgba(255,105,180,0.1)" }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                }}
              >
                <Martini className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white/80">
                Inova <span style={{ color: "#FF69B4" }}>Menu</span>
              </span>
            </div>

            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Inova Menu. Todos os direitos
              reservados.
            </p>

            <div className="flex items-center gap-5">
              <Link
                href="/entrar"
                className="text-white/40 hover:text-white/80 text-sm transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="text-white/40 hover:text-white/80 text-sm transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
