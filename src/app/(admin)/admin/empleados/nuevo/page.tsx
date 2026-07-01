'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Modal } from "@/components/ui";
import { empleadoService } from "@/services/empleado.service";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import type { TipoDocumento, RegistrarEmpleadoInput } from "@/types/empleado.types";
import { apiClient } from "@/lib/axios";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Briefcase, 
  CreditCard, 
  MapPin, 
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react";
import Link from 'next/link';
import { StepIndicator } from "@/components/forms/StepIndicator";

export default function NuevoEmpleadoPage() {
  const router = useRouter();
  const toast = useToast();
  const { usuario } = useAuth();
  const empresaId = usuario?.empresa_id;
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Estados individuales para cada campo del formulario
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('DNI');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [cargo, setCargo] = useState('');
  const [area, setArea] = useState('');
  const [sedeId, setSedeId] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);

  // Estados para hacer el select de sedes dinámico
  const [sedesDisponibles, setSedesDisponibles] = useState<{id: number, nombre: string}[]>([]);
  const [cargandoSedes, setCargandoSedes] = useState(true);

  // Estados para modal de nueva sede
  const [showSedeModal, setShowSedeModal] = useState(false);
  const [creandoSede, setCreandoSede] = useState(false);
  const [nuevaSede, setNuevaSede] = useState({ nombre: '', direccion: '' });

  // Cargar sedes al montar el componente
  useEffect(() => {
    const cargarSedes = async () => {
      if (!empresaId) return;
      try {
        const res = await apiClient.get(`empresas/${empresaId}/sedes/`); 
        const lista = res.data.results || res.data;
        setSedesDisponibles(lista);
      } catch (error) {
        // Usamos console.log temporalmente para no saturar con Toasts si algo falla
        console.error("Error cargando sedes:", error);
      } finally {
        setCargandoSedes(false);
      }
    };
    cargarSedes();
  }, [empresaId]);

  const handleCrearSede = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaSede.nombre || !nuevaSede.direccion) return;
    setCreandoSede(true);
    try {
      const payload = {
        nombre: nuevaSede.nombre,
        direccion: nuevaSede.direccion,
        latitud: -12.046374, // default
        longitud: -77.042793, // default
        radio_metros: 100
      };
      
      if (!empresaId) {
        toast.error("No se pudo identificar tu empresa.");
        setCreandoSede(false);
        return;
      }
      
      const res = await apiClient.post(`empresas/${empresaId}/sedes/`, payload);
      setSedesDisponibles([...sedesDisponibles, res.data]);
      setSedeId(res.data.id.toString());
      setShowSedeModal(false);
      setNuevaSede({ nombre: '', direccion: '' });
      toast.success("Sede creada exitosamente");
    } catch (error: any) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : "Error al crear la sede";
      toast.error(`Error: ${errorMsg}`);
      console.error(error.response?.data || error);
    } finally {
      setCreandoSede(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas antes del envío
    if (!numeroDocumento.trim() || !correo.trim() || !sedeId) {
      toast.error("Por favor, completa los campos obligatorios.");
      return;
    }

    setLoading(true);

    const payload: RegistrarEmpleadoInput = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento.trim(),
      correo: correo.trim(),
      cargo: cargo.trim(),
      area: area.trim(),
      sede_id: Number(sedeId), 
      fecha_ingreso: fechaIngreso
    };

    try {
      await empleadoService.registrar(payload);
      toast.success("Empleado registrado exitosamente.");
      
      // Retornar a la lista principal y refrescar los datos
      router.push('/admin/empleados');
      router.refresh();
    } catch (error) {
      toast.error("Hubo un error al registrar al empleado. Verifica que el correo o documento no estén duplicados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Registrar Nuevo Empleado"
        description="Ingresa la información básica y laboral del nuevo colaborador"
        action={
          <Link href="/admin/empleados">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Volver al listado
            </Button>
          </Link>
        }
      />

      <Card>
        <CardBody>
          <div className="mb-8 flex justify-center">
            <StepIndicator
              steps={[{ label: "Personal" }, { label: "Laboral" }]}
              current={currentStep}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Sección: Información Personal */}
            <div className={currentStep === 0 ? "block" : "hidden"}>
              <h3 className="text-sm font-bold text-neutral-800 mb-4 border-b pb-2">
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <div>
                  <label htmlFor="nombres" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nombres
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      id="nombres"
                      type="text"
                      required
                      placeholder="Ej: Juan Carlos"
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                    />
                  </div>
                </div>

                {/* Apellidos */}
                <div>
                  <label htmlFor="apellidos" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Apellidos
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      id="apellidos"
                      type="text"
                      required
                      placeholder="Ej: Pérez Quispe"
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label htmlFor="tipo_documento" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    id="tipo_documento"
                    className="w-full px-3 py-2 border rounded-lg text-sm text-neutral-800 outline-none bg-white focus:ring-2 focus:ring-brand"
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
                  >
                    <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                    <option value="CE">CE (Carnet de Extranjería)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="RUC">RUC</option>
                  </select>
                </div>

                {/* Número de Documento */}
                <div>
                  <label htmlFor="numero_documento" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Número de Documento
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      id="numero_documento"
                      type="text"
                      required
                      placeholder={tipoDocumento === 'DNI' ? '8 dígitos' : 'Ingresa el número'}
                      maxLength={tipoDocumento === 'DNI' ? 8 : tipoDocumento === 'RUC' ? 11 : 20}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value.replace(/\s/g, ''))} // Elimina espacios
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Información Laboral y de Contacto */}
            <div className={currentStep === 1 ? "block animate-fade-in" : "hidden"}>
              <h3 className="text-sm font-bold text-neutral-800 mb-4 border-b pb-2 pt-2">
                Información Laboral y de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Correo Electrónico */}
                <div className="md:col-span-2">
                  <label htmlFor="correo" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      id="correo"
                      type="email"
                      required
                      placeholder="ejemplo@empresa.com"
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Área */}
                <div>
                  <label htmlFor="area" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Área / Departamento
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      id="area"
                      type="text"
                      required
                      placeholder="Ej: Sistemas, Contabilidad, RRHH"
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </div>

                {/* Cargo */}
                <div>
                  <label htmlFor="cargo" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Cargo / Puesto
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      id="cargo"
                      type="text"
                      required
                      placeholder="Ej: Desarrollador Full-Stack, Analista"
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Sede */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="sede_id" className="block text-xs font-semibold text-neutral-700">
                      Sede Asignada
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowSedeModal(true)}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} />
                      Nueva Sede
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <select
                      id="sede_id"
                      required
                      disabled={cargandoSedes}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none bg-white focus:ring-2 focus:ring-brand disabled:opacity-50"
                      value={sedeId}
                      onChange={(e) => setSedeId(e.target.value)}
                    >
                      <option value="">
                        {cargandoSedes ? "Cargando sedes..." : "Selecciona una sede..."}
                      </option>
                      
                      {sedesDisponibles.map((sede) => (
                        <option key={sede.id} value={sede.id}>
                          {sede.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fecha de Ingreso */}
                <div>
                  <label htmlFor="fecha_ingreso" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Fecha de Ingreso
                  </label>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-brand">
                    <Calendar size={16} className="text-neutral-400" />
                    <input
                      id="fecha_ingreso"
                      type="date"
                      required
                      className="w-full outline-none text-sm text-neutral-800"
                      value={fechaIngreso}
                      onChange={(e) => setFechaIngreso(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-between gap-3 pt-6 border-t border-border mt-6">
              {currentStep === 0 ? (
                <>
                  <Link href="/admin/empleados">
                    <Button type="button" variant="outline" disabled={loading}>
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={() => {
                      if (!nombres || !apellidos || !numeroDocumento) {
                        toast.error("Completa los datos personales básicos primero.");
                        return;
                      }
                      setCurrentStep(1);
                    }}
                    rightIcon={<ChevronRight size={16} />}
                  >
                    Siguiente Paso
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(0)} 
                    disabled={loading}
                    leftIcon={<ArrowLeft size={16} />}
                  >
                    Atrás
                  </Button>
                  <Button type="submit" variant="primary" loading={loading} leftIcon={<Save size={16} />}>
                    Registrar Colaborador
                  </Button>
                </>
              )}
            </div>

          </form>
        </CardBody>
      </Card>

      {/* Modal para crear Sede rápida */}
      <Modal 
        open={showSedeModal} 
        onClose={() => setShowSedeModal(false)}
        title="Añadir Nueva Sede"
      >
        <form onSubmit={handleCrearSede} className="space-y-4 pt-4">
          <div>
            <label className="form-label">Nombre de la Sede</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="Ej: Sede Central" 
              value={nuevaSede.nombre}
              onChange={e => setNuevaSede({...nuevaSede, nombre: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label">Dirección</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="Ej: Av. Principal 123" 
              value={nuevaSede.direccion}
              onChange={e => setNuevaSede({...nuevaSede, direccion: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowSedeModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={creandoSede}>
              Guardar Sede
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}