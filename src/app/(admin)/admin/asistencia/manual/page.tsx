'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button } from "@/components/ui";
import { asistenciaService } from "@/services/asistencia.service";
import { empleadoService } from "@/services/empleado.service";
import { useToast } from "@/hooks/useToast";
import type { TipoMarcaje, RegistrarManualInput } from "@/types/asistencia.types";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Clock, 
  Calendar as CalendarIcon, 
  FileText 
} from "lucide-react";
import Link from 'next/link';

export default function RegistroManualPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<{id: number, nombres: string, apellidos: string}[]>([]);
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const data = await empleadoService.listar({ page_size: 100 });
        setEmpleados(data.results);
      } catch (error) {
        toast.error("Error al cargar la lista de empleados.");
      }
    };
    cargarEmpleados();
  }, []);

  // Valores iniciales por defecto (Fecha y Hora actuales)
  const ahora = new Date();
  const fechaHoy = ahora.toISOString().split('T')[0];
  const horaActual = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  // Estado del formulario
  const [empleadoId, setEmpleadoId] = useState('');
  const [tipo, setTipo] = useState<TipoMarcaje>('ENTRADA');
  const [fecha, setFecha] = useState(fechaHoy);
  const [hora, setHora] = useState(horaActual);
  const [justificacion, setJustificacion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empleadoId) {
      toast.error("El ID del empleado es obligatorio.");
      return;
    }

    if (!justificacion.trim() || justificacion.length < 10) {
      toast.error("Por favor, ingresa una justificación detallada (mínimo 10 caracteres).");
      return;
    }

    setLoading(true);

    // Estructuramos la data según la interfaz RegistrarManualInput
    const payload: RegistrarManualInput = {
      empleado_id: Number(empleadoId),
      tipo,
      fecha,
      hora: hora.length === 5 ? `${hora}:00` : hora, // Asegura formato HH:MM:SS si es necesario
      justificacion: justificacion.trim()
    };

    try {
      await asistenciaService.registrarManual(payload);
      toast.success("Marcaje manual registrado correctamente.");
      
      // Redirigimos al panel principal de asistencia tras un registro exitoso
      router.push('/admin/asistencia');
      router.refresh();
    } catch (error) {
      toast.error("No se pudo registrar la asistencia. Verifica el ID del empleado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Registro Manual de Asistencia"
        description="Ingresa un marcaje extraordinario para un empleado"
        action={
          <Link href="/admin/asistencia">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Volver
            </Button>
          </Link>
        }
      />

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Buscador de Empleado */}
            <div>
              <label htmlFor="buscar_empleado" className="block text-sm font-medium text-neutral-700 mb-1">
                Empleado
              </label>
              
              <div className="space-y-2">
                <input
                  id="buscar_empleado"
                  type="text"
                  placeholder="Escribe para filtrar empleados..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none text-neutral-800 bg-neutral-50 mb-2"
                  value={busquedaEmpleado}
                  onChange={(e) => setBusquedaEmpleado(e.target.value)}
                />
                
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <select
                    id="empleado_id"
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none text-neutral-800 bg-white"
                    value={empleadoId}
                    onChange={(e) => setEmpleadoId(e.target.value)}
                  >
                    <option value="" disabled>Seleccione un empleado...</option>
                    {empleados
                      .filter(emp => `${emp.nombres} ${emp.apellidos}`.toLowerCase().includes(busquedaEmpleado.toLowerCase()))
                      .map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.nombres} {emp.apellidos}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fila Tipo y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Marcaje */}
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-neutral-700 mb-1">
                  Tipo de Marcaje
                </label>
                <select
                  id="tipo"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white text-neutral-800"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoMarcaje)}
                >
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SALIDA">SALIDA</option>
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-neutral-700 mb-1">
                  Fecha del Marcaje
                </label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-brand">
                  <CalendarIcon size={18} className="text-neutral-400" />
                  <input
                    id="fecha"
                    type="date"
                    required
                    className="w-full outline-none text-sm text-neutral-800"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Hora del Marcaje */}
            <div>
              <label htmlFor="hora" className="block text-sm font-medium text-neutral-700 mb-1">
                Hora del Marcaje
              </label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-brand">
                <Clock size={18} className="text-neutral-400" />
                <input
                  id="hora"
                  type="time"
                  required
                  className="w-full outline-none text-sm text-neutral-800 font-mono"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
              </div>
            </div>

            {/* Justificación */}
            <div>
              <label htmlFor="justificacion" className="block text-sm font-medium text-neutral-700 mb-1">
                Justificación / Motivo
              </label>
              <div className="relative flex items-start">
                <FileText className="absolute left-3 top-3 text-neutral-400" size={18} />
                <textarea
                  id="justificacion"
                  required
                  rows={4}
                  placeholder="Ej: El empleado olvidó marcar al ingresar debido a una reunión urgente con gerencia..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none text-neutral-800 placeholder-neutral-400 resize-none"
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-neutral-400">
                <span>Explique brevemente por qué se realiza este registro manual.</span>
                <span>{justificacion.length} caracteres</span>
              </div>
            </div>

            {/* Acciones del formulario */}
            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
              <Link href="/admin/asistencia">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" variant="brand" loading={loading} leftIcon={<Save size={18} />}>
                Guardar Registro
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
}
