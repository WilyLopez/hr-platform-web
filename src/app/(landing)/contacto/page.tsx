"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactoService } from "@/services/contacto.service";
import { useToast } from "@/hooks/useToast";
import { Mail, Phone, MapPin, Clock, Loader2, AlertCircle } from "lucide-react";

const contactoSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico no válido"),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactoFormData = z.infer<typeof contactoSchema>;

const CONTACT_INFO = {
  emails: [
    { label: "Ventas", email: "ventas@nexusrh.pe" },
    { label: "Soporte", email: "soporte@nexusrh.pe" },
  ],
  phone: "+51 999 999 999",
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
    formState: { errors, touchedFields },
    reset,
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ContactoFormData) => {
    setEnviando(true);
    try {
      await contactoService.enviarContacto({
        ...data,
        empresa: data.empresa ?? "",
        telefono: data.telefono ?? "",
      });
      toast.success("Mensaje enviado correctamente.");
      reset();
    } catch {
      toast.error("Error al enviar el mensaje. Intente más tarde.");
    } finally {
      setEnviando(false);
    }
  };

  const inputClasses = (hasError: boolean | undefined) => 
    `w-full px-4 py-3 rounded-lg border bg-white text-slate-900 transition-all outline-none focus:ring-2 ${
      hasError 
        ? "border-red-300 focus:ring-red-200" 
        : "border-slate-200 focus:ring-slate-200 focus:border-slate-400"
    }`;

  return (
    <div className="w-full bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Ponte en contacto</h1>
          <p className="text-lg text-slate-600">Estamos aquí para resolver tus dudas sobre NexusRH.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Información</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, title: "Correo", content: CONTACT_INFO.emails },
                  { icon: Phone, title: "Teléfono", content: CONTACT_INFO.phone },
                  { icon: MapPin, title: "Ubicación", content: CONTACT_INFO.location },
                  { icon: Clock, title: "Horario", content: [CONTACT_INFO.hours.weekday, CONTACT_INFO.hours.saturday] },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <item.icon className="w-6 h-6 text-slate-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-slate-900">{item.title}</h3>
                      {typeof item.content === 'string' ? (
                        <p className="text-slate-600">{item.content}</p>
                      ) : Array.isArray(item.content) ? (
                        item.content.map((c: any, i: number) => (
                          <p key={i} className="text-slate-600">{c.email ? `${c.label}: ${c.email}` : c}</p>
                        ))
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Envía un mensaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input {...register("nombre")} className={inputClasses(!!errors.nombre)} />
                {errors.nombre && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.nombre.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                <input {...register("email")} className={inputClasses(!!errors.email)} />
                {errors.email && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                <textarea {...register("mensaje")} rows={4} className={inputClasses(!!errors.mensaje)} />
                {errors.mensaje && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.mensaje.message}</p>}
              </div>
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {enviando && <Loader2 className="w-5 h-5 animate-spin" />}
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}