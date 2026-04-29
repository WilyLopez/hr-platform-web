'use client';

import Link from 'next/link';

export default function TerminosPage() {
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

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>

        <div className="prose prose-lg text-gray-600 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de Términos</h2>
            <p>
              Al acceder y utilizar SisRRHH, aceptas estar vinculado por estos Términos y Condiciones. Si no estás de acuerdo 
              con cualquier parte de estos términos, no puedes utilizar nuestro servicio.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
            <p>
              SisRRHH es una plataforma SaaS que proporciona soluciones integradas de gestión de recursos humanos, incluyendo 
              seguimiento de asistencia, gestión de vacaciones y permisos, y administración de nómina.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Licencia y Restricciones</h2>
            <p>
              Te otorgamos una licencia limitada, no exclusiva e intransferible para utilizar SisRRHH según los términos de 
              tu plan. No puedes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Reproducir o copiar el software sin permiso</li>
              <li>Vender, alquilar o transferir tu acceso</li>
              <li>Acceder no autorizado a datos de otros usuarios</li>
              <li>Utilizar la plataforma con fines ilícitos</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades del Usuario</h2>
            <p>
              Eres responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Mantener la confidencialidad de tu contraseña</li>
              <li>Proporcionar información precisa y completa</li>
              <li>Cumplir con todas las leyes aplicables</li>
              <li>No interferir con la operación del servicio</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pagos y Facturación</h2>
            <p>
              Los pagos son facturados mensualmente según tu plan elegido. El servicio se suspenderá si el pago no se recibe 
              dentro de 7 días después de la fecha de vencimiento.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancelación</h2>
            <p>
              Puedes cancelar tu suscripción en cualquier momento. La cancelación entrará en vigor al final de tu ciclo de 
              facturación actual. No se reembolsarán pagos ya realizados.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, SisRRHH no será responsable por daños indirectos, incidentales o 
              consecuentes. Nuestra responsabilidad total no excederá el monto pagado por ti en los últimos 12 meses.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Garantía</h2>
            <p>
              Proporcionamos el servicio "tal cual" sin garantías de ningún tipo. No garantizamos disponibilidad ininterrumpida 
              ni ausencia de errores.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cambios en los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos. Te notificaremos sobre cambios significativos por correo 
              electrónico. El uso continuado del servicio después de cambios constituye aceptación.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será resuelta en los tribunales 
              competentes de Lima, Perú.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contacto</h2>
            <p>
              Para preguntas sobre estos Términos y Condiciones, contáctanos en:
            </p>
            <p className="mt-4">
              <a href="mailto:legal@sisrrhh.pe" className="text-blue-600 hover:text-blue-700">
                legal@sisrrhh.pe
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <p className="text-gray-700">
            <span className="font-bold">Última actualización:</span> Abril 2026
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2026 SisRRHH. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
