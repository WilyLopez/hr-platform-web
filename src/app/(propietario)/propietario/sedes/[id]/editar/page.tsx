"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { empresaService } from "@/services/empresa.service";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button } from "@/components/ui";
import { ArrowLeft, Save, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import type { CrearSedeInput } from "@/types/empresa.types";

export default function EditarSedePage() {
  const router = useRouter();
  const params = useParams();
  const sedeId = parseInt(params.id as string, 10);
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<CrearSedeInput>({
    nombre: "",
    direccion: "",
    latitud: -12.046374,
    longitud: -77.042793,
    radio_metros: 100,
  });

  useEffect(() => {
    const fetchSede = async () => {
      if (!usuario?.empresa_id) return;
      
      try {
        setInitialLoading(true);
        // Listar sedes y buscar la que corresponde a sedeId
        const sedes = await empresaService.listarSedes(usuario.empresa_id);
        const sedeActual = sedes.find((s) => s.id === sedeId);
        
        if (sedeActual) {
          setFormData({
            nombre: sedeActual.nombre,
            direccion: sedeActual.direccion,
            latitud: sedeActual.latitud,
            longitud: sedeActual.longitud,
            radio_metros: sedeActual.radio_metros,
          });
        } else {
          toast.error("No se encontró la sede especificada.");
          router.push("/propietario/sedes");
        }
      } catch (error) {
        toast.error("Error al cargar la información de la sede.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSede();
  }, [usuario?.empresa_id, sedeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.empresa_id) {
      toast.error("Error de sesión: no se encontró la empresa.");
      return;
    }

    if (!formData.nombre.trim() || !formData.direccion.trim()) {
      toast.error("Por favor completa los campos requeridos.");
      return;
    }

    setLoading(true);
    try {
      await empresaService.actualizarSede(usuario.empresa_id, sedeId, formData);
      toast.success("Sede actualizada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
      router.push("/propietario/sedes");
    } catch (error: any) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : "Error al actualizar la sede.";
      toast.error(`Error: ${errorMsg}`);
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Editar Sede"
        description="Modifica los detalles de la sede seleccionada"
        action={
          <Link href="/propietario/sedes">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Volver
            </Button>
          </Link>
        }
      />

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="form-label">
                  Nombre de la Sede <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    id="nombre"
                    type="text"
                    required
                    placeholder="Ej: Sede Central, Oficina Sur"
                    className="form-input pl-9"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="direccion" className="form-label">
                  Dirección <span className="text-danger">*</span>
                </label>
                <input
                  id="direccion"
                  type="text"
                  required
                  placeholder="Ej: Av. Arequipa 1234, Lima"
                  className="form-input"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="radio_metros" className="form-label">
                    Radio de cobertura (metros)
                  </label>
                  <input
                    id="radio_metros"
                    type="number"
                    min="10"
                    className="form-input"
                    value={formData.radio_metros}
                    onChange={(e) => setFormData({ ...formData, radio_metros: parseInt(e.target.value) || 100 })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Útil para el marcado de asistencia por geolocalización.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Link href="/propietario/sedes">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" variant="primary" loading={loading} leftIcon={<Save size={16} />}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
