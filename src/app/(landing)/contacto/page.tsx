"use client";

import Link from "next/link";
import { useState } from "react";
import { contactoService } from "@/services/contacto.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactoService, type ContactoInput } from "@/services/contacto.service";
import { useToast } from "@/hooks/useToast";

const contactoSchema = z.object({
  nombre: z.string().min(3, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        setError("");
        setSuccess(false);
        
        try {
            await contactoService.enviarContacto(formData);
            setSuccess(true);
            setFormData({
                nombre: "",
                email: "",
                empresa: "",
                telefono: "",
                mensaje: "",
            });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError("Error al enviar el mensaje. Intenta de nuevo.");
            console.error("Error:", err);
        } finally {
            setEnviando(false);
        }
    };
type ContactoFormData = z.infer<typeof contactoSchema>;

const CONTACT_INFO = {
  emails: [
    { label: "Ventas", email: "ventas@NexusRH.pe" },
    { label: "Soporte", email: "soporte@NexusRH.pe" },
  ],
  phone: "+51 999999999",
  location: "Lima, Perú",
  hours: {
    weekday: "Lunes a Viernes: 9:00 AM - 6:00 PM",
    saturday: "Sábado: 9:00 AM - 1:00 PM",
  },
};

export default function ContactoPage() {
  const toast = useToast();
  const [enviando, setEnviando] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
  });

  const onSubmit = async (data: ContactoFormData) => {
    setEnviando(true);
    try {
      const contactoData: ContactoInput = {
        nombre: data.nombre,
        email: data.email,
        empresa: data.empresa || "",
        telefono: data.telefono || "",
        mensaje: data.mensaje,
      };
      
      await contactoService.enviarContacto(contactoData);
      toast.success("¡Mensaje enviado exitosamente! Nos contactaremos pronto.");
      reset();
    } catch (error) {
      console.error("Error al enviar contacto:", error);
      toast.error("No se pudo enviar el mensaje. Intenta más tarde.");
    } finally {
      setEnviando(false);
    }
  };

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
              <span className="text-xl font-bold text-gray-900">NexusRH</span>
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
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ponte en Contacto
            </h1>
            <p className="text-xl text-gray-600">
              ¿Preguntas sobre NexusRH? Estamos aquí para ayudarte.
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
                  {CONTACT_INFO.emails.map((item) => (
                    <p key={item.email} className="text-gray-600 mb-2">
                      <span className="font-semibold text-gray-700">{item.label}:</span>
                      {" "}
                      <a href={`mailto:${item.email}`} className="text-blue-600 hover:text-blue-700">
                        {item.email}
                      </a>
                    </p>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Teléfono</h3>
                  <p className="text-gray-600">
                    <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-blue-600 hover:text-blue-700">
                      {CONTACT_INFO.phone}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ubicación</h3>
                  <p className="text-gray-600">{CONTACT_INFO.location}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Horario de Atención</h3>
                  <p className="text-gray-600">{CONTACT_INFO.hours.weekday}</p>
                  <p className="text-gray-600">{CONTACT_INFO.hours.saturday}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>

                <div className="mb-6">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Tu nombre"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("nombre")}
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
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
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                        ¡Gracias! Tu mensaje fue enviado exitosamente. Nos contactaremos pronto.
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                >
                                    {enviando ? "Enviando..." : "Enviar Mensaje"}
                                </button>
                            </form>
                        </div>
                    </div>
                <div className="mb-6">
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre de tu empresa"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("empresa")}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    placeholder="+51 1234567890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("telefono")}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mensaje ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("mensaje")}
                  />
                  {errors.mensaje && (
                    <p className="text-red-500 text-sm mt-1">{errors.mensaje.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? "Enviando..." : "Enviar Mensaje"}
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