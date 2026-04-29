'use client';

import Link from 'next/link';

export default function PlanesPage() {
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-500 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⌂</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SisRRHH</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Volver
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">Planes Flexibles</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Elige el Plan Perfecto</h1>
            <p className="text-xl text-gray-600">Sin contratos anuales. Cancela cuando quieras. Prueba gratuita de 14 días.</p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600">Ideal para pequeñas empresas</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  S/ 299<span className="text-xl text-gray-600">/mes</span>
                </div>
                <p className="text-sm text-gray-600">Facturado mensualmente</p>
              </div>

              <Link href="/registro" className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-center mb-8">
                Comenzar Prueba Gratuita
              </Link>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Hasta 50 empleados</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Módulo de asistencia</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Solicitud de vacaciones</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Reportes básicos</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Soporte por email</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">1 administrador</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  <span className="text-gray-500">Geolocalización GPS</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  <span className="text-gray-500">Reportes avanzados</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  <span className="text-gray-500">API acceso</span>
                </div>
              </div>
            </div>

            {/* Professional - Featured */}
            <div className="bg-blue-600 text-white rounded-lg p-8 relative transform scale-105 hover:shadow-xl transition">
              <div className="absolute top-4 right-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                Más Popular
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-blue-100">Para empresas en crecimiento</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">
                  S/ 599<span className="text-xl text-blue-100">/mes</span>
                </div>
                <p className="text-sm text-blue-100">Facturado mensualmente</p>
              </div>

              <Link href="/registro" className="block w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-medium text-center mb-8">
                Comenzar Prueba Gratuita
              </Link>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Hasta 200 empleados</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Todos los módulos</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Geolocalización GPS</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Reportes avanzados</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Soporte prioritario</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>5 administradores</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>API acceso</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Auditoría completa</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  <span>Notificaciones push</span>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600">Solución personalizada</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  Contactar
                </div>
                <p className="text-sm text-gray-600">Precio personalizado</p>
              </div>

              <Link href="/contacto" className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-center mb-8">
                Contactar Ventas
              </Link>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Empleados ilimitados</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Todas las funciones</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Personalización total</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Integraciones custom</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Gerente de cuenta</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">SLA garantizado</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Capacitación incluida</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Implementación dedicada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">Todo lo que necesitas saber sobre nuestros planes</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Puedo cambiar de plan en cualquier momento?</h3>
              <p className="text-gray-600">Sí, puedes cambiar de plan en cualquier momento. Los cambios se aplican inmediatamente y se prorratea el pago.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Qué incluye la prueba gratuita?</h3>
              <p className="text-gray-600">La prueba gratuita incluye acceso completo a todas las funciones del plan Professional por 14 días, sin necesidad de tarjeta de crédito.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funciona la facturación?</h3>
              <p className="text-gray-600">Facturamos mensualmente por adelantado. Puedes pagar con tarjeta de crédito, débito o transferencia bancaria.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Qué pasa si excedo el límite de empleados?</h3>
              <p className="text-gray-600">Te notificaremos cuando te acerques al límite. Puedes actualizar tu plan en cualquier momento para agregar más empleados.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Ofrecen descuentos para empresas grandes?</h3>
              <p className="text-gray-600">Sí, para empresas con más de 500 empleados ofrecemos precios especiales. Contáctanos para una cotización personalizada.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Los precios incluyen IGV?</h3>
              <p className="text-gray-600">Los precios mostrados no incluyen IGV (18%). El impuesto se calcula automáticamente al momento del pago.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-gray-300 mb-8">Únete a 500+ empresas que ya confían en SisRRHH</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Comenzar Prueba Gratuita
            </Link>
            <Link href="/contacto" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 font-medium transition">
              Hablar con Ventas
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2026 SisRRHH. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
