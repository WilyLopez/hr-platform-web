import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-900">
          Página no encontrada
        </h1>
        <p className="mt-2 text-neutral-500">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-4 py-2 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}