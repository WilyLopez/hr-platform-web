"use client";

import Link from "next/link";

export default function PrivacidadPage() {
    return (
        <div className="w-full bg-white">
            {/* Header */}
            <header className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-blue-500 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    ⌂
                                </span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                NexusRH
                            </span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Volver
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Política de Privacidad
                </h1>

                <div className="prose prose-lg text-gray-600 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            1. Introducción
                        </h2>
                        <p>
                            En NexusRH, nos comprometemos a proteger tu
                            privacidad. Esta Política de Privacidad explica cómo
                            recopilamos, utilizamos, divulgamos y salvaguardamos
                            tu información.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            2. Información que Recopilamos
                        </h2>
                        <p>
                            Recopilamos información que proporcionas
                            directamente, como:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-4">
                            <li>Nombre, correo electrónico y teléfono</li>
                            <li>Información de la empresa y empleados</li>
                            <li>Datos de asistencia, vacaciones y permisos</li>
                            <li>Ubicación GPS (con consentimiento)</li>
                            <li>Información de pago y facturación</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            3. Uso de la Información
                        </h2>
                        <p>Utilizamos tu información para:</p>
                        <ul className="list-disc list-inside space-y-2 mt-4">
                            <li>Proveer y mejorar nuestros servicios</li>
                            <li>
                                Procesar transacciones y enviar confirmaciones
                            </li>
                            <li>
                                Enviar actualizaciones, alertas y notificaciones
                            </li>
                            <li>Cumplir con obligaciones legales</li>
                            <li>
                                Proteger contra fraude y garantizar seguridad
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            4. Seguridad de Datos
                        </h2>
                        <p>
                            Implementamos medidas de seguridad técnicas,
                            administrativas y físicas para proteger tu
                            información contra acceso no autorizado. Esto
                            incluye encriptación, autenticación de dos factores
                            y auditorías regulares.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            5. Compartir Información
                        </h2>
                        <p>
                            No vendemos tu información personal. Solo
                            compartimos información con terceros cuando:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-4">
                            <li>
                                Es necesario para prestar nuestros servicios
                            </li>
                            <li>Tienes consentimiento explícito</li>
                            <li>Es requerido por ley</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            6. Tus Derechos
                        </h2>
                        <p>
                            Tienes derecho a acceder, rectificar o eliminar tus
                            datos personales. Contáctanos en
                            <a
                                href="mailto:privacidad@NexusRH.pe"
                                className="text-blue-600 hover:text-blue-700 ml-1"
                            >
                                privacidad@NexusRH.pe
                            </a>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            7. Cambios a esta Política
                        </h2>
                        <p>
                            Podemos actualizar esta Política de Privacidad
                            ocasionalmente. Te notificaremos sobre cambios
                            significativos publicando la nueva política en
                            nuestro sitio web.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            8. Contacto
                        </h2>
                        <p>
                            Si tienes preguntas sobre esta política, contáctanos
                            en:
                        </p>
                        <p className="mt-4">
                            <a
                                href="mailto:privacidad@NexusRH.pe"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                privacidad@NexusRH.pe
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">
                        <span className="font-bold">Última actualización:</span>{" "}
                        Abril 2026
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    <p>© 2026 NexusRH. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
