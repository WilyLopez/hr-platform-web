"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Button, 
    Badge, 
    SkeletonText,
    Divider
} from "@/components/ui";
import { suscripcionService } from "@/services/suscripcion.service";
import { ESTADOS_SUSCRIPCION } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { 
    CreditCard, 
    Zap, 
    Calendar, 
    ShieldCheck, 
    Users, 
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertCircle,
    Sparkles
} from "lucide-react";
import Link from "next/link";

// ── Skeleton ────────────────────────────────────────────────
function SuscripcionSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-36 bg-neutral-100 animate-pulse rounded-lg" />
                    <div className="h-3 w-64 bg-neutral-100 animate-pulse rounded-lg" />
                </div>
                <div className="h-8 w-32 bg-neutral-100 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-neutral-100 animate-pulse rounded" />
                            <div className="h-3 w-16 bg-neutral-100 animate-pulse rounded" />
                        </div>
                    </div>
                    <div className="h-px bg-neutral-100 my-4" />
                    <SkeletonText lines={3} />
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-6">
                    <SkeletonText lines={8} />
                </div>
            </div>
        </div>
    );
}

// ── Feature item ─────────────────────────────────────────────
function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={12} className="text-success" />
            </div>
            <span className="text-neutral-600">{text}</span>
        </div>
    );
}

// ── Stat card ─────────────────────────────────────────────────
function StatItem({ icon: Icon, label, value, sub, iconClass }: {
    icon: React.ElementType;
    label: string;
    value: string;
    sub: string;
    iconClass?: string;
}) {
    return (
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="flex items-center gap-2">
                <Icon size={13} className={iconClass ?? "text-neutral-400"} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</span>
            </div>
            <p className="text-base font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-400 leading-relaxed">{sub}</p>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────
export default function SuscripcionPage() {
    const { usuario } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const empresaId = usuario?.empresa_id ?? 0;

    // ✅ FIX: siempre activar al montar, sin condición
    useEffect(() => {
        setIsReady(true);
    }, []);

    const { data: suscripcion, isLoading } = useQuery({
        queryKey: ["suscripcion", empresaId],
        queryFn: suscripcionService.obtenerSuscripcion,
        enabled: isReady && !!empresaId,
    });

    const estado = suscripcion ? ESTADOS_SUSCRIPCION[suscripcion.estado] : null;
    const isTrial = suscripcion?.estado === "TRIAL";
    const isSuspended = !isTrial && suscripcion?.estado !== "ACTIVA";
    const percentUsers = suscripcion
        ? Math.min((suscripcion.usuarios_activos / suscripcion.limite_usuarios) * 100, 100)
        : 0;
    const isCapacityCritical = percentUsers > 90;
    const isCapacityWarning = percentUsers > 70 && !isCapacityCritical;

    // ✅ FIX: eliminado !isReady del guard
    if (isLoading) return <SuscripcionSkeleton />;

    if (!suscripcion) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <AlertCircle size={28} className="text-neutral-300" />
                </div>
                <div>
                    <p className="font-semibold text-neutral-700">No se encontró información de suscripción</p>
                    <p className="text-sm text-neutral-400 mt-1">Verifica tu conexión e intenta de nuevo.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Suscripción"
                description="Administra tu plan, facturación y límites de la plataforma"
                action={
                    <Link href="/propietario/suscripcion/cambiar-plan">
                        <Button size="sm" leftIcon={<Zap size={14} />} className="bg-brand hover:bg-brand-dark">
                            Cambiar de Plan
                        </Button>
                    </Link>
                }
            />

            {/* Banner Trial */}
            {isTrial && (
                <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    suscripcion.dias_restantes_trial <= 7
                        ? "bg-danger-light/20 border-danger/20"
                        : "bg-brand-light/20 border-brand/20"
                }`}>
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                        suscripcion.dias_restantes_trial <= 7 ? "bg-danger/10" : "bg-brand/10"
                    }`}>
                        <Zap size={18} className={suscripcion.dias_restantes_trial <= 7 ? "text-danger" : "text-brand"} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${
                            suscripcion.dias_restantes_trial <= 7 ? "text-danger-dark" : "text-brand-dark"
                        }`}>
                            {suscripcion.dias_restantes_trial <= 7
                                ? `⚠️ Tu trial vence en ${suscripcion.dias_restantes_trial} día${suscripcion.dias_restantes_trial !== 1 ? "s" : ""}`
                                : `Estás en periodo de prueba — quedan ${suscripcion.dias_restantes_trial} días`}
                        </p>
                        <p className={`text-xs mt-1 opacity-80 ${
                            suscripcion.dias_restantes_trial <= 7 ? "text-danger-dark" : "text-brand-dark"
                        }`}>
                            Vence el <strong>{formatDate(suscripcion.fecha_fin_trial!)}</strong>. Activa tu plan para no interrumpir el servicio.
                        </p>
                    </div>
                    <Link href="/propietario/suscripcion/cambiar-plan" className="hidden sm:block flex-shrink-0">
                        <Button size="sm" variant={suscripcion.dias_restantes_trial <= 7 ? "danger" : "brand"}>
                            Activar Ahora
                        </Button>
                    </Link>
                </div>
            )}

            {/* Banner Suspendida */}
            {isSuspended && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-danger-light/20 border border-danger/20">
                    <div className="p-2 rounded-lg bg-danger/10 flex-shrink-0">
                        <AlertTriangle size={18} className="text-danger" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-danger-dark">Tu cuenta está suspendida</p>
                        <p className="text-xs text-danger-dark/80 mt-1">
                            Actualiza tu método de pago para restaurar el acceso completo a la plataforma.
                        </p>
                    </div>
                    <Button size="sm" variant="danger" className="hidden sm:flex flex-shrink-0">
                        Actualizar Pago
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Columna izquierda: Plan ── */}
                <div className="space-y-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        {/* Franja decorativa */}
                        <div className="h-16 bg-gradient-to-br from-brand/15 via-blue-500/10 to-purple-500/10 relative">
                            <div className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: "radial-gradient(circle at 30% 50%, #2E75B6 1px, transparent 1px)",
                                    backgroundSize: "20px 20px"
                                }}
                            />
                        </div>

                        <CardBody className="px-5 pb-5 -mt-8">
                            <div className="flex items-end gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-neutral-100 flex items-center justify-center ring-4 ring-white">
                                    <ShieldCheck size={24} className="text-brand" />
                                </div>
                                <div className="pb-1">
                                    {estado && (
                                        <Badge variant={estado.variant as any} dot>
                                            {estado.label}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-neutral-900 mb-1">{suscripcion.plan_nombre}</h3>
                            <p className="text-xs text-neutral-400 mb-5">Tu nivel de servicio actual en NexusRH</p>

                            <Divider className="mb-5" />

                            <div className="space-y-3">
                                <FeatureItem text={`Hasta ${suscripcion.limite_usuarios} usuarios activos`} />
                                <FeatureItem text="Soporte técnico prioritario" />
                                <FeatureItem text="Reportes avanzados de asistencia" />
                                <FeatureItem text="Módulos de RRHH completos" />
                            </div>

                            <Link href="/propietario/suscripcion/cambiar-plan" className="block mt-5">
                                <Button variant="outline" size="sm" fullWidth leftIcon={<Sparkles size={13} />}>
                                    Ver planes disponibles
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>

                    {/* Mini stat: días de miembro */}
                    <Card className="border-none shadow-sm">
                        <CardBody className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <TrendingUp size={18} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Miembro desde</p>
                                <p className="text-sm font-semibold text-neutral-900">{formatDate(suscripcion.fecha_inicio)}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* ── Columna derecha: Uso y Facturación ── */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader
                        title="Uso y Facturación"
                        description="Control de tus límites y fechas de pago"
                    />
                    <CardBody className="pt-0 space-y-8">

                        {/* Uso de usuarios */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-neutral-400" />
                                    <span className="text-sm font-semibold text-neutral-700">Usuarios Activos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${
                                        isCapacityCritical ? "text-danger" : isCapacityWarning ? "text-warning" : "text-neutral-700"
                                    }`}>
                                        {suscripcion.usuarios_activos}
                                    </span>
                                    <span className="text-xs text-neutral-400">/ {suscripcion.limite_usuarios} licencias</span>
                                </div>
                            </div>

                            {/* Barra de progreso con colores dinámicos */}
                            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        isCapacityCritical
                                            ? "bg-danger"
                                            : isCapacityWarning
                                            ? "bg-warning"
                                            : "bg-brand"
                                    }`}
                                    style={{ width: `${percentUsers}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-[11px] text-neutral-400">
                                    {isCapacityCritical
                                        ? "⚠️ Capacidad casi agotada. Considera mejorar tu plan."
                                        : isCapacityWarning
                                        ? "Estás usando más del 70% de tu capacidad."
                                        : "Tienes capacidad disponible en tu plan actual."}
                                </p>
                                <span className={`text-xs font-bold ${
                                    isCapacityCritical ? "text-danger" : isCapacityWarning ? "text-warning" : "text-brand"
                                }`}>
                                    {Math.round(percentUsers)}%
                                </span>
                            </div>
                        </div>

                        <Divider />

                        {/* Tarjetas de facturación */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatItem
                                icon={Calendar}
                                label="Próxima Facturación"
                                value={suscripcion.fecha_proxima_facturacion
                                    ? formatDate(suscripcion.fecha_proxima_facturacion)
                                    : "No programada"}
                                sub="Se cargará automáticamente a tu método de pago predeterminado."
                                iconClass="text-blue-400"
                            />
                            <StatItem
                                icon={Clock}
                                label="Ciclo de Facturación"
                                value="Mensual"
                                sub="Tu suscripción se renueva cada mes de forma automática."
                                iconClass="text-purple-400"
                            />
                        </div>

                        <Divider />

                        {/* Método de pago placeholder */}
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                                Método de Pago
                            </p>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center">
                                        <CreditCard size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-700">•••• •••• •••• 4242</p>
                                        <p className="text-[10px] text-neutral-400">Vence 12/26</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    Cambiar
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}