"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
    CreditCard, 
    Zap, 
    ArrowRight,
    Calendar,
    ShieldCheck
} from "lucide-react";
import { BarChart } from "@/components/charts/BarChart";

export default function PropietarioDashboardPage() {
    const router = useRouter();
    const { usuario } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const empresaId = usuario?.empresa_id ?? 0;

    useEffect(() => {
        setIsReady(true);
    }, []);

    const { data: suscripcion, isLoading: loadingSusc } = useQuery({
        queryKey: ["suscripcion", empresaId],
        queryFn: suscripcionService.obtenerSuscripcion,
        enabled: isReady && !!empresaId,
    });

    const { data: empresa, isLoading: loadingEmpresa } = useQuery({
        queryKey: ["empresa", empresaId],
        queryFn: () => empresaService.obtener(empresaId),
        enabled: isReady && !!empresaId,
    });

    const { data: sedes, isLoading: loadingSedes } = useQuery({
        queryKey: ["sedes", empresaId],
        queryFn: () => empresaService.listarSedes(empresaId),
        enabled: isReady && !!empresaId,
    });

    const estadoSusc = suscripcion
        ? ESTADOS_SUSCRIPCION[suscripcion.estado]
        : null;
    
    const diasRestantes = suscripcion?.dias_restantes_trial ?? 0;

    const chartData = suscripcion ? [
        { name: "Activos", cantidad: suscripcion.usuarios_activos },
        { name: "Disponibles", cantidad: Math.max(0, suscripcion.limite_usuarios - suscripcion.usuarios_activos) }
    ] : [];

    // ✅ Ya no bloquea con !isReady
    const isGlobalLoading = (loadingSusc && !suscripcion) || (loadingSedes && !sedes) || (loadingEmpresa && !empresa);

    const nombreMostrar = empresa?.nombre_comercial || empresa?.razon_social || usuario?.codigo_unico;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader 
                    title={empresaId ? `Bienvenido, ${nombreMostrar}` : "Cargando..."} 
                    description="Aquí tienes un resumen del estado actual de tu empresa y suscripción." 
                />
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Building2 size={14} />} onClick={() => router.push('/propietario/empresa')}>
                        Ver Empresa
                    </Button>
                    <Button size="sm" leftIcon={<Zap size={14} />} className="bg-brand hover:bg-brand-dark" onClick={() => router.push('/propietario/suscripcion')}>
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
                        <Button size="sm" variant={diasRestantes <= 7 ? "danger" : "outline"} onClick={() => router.push('/propietario/suscripcion')}>
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
                />
                <StatCard
                    title="Usuarios"
                    value={suscripcion ? `${suscripcion.usuarios_activos} / ${suscripcion.limite_usuarios}` : "—"}
                    icon={Users}
                    isLoading={isGlobalLoading}
                    variant="brand"
                />
                <StatCard
                    title="Sedes"
                    value={sedes?.length ?? "0"}
                    icon={MapPin}
                    isLoading={isGlobalLoading}
                    variant="warning"
                />
                <StatCard
                    title="Estado"
                    value={estadoSusc?.label ?? "—"}
                    icon={CreditCard}
                    isLoading={isGlobalLoading}
                    variant={estadoSusc?.variant === "success" ? "success" : "warning"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader 
                        title="Detalles de la Suscripción" 
                        action={<Button variant="ghost" size="sm">Gestionar</Button>}
                    />
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-slate-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Próximo Pago</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {suscripcion?.fecha_proxima_facturacion 
                                                    ? formatDate(suscripcion.fecha_proxima_facturacion) 
                                                    : "No programado"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uso de Usuarios</p>
                                <div className="h-40">
                                    <BarChart 
                                        data={chartData} 
                                        xKey="name" 
                                        yKey="cantidad" 
                                        color="#0f172a" 
                                        height={160} 
                                    />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Sedes" />
                    <CardBody>
                        {loadingSedes ? <p>Cargando...</p> : (
                            <div className="space-y-4">
                                {sedes?.map((sede) => (
                                    <div key={sede.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={18} className="text-slate-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{sede.nombre}</p>
                                                <p className="text-xs text-slate-500">{sede.direccion}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}