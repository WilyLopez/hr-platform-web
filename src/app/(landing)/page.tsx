'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⌂</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SisRRHH</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#beneficios" className="text-gray-600 hover:text-gray-900">Beneficios</a>
              <a href="#modulos" className="text-gray-600 hover:text-gray-900">Módulos</a>
              <a href="#planes" className="text-gray-600 hover:text-gray-900">Planes</a>
              <a href="/contacto" className="text-gray-600 hover:text-gray-900">Contacto</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/registro" className="text-blue-600 hover:text-blue-700 font-medium">
                Iniciar Sesión
              </Link>
              <Link href="/registro" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                Empieza Ahora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-blue-50 px-4 py-2 rounded-full mb-6">
              <span className="text-blue-600 text-sm font-medium">⭐ Plataforma SaaS #1 en Perú</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Gestiona tu equipo con <span className="text-blue-600">tecnología enterprise</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Automatiza asistencia, vacaciones, permisos y nómina. La plataforma de RRHH que empresas peruanas necesitan para escalar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/registro" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-center">
                Empieza Gratis →
              </Link>
              <Link href="#planes" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-medium text-center">
                Ver Planes
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <p className="text-gray-600 text-sm">Empresas</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <p className="text-gray-600 text-sm">Empleados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <p className="text-gray-600 text-sm">Uptime</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-gray-200 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Dashboard RRHH <span className="text-green-500 text-sm font-medium">En Vivo</span></h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="text-4xl font-bold mb-2">1,247</div>
                  <p className="text-blue-100">Empleados Activos</p>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
                  <div className="text-4xl font-bold mb-2">98.5%</div>
                  <p className="text-teal-100">Asistencia Hoy</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-sm font-bold">M</div>
                    <div>
                      <p className="text-gray-900 font-medium">Maria Garcia</p>
                      <p className="text-gray-500 text-sm">Marcación: 08:45 AM</p>
                    </div>
                  </div>
                  <span className="text-green-500 text-sm">A Tiempo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-sm font-bold">C</div>
                    <div>
                      <p className="text-gray-900 font-medium">Carlos Ruiz</p>
                      <p className="text-gray-500 text-sm">Solicitud: Vacaciones</p>
                    </div>
                  </div>
                  <span className="text-yellow-500 text-sm">Pendiente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section id="beneficios" className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué SisRRHH?</h2>
            <p className="text-lg text-gray-600">Ahorra tiempo, reduce errores y mejora la experiencia de tu equipo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-blue-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-6">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ahorra hasta 40 horas/mes</h3>
              <p className="text-gray-600">Automatiza reportes, aprobaciones y cálculos de nómina</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-teal-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-6">
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cumplimiento garantizado</h3>
              <p className="text-gray-600">Actualizado con la legislación laboral peruana vigente</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-orange-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-6">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Experiencia mejorada</h3>
              <p className="text-gray-600">Portal de empleados intuitivo y accesible desde móvil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos Section */}
      <section id="modulos" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">Suite Completa</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-lg text-gray-600">Módulos integrados para una gestión 360° del talento</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Asistencia */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-blue-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">⏰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Asistencia</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Marcación GPS</li>
                <li>✓ QR por sede</li>
                <li>✓ Reportes en tiempo real</li>
              </ul>
            </div>

            {/* Vacaciones */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-teal-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Vacaciones</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Solicitudes digitales</li>
                <li>✓ Aprobación automática</li>
                <li>✓ Calendario integrado</li>
              </ul>
            </div>

            {/* Permisos */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-blue-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Permisos</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Múltiples tipos</li>
                <li>✓ Workflow aprobación</li>
                <li>✓ Historial completo</li>
              </ul>
            </div>

            {/* Geolocalización */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-teal-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">📍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Geolocalización</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Geovalas por sede</li>
                <li>✓ Validación GPS</li>
                <li>✓ Alertas tiempo real</li>
              </ul>
            </div>

            {/* Notificaciones */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-blue-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">🔔</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Notificaciones</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Push real-time</li>
                <li>✓ Email/SMS</li>
                <li>✓ Centro de alertas</li>
              </ul>
            </div>

            {/* Reportes */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-teal-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Reportes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Dashboards ejecutivos</li>
                <li>✓ Exportación PDF/Excel</li>
                <li>✓ Analytics avanzado</li>
              </ul>
            </div>

            {/* Gestión Empleados */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-blue-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Gestión Empleados</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Perfiles completos</li>
                <li>✓ Documentos digitales</li>
                <li>✓ Organigramas</li>
              </ul>
            </div>

            {/* Auditoría */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="bg-teal-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Auditoría</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Logs detallados</li>
                <li>✓ Trazabilidad total</li>
                <li>✓ Cumplimiento</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section id="planes" className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">Planes Flexibles</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Elige el plan perfecto para tu empresa</h2>
            <p className="text-lg text-gray-600">Sin contratos anuales. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Ideal para pequeñas empresas</p>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                S/ 299<span className="text-lg text-gray-600">/mes</span>
              </div>
              <Link href="/registro" className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-center mb-8">
                Comenzar Ahora
              </Link>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Hasta 50 empleados</li>
                <li>✓ Módulo de asistencia</li>
                <li>✓ Solicitud de vacaciones</li>
                <li>✓ Reportes básicos</li>
                <li>✓ Soporte por email</li>
                <li>✓ 1 administrador</li>
              </ul>
            </div>

            {/* Professional - Featured */}
            <div className="bg-blue-600 text-white rounded-lg p-8 relative transform scale-105">
              <div className="absolute top-4 right-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                Más Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-blue-100 mb-6">Para empresas en crecimiento</p>
              <div className="text-4xl font-bold mb-2">
                S/ 599<span className="text-lg text-blue-100">/mes</span>
              </div>
              <Link href="/registro" className="block w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-medium text-center mb-8">
                Comenzar Ahora
              </Link>
              <ul className="space-y-3">
                <li>✓ Hasta 200 empleados</li>
                <li>✓ Todos los módulos</li>
                <li>✓ Geolocalización GPS</li>
                <li>✓ Reportes avanzados</li>
                <li>✓ Soporte prioritario</li>
                <li>✓ 5 administradores</li>
                <li>✓ API acceso</li>
                <li>✓ Auditoría completa</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Solución personalizada</p>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                Contactar
              </div>
              <Link href="/contacto" className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-center mb-8">
                Contactar Ventas
              </Link>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Empleados ilimitados</li>
                <li>✓ Todas las funciones</li>
                <li>✓ Personalización total</li>
                <li>✓ Integraciones custom</li>
                <li>✓ Gerente de cuenta</li>
                <li>✓ SLA garantizado</li>
                <li>✓ Capacitación incluida</li>
                <li>✓ Implementación dedicada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para transformar tu gestión de RRHH?</h2>
          <p className="text-xl text-gray-300 mb-8">Únete a 500+ empresas que ya confían en SisRRHH</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Comenzar Prueba Gratuita
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 font-medium transition">
              Agendar Demo
            </button>
          </div>
        </div>
      </section>

      {/* Portales Demo Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explora los Portales Demo</h2>
            <p className="text-lg text-gray-600">Prueba cada rol del sistema</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SuperAdmin */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center hover:shadow-lg transition">
              <div className="bg-purple-600 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">SuperAdmin</h3>
              <p className="text-gray-600 mb-6">Gestión global del sistema</p>
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver Demo →
              </Link>
            </div>

            {/* Propietario */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center hover:shadow-lg transition">
              <div className="bg-blue-600 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Propietario</h3>
              <p className="text-gray-600 mb-6">Panel del dueño de empresa</p>
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver Demo →
              </Link>
            </div>

            {/* Admin RRHH */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center hover:shadow-lg transition">
              <div className="bg-teal-500 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin RRHH</h3>
              <p className="text-gray-600 mb-6">Gestión operativa diaria</p>
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver Demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-500 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold">⌂</span>
                </div>
                <span className="text-xl font-bold">SisRRHH</span>
              </div>
              <p className="text-gray-400 text-sm">La plataforma SaaS de gestión de RRHH más completa de Perú</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white">Características</Link></li>
                <li><Link href="#planes" className="hover:text-white">Planes</Link></li>
                <li><Link href="#" className="hover:text-white">Seguridad</Link></li>
                <li><Link href="#" className="hover:text-white">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/sobre-nosotros" className="hover:text-white">Sobre Nosotros</Link></li>
                <li><Link href="#" className="hover:text-white">Casos de Éxito</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-white">Términos</Link></li>
                <li><Link href="#" className="hover:text-white">SLA</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 SisRRHH. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
