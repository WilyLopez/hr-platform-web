"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { StatCard } from "@/components/charts/StatCard";
import { Card, CardHeader, CardBody, Badge, Button, Alert, Divider } from "@/components/ui";
import { suscripcionService } from "@/services/suscripcion.service";
import { empresaService } from "@/services/empresa.service";
import { ESTADOS_SUSCRIPCION } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { 
    Building2, 
    MapPin, 
    Users, 
    AlertTriangle, 
    CreditCard, 
    Zap, 
    ArrowRight,
    Calendar,
    ShieldCheck
} from "lucide-react";
import { BarChart } from "@/components/charts/BarChart";

export default function PropietarioDashboardPage() {
    const { usuario } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const empresaId = usuario?.empresa_id ?? 0;

    // ✅ Siempre activar al montar, sin condición
    useEffect(() => {
        setIsReady(true);
    }, []);

    const { data: suscripcion, isLoading: loadingSusc } = useQuery({
        queryKey: ["suscripcion", empresaId],
        queryFn: suscripcionService.obtenerSuscripcion,
        enabled: isReady && !!empresaId,
    });

    const { data: sedes, isLoading: loadingSedes } = useQuery({
        queryKey: ["sedes", empresaId],
        queryFn: () => empresaService.listarSedes(empresaId),
        enabled: isReady && !!empresaId,
    });

    const diasRestantes = suscripcion?.dias_restantes_trial ?? 0;
    const estadoSusc = suscripcion
        ? ESTADOS_SUSCRIPCION[suscripcion.estado]
        : null;

    const chartData = suscripcion ? [
        { name: "Activos", cantidad: suscripcion.usuarios_activos },
        { name: "Disponibles", cantidad: Math.max(0, suscripcion.limite_usuarios - suscripcion.usuarios_activos) }
    ] : [];

    // ✅ Ya no bloquea con !isReady
    const isGlobalLoading = (loadingSusc && !suscripcion) || (loadingSedes && !sedes);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader 
                    title={empresaId ? `Bienvenido, ${usuario?.codigo_unico}` : "Cargando..."} 
                    description="Aquí tienes un resumen del estado actual de tu empresa y suscripción." 
                />
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Building2 size={14} />}>
                        Ver Empresa
                    </Button>
                    <Button size="sm" leftIcon={<Zap size={14} />} className="bg-brand hover:bg-brand-dark">
                        Mejorar Plan
                    </Button>
                </div>
            </div>

            {suscripcion?.estado === "TRIAL" && (
                <Alert 
                    variant={diasRestantes <= 7 ? "danger" : "warning"}
                    title={diasRestantes <= 7 
                        ? `Tu periodo de prueba vence en ${diasRestantes} día${diasRestantes !== 1 ? "s" : ""}`
                        : `Estás en periodo de prueba: quedan ${diasRestantes} días`
                    }
                    dismissible
                    className="flex flex-col sm:flex-row sm:items-center justify-between"
                >
                    <div className="flex-1">
                        Asegúrate de configurar tu método de pago para evitar interrupciones en el servicio al finalizar el trial.
                    </div>
                    <div className="mt-3 sm:mt-0 flex-shrink-0">
                        <Button size="sm" variant={diasRestantes <= 7 ? "danger" : "outline"}>
                            Activar ahora
                        </Button>
                    </div>
                </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Plan Actual"
                    value={suscripcion?.plan_nombre ?? "—"}
                    icon={ShieldCheck}
                    isLoading={isGlobalLoading}
                    variant="brand"
                    className="border-none shadow-sm bg-gradient-to-br from-white to-neutral-50"
                />
                <StatCard
                    title="Usuarios"
                    value={suscripcion ? `${suscripcion.usuarios_activos} / ${suscripcion.limite_usuarios}` : "—"}
                    icon={Users}
                    isLoading={isGlobalLoading}
                    variant="brand"
                    trend={suscripcion ? { 
                        value: Math.round((suscripcion.usuarios_activos / suscripcion.limite_usuarios) * 100), 
                        label: "capacidad usada" 
                    } : undefined}
                    className="border-none shadow-sm bg-gradient-to-br from-white to-neutral-50"
                />
                <StatCard
                    title="Sedes"
                    value={sedes?.length ?? "0"}
                    icon={MapPin}
                    isLoading={isGlobalLoading}
                    variant="warning"
                    className="border-none shadow-sm bg-gradient-to-br from-white to-neutral-50"
                />
                <StatCard
                    title="Estado"
                    value={estadoSusc?.label ?? "—"}
                    icon={CreditCard}
                    isLoading={isGlobalLoading}
                    variant={estadoSusc?.variant === "success" ? "success" : "warning"}
                    className="border-none shadow-sm bg-gradient-to-br from-white to-neutral-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                    <CardHeader 
                        title="Detalles de la Suscripción" 
                        description="Información detallada sobre tu facturación y límites"
                        action={
                            <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Gestionar
                            </Button>
                        }
                    />
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-neutral-200">
                                            <Calendar size={16} className="text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Próximo Pago</p>
                                            <p className="text-sm font-semibold text-neutral-900">
                                                {suscripcion?.fecha_proxima_facturacion 
                                                    ? formatDate(suscripcion.fecha_proxima_facturacion) 
                                                    : "No programado"}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="neutral">Mensual</Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-neutral-200">
                                            <ShieldCheck size={16} className="text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Estado de Cuenta</p>
                                            <p className="text-sm font-semibold text-neutral-900">Al día</p>
                                        </div>
                                    </div>
                                    <Badge variant="success" dot>Activo</Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Uso de Usuarios</p>
                                <div className="h-40">
                                    <BarChart 
                                        data={chartData} 
                                        xKey="name" 
                                        yKey="cantidad" 
                                        color="#2E75B6" 
                                        height={160} 
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-500">Capacidad total: {suscripcion?.limite_usuarios}</span>
                                    <span className="font-bold text-brand">
                                        {suscripcion 
                                            ? Math.round((suscripcion.usuarios_activos / suscripcion.limite_usuarios) * 100) 
                                            : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-brand h-full rounded-full transition-all duration-500" 
                                        style={{ 
                                            width: `${suscripcion 
                                                ? (suscripcion.usuarios_activos / suscripcion.limite_usuarios) * 100 
                                                : 0}%` 
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader title="Sedes de la Empresa" description="Distribución por ubicación" />
                    <CardBody>
                        {loadingSedes ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-24 bg-neutral-100 animate-pulse rounded" />
                                            <div className="h-2 w-32 bg-neutral-100 animate-pulse rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : sedes && sedes.length > 0 ? (
                            <div className="space-y-4">
                                {sedes.map((sede) => (
                                    <div key={sede.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors group">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">{sede.nombre}</p>
                                            <p className="text-xs text-neutral-400 truncate">{sede.direccion}</p>
                                        </div>
                                        <ArrowRight size={14} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                                    </div>
                                ))}
                                <Divider />
                                <Button variant="ghost" size="sm" fullWidth className="text-xs">
                                    Ver todas las sedes
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                                    <MapPin size={24} className="text-neutral-200" />
                                </div>
                                <p className="text-xs text-neutral-500">No has configurado sedes aún.</p>
                                <Button variant="link" size="sm" className="mt-2">Crear mi primera sede</Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}