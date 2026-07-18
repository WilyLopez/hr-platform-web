"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { asistenciaService } from "@/services/asistencia.service";
import type { EstadoAsistenciaHoy } from "@/types/asistencia.types";
import { Clock, Play, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { empleadoService } from "@/services/empleado.service";
import { useAuth } from "@/hooks/useAuth";

export default function EmpleadoDashboard() {
  const [estado, setEstado] = useState<EstadoAsistenciaHoy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState<string | null>(null);

  const loadEstado = async () => {
    try {
      setIsLoading(true);
      const data = await asistenciaService.obtenerEstadoHoy();
      setEstado(data);
      
      // Fetch employee name
      if (usuario?.codigo_unico) {
        const empRes = await empleadoService.listar({ search: usuario.codigo_unico });
        if (empRes.results && empRes.results.length > 0) {
          // Tomar el primer nombre para un saludo más amigable
          const primerNombre = empRes.results[0].nombres.split(" ")[0];
          setNombre(primerNombre);
        }
      }
    } catch (error) {
      toast.error("No se pudo cargar el estado de asistencia.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEstado();
  }, []);

  const handleMarcajeWeb = async () => {
    try {
      setIsSubmitting(true);
      
      // Intentar obtener ubicación si el navegador lo soporta
      let lat: number | undefined;
      let lon: number | undefined;
      
      if ("geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch (e) {
          console.warn("Ubicación no obtenida", e);
        }
      }

      await asistenciaService.registrarMarcaje({
        origen: "WEB",
        latitud: lat,
        longitud: lon,
      });

      toast.success("Se ha registrado su marcaje correctamente.");
      loadEstado();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ocurrió un error al registrar el marcaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "TRABAJANDO": return "success";
      case "EN_REFRIGERIO": return "warning";
      case "FINALIZADO": return "info";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {nombre ? `Bienvenido/a, ${nombre}` : "Mi Asistencia"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {nombre ? "Registre su marcaje y visualice sus horas trabajadas." : "Registre su marcaje y visualice sus horas trabajadas."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Panel de Marcaje */}
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${
            ["VACACIONES", "DE_PERMISO", "DESCANSO"].includes(estado?.estado_actual || "") 
              ? "bg-amber-500" 
              : "bg-primary-500"
          }`} />
          <div className="p-6 flex flex-col items-center text-center space-y-6">
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Registrar Marcaje</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                El sistema detectará automáticamente el tipo de marcaje que corresponde (Entrada, Refrigerio o Salida) según su horario.
              </p>
            </div>

            {["VACACIONES", "DE_PERMISO", "DESCANSO"].includes(estado?.estado_actual || "") ? (
              <div className="py-8 w-full max-w-md bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 rounded-2xl flex flex-col items-center justify-center p-6 text-amber-800 dark:text-amber-200">
                <Clock className="h-10 w-10 mb-3 opacity-80" />
                <h3 className="font-bold text-lg mb-1">Día no laborable</h3>
                <p className="text-sm text-center font-medium">
                  {estado?.horario_hoy}
                </p>
                <p className="text-xs text-center mt-2 opacity-80">
                  El registro de marcajes está deshabilitado para el día de hoy.
                </p>
              </div>
            ) : (
              <div className="py-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="h-24 w-64 text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col gap-2 items-center justify-center"
                  onClick={handleMarcajeWeb}
                  loading={isSubmitting}
                  disabled={estado?.estado_actual === "FINALIZADO"}
                >
                  <MapPin className="h-6 w-6" />
                  Registrar Marcaje Web
                </Button>
              </div>
            )}
            
            {estado?.estado_actual === "FINALIZADO" && (
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                Ya ha finalizado su jornada del día de hoy.
              </p>
            )}

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg">
              <Play className="h-4 w-4" />
              <span>Estado Actual:</span>
              <Badge variant={getStatusColor(estado?.estado_actual || "")}>
                {estado?.estado_actual || "SIN MARCAR"}
              </Badge>
            </div>

          </div>
        </Card>

        {/* Resumen del Día */}
        <Card>
          <div className="p-6 space-y-6">
            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Resumen del Día
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Horario:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {estado?.horario_hoy}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Último Marcaje:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {estado?.ultimo_marcaje || "Ninguno"}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Tiempo Trabajado</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {estado?.tiempo_trabajado_str}
                </p>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}
