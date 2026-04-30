"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        empresa: "",
        telefono: "",
        mensaje: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de envío del formulario
        console.log("Formulario enviado:", formData);
        alert("¡Gracias! Nos contactaremos pronto.");
        setFormData({
            nombre: "",
            email: "",
            empresa: "",
            telefono: "",
            mensaje: "",
        });
    };

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

            {/* Hero */}
            <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Ponte en Contacto
                        </h1>
                        <p className="text-xl text-gray-600">
                            ¿Preguntas sobre NexusRH? Estamos aquí para
                            ayudarte.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Información de Contacto
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Correo Electrónico
                                    </h3>
                                    <p className="text-gray-600">
                                        <a
                                            href="mailto:ventas@NexusRH.pe"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            ventas@NexusRH.pe
                                        </a>
                                    </p>
                                    <p className="text-gray-600">
                                        <a
                                            href="mailto:soporte@NexusRH.pe"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            soporte@NexusRH.pe
                                        </a>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Teléfono
                                    </h3>
                                    <p className="text-gray-600">
                                        <a
                                            href="tel:+51123456789"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            +51 (1) 2345-6789
                                        </a>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Ubicación
                                    </h3>
                                    <p className="text-gray-600">Lima, Perú</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Horario de Atención
                                    </h3>
                                    <p className="text-gray-600">
                                        Lunes a Viernes: 9:00 AM - 6:00 PM
                                    </p>
                                    <p className="text-gray-600">
                                        Sábado: 9:00 AM - 1:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <form
                                onSubmit={handleSubmit}
                                className="bg-gray-50 rounded-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Envíanos un Mensaje
                                </h2>

                                <div className="mb-6">
                                    <label
                                        htmlFor="nombre"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="empresa"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        name="empresa"
                                        value={formData.empresa}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nombre de tu empresa"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="telefono"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+51 1234567890"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="mensaje"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Cuéntanos cómo podemos ayudarte..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    <p>© 2026 NexusRH. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
