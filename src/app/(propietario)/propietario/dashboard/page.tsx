"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { StatCard } from "@/components/charts/StatCard";
import { Card, CardHeader, CardBody, Badge } from "@/components/ui";
import { suscripcionService } from "@/services/suscripcion.service";
import { empresaService } from "@/services/empresa.service";
import { ESTADOS_SUSCRIPCION } from "@/utils/constants";
import { calcularDiasRestantes, formatDate } from "@/utils/format";
import { Building2, MapPin, Users, AlertTriangle } from "lucide-react";

export default function PropietarioDashboardPage() {
    const { usuario } = useAuth();
    const empresaId = usuario?.empresa_id ?? 0;

    const { data: suscripcion, isLoading: loadingSusc } = useQuery({
        queryKey: ["suscripcion"],
        queryFn: suscripcionService.obtenerSuscripcion,
        enabled: !!empresaId,
    });

    const { data: sedes, isLoading: loadingSedes } = useQuery({
        queryKey: ["sedes", empresaId],
        queryFn: () => empresaService.listarSedes(empresaId),
        enabled: !!empresaId,
    });

    const diasRestantes = suscripcion?.dias_restantes_trial ?? 0;
    const estadoSusc = suscripcion
        ? ESTADOS_SUSCRIPCION[suscripcion.estado]
        : null;

    return (
        <div className="space-y-6">
            <PageHeader title="Dashboard" description="Resumen de tu empresa" />

            {suscripcion?.estado === "TRIAL" && diasRestantes <= 7 && (
                <div className="flex items-start gap-3 p-4 bg-warning-light border border-warning rounded-lg">
                    <AlertTriangle
                        size={18}
                        className="text-warning flex-shrink-0 mt-0.5"
                    />
                    <div>
                        <p className="text-sm font-semibold text-warning-dark">
                            Tu periodo de prueba vence en {diasRestantes} día
                            {diasRestantes !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-warning-dark mt-0.5">
                            Activa tu suscripción para continuar usando NexusRH
                            sin interrupciones.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Plan activo"
                    value={suscripcion?.plan_nombre ?? "—"}
                    icon={Building2}
                    isLoading={loadingSusc}
                />
                <StatCard
                    title="Usuarios activos"
                    value={
                        suscripcion
                            ? `${suscripcion.usuarios_activos} / ${suscripcion.limite_usuarios}`
                            : "—"
                    }
                    icon={Users}
                    isLoading={loadingSusc}
                />
                <StatCard
                    title="Sedes configuradas"
                    value={sedes?.length ?? "—"}
                    icon={MapPin}
                    isLoading={loadingSedes}
                />
                <StatCard
                    title="Estado suscripción"
                    value={estadoSusc?.label ?? "—"}
                    icon={Building2}
                    isLoading={loadingSusc}
                />
            </div>

            <Card>
                <CardHeader title="Detalle de suscripción" />
                <CardBody>
                    {suscripcion ? (
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-neutral-500">Plan</dt>
                                <dd className="font-medium text-neutral-900 mt-0.5">
                                    {suscripcion.plan_nombre}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-neutral-500">Estado</dt>
                                <dd className="mt-0.5">
                                    {estadoSusc && (
                                        <Badge
                                            variant={
                                                estadoSusc.variant as "success"
                                            }
                                        >
                                            {estadoSusc.label}
                                        </Badge>
                                    )}
                                </dd>
                            </div>
                            {suscripcion.fecha_fin_trial && (
                                <div>
                                    <dt className="text-neutral-500">
                                        Fin de prueba
                                    </dt>
                                    <dd className="font-medium text-neutral-900 mt-0.5">
                                        {formatDate(
                                            suscripcion.fecha_fin_trial,
                                        )}
                                    </dd>
                                </div>
                            )}
                            {suscripcion.fecha_proxima_facturacion && (
                                <div>
                                    <dt className="text-neutral-500">
                                        Próxima facturación
                                    </dt>
                                    <dd className="font-medium text-neutral-900 mt-0.5">
                                        {formatDate(
                                            suscripcion.fecha_proxima_facturacion,
                                        )}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    ) : (
                        <p className="text-sm text-neutral-400">
                            Cargando información...
                        </p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
