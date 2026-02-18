import Link from "next/link";

export default function TotemNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4"
      style={{
        background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
        color: "#3D003D",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="text-8xl animate-bounce">🍹</div>
      <h1 className="text-4xl font-bold">Cardápio não encontrado</h1>
      <p className="text-lg opacity-70 max-w-sm">
        Este link pode estar incorreto ou o cardápio pode estar inativo.
      </p>
      <Link
        href="/"
        className="nav-pill-btn px-8 py-3 text-base font-semibold inline-block"
        style={{
          background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          color: "white",
          borderRadius: "50px",
          textDecoration: "none",
        }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}
