"use client";
import { useState, useEffect, use } from "react";
import { PageHeader }  from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { asistenciaService } from "@/services/asistencia.service";
import { useToast } from "@/hooks/useToast";
import { calcularDiasRestantes, formatDateTime } from "@/utils/format";
import type { TokenQR } from "@/types/asistencia.types";
import { RefreshCw, Clock } from "lucide-react";

export default function QrPage({ params }: { params: Promise<{ sede_id: string }> }) {
  const { sede_id } = use(params);
  const sedeId      = parseInt(sede_id, 10);
  const toast       = useToast();
  const [qr,      setQr]      = useState<TokenQR | null>(null);
  const [loading, setLoading] = useState(false);
  const [expCount, setExpCount] = useState(0);

  async function generarQr() {
    setLoading(true);
    try {
      const data = await asistenciaService.generarQr(sedeId);
      setQr(data);
      toast.success("Código QR generado correctamente.");
    } catch {
      toast.error("No se pudo generar el código QR.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { generarQr(); }, [sedeId]);

  useEffect(() => {
    if (!qr) return;
    const interval = setInterval(() => {
      const secsLeft = Math.floor(
        (new Date(qr.expira_en).getTime() - Date.now()) / 1000
      );
      setExpCount(secsLeft);
      if (secsLeft <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [qr]);

  const minutos = Math.floor(expCount / 60);
  const segundos = expCount % 60;
  const vencido  = expCount <= 0;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <PageHeader
        title="Código QR de asistencia"
        description={qr ? `Sede: ${qr.sede_nombre}` : "Generando..."}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={generarQr}
            loading={loading}
            leftIcon={<RefreshCw size={14} />}
          >
            Regenerar
          </Button>
        }
      />

      <Card>
        <CardBody>
          {loading && !qr ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" className="text-brand" />
            </div>
          ) : qr ? (
            <div className="flex flex-col items-center gap-5">
              {vencido ? (
                <div className="w-64 h-64 bg-neutral-100 rounded-xl flex flex-col items-center justify-center gap-3">
                  <Clock size={32} className="text-neutral-400" />
                  <p className="text-sm font-medium text-neutral-500">QR vencido</p>
                  <Button size="sm" onClick={generarQr} loading={loading}>
                    Generar nuevo
                  </Button>
                </div>
              ) : (
                <img
                  src={qr.imagen_base64}
                  alt="Código QR de asistencia"
                  className="w-64 h-64 rounded-xl border-4 border-neutral-100"
                />
              )}

              <div className="text-center">
                <p className="text-xs text-neutral-500">Tiempo restante</p>
                <p
                  className={`text-3xl font-bold font-mono mt-1 ${
                    expCount < 60 ? "text-danger" : "text-neutral-800"
                  }`}
                >
                  {String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Vence: {formatDateTime(qr.expira_en)}
                </p>
              </div>

              <div className="w-full bg-brand-pale rounded-lg p-3 text-center">
                <p className="text-xs text-brand-dark font-medium">
                  Los empleados escanean este QR desde la app móvil para registrar su asistencia.
                </p>
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}