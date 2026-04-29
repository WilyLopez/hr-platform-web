'use client';

import Link from 'next/link';

export default function ConfirmacionPage() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-500 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⌂</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SisRRHH</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 lg:py-0 lg:min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Progress */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  ✓
                </div>
                <p className="text-sm font-medium text-gray-900">Credenciales</p>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-2 mb-5"></div>
              <div className="text-center flex-1">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  ✓
                </div>
                <p className="text-sm font-medium text-gray-900">Datos</p>
              </div>
              <div className="flex-1 h-1 bg-blue-500 mx-2 mb-5"></div>
              <div className="text-center flex-1">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  3
                </div>
                <p className="text-sm font-medium text-gray-900">Confirmación</p>
              </div>
            </div>

            {/* Success Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <span className="text-4xl">✓</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Cuenta Creada!</h1>
            <p className="text-gray-600 mb-8">
              Tu cuenta ha sido registrada exitosamente. Verifica tu correo electrónico para confirmar tu cuenta.
            </p>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Próximos pasos:</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li>
                  <span className="font-bold">1.</span> Revisa tu correo electrónico
                </li>
                <li>
                  <span className="font-bold">2.</span> Haz clic en el enlace de confirmación
                </li>
                <li>
                  <span className="font-bold">3.</span> Accede a tu dashboard
                </li>
                <li>
                  <span className="font-bold">4.</span> Configura tu primera sede
                </li>
              </ol>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Ir al Dashboard
              </Link>
              <button
                onClick={() => window.location.href = 'mailto:soporte@sisrrhh.pe'}
                className="block w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 font-medium transition"
              >
                ¿Necesitas Ayuda?
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-4">Incluye acceso a:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl mb-1">⏰</p>
                  <p className="text-xs text-gray-600">Asistencia</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">📅</p>
                  <p className="text-xs text-gray-600">Vacaciones</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">📋</p>
                  <p className="text-xs text-gray-600">Permisos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">📊</p>
                  <p className="text-xs text-gray-600">Reportes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <p className="text-center text-gray-600 text-sm mt-8">
            ¿Preguntas? Contáctanos en{' '}
            <a href="mailto:soporte@sisrrhh.pe" className="text-blue-600 hover:text-blue-700 font-medium">
              soporte@sisrrhh.pe
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
