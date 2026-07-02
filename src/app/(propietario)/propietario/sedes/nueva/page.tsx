"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { empresaService } from "@/services/empresa.service";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button } from "@/components/ui";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import Link from "next/link";
import type { CrearSedeInput } from "@/types/empresa.types";

export default function NuevaSedePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CrearSedeInput>({
    nombre: "",
    direccion: "",
    latitud: -12.046374, // Valor por defecto
    longitud: -77.042793, // Valor por defecto
    radio_metros: 100, // Valor por defecto
  });

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
      await empresaService.crearSede(usuario.empresa_id, formData);
      toast.success("Sede registrada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
      router.push("/propietario/sedes");
    } catch (error: any) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : "Error al registrar la sede.";
      toast.error(`Error: ${errorMsg}`);
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Registrar Sede"
        description="Añade una nueva ubicación física para tu empresa"
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
                Guardar Sede
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
