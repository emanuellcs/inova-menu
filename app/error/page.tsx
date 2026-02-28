import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado</h1>
      <p className="text-gray-600 mb-8">
        Houve um problema durante a autenticação. Por favor, tente novamente.
      </p>
      <Link
        href="/entrar"
        className="px-6 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-[#FF1493] transition-colors"
      >
        Voltar para o Login
      </Link>
    </div>
  );
}
