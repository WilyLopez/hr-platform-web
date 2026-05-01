"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { 
    Card, 
    CardBody, 
    Button, 
    Badge, 
    SkeletonCard,
    Divider
} from "@/components/ui";
import { suscripcionService } from "@/services/suscripcion.service";
import { 
    Check, 
    Zap, 
    Shield, 
    ArrowLeft, 
    Star,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function CambiarPlanPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [isReady, setIsReady] = useState(false);
    const empresaId = usuario?.empresa_id ?? 0;

    useEffect(() => {
        if (empresaId) {
            setIsReady(true);
        }
    }, [empresaId]);

    // Obtener planes disponibles
    const { data: planes, isLoading: loadingPlanes } = useQuery({
        queryKey: ["planes"],
        queryFn: suscripcionService.listarPlanes,
        enabled: isReady,
    });

    // Obtener suscripción actual
    const { data: suscripcion, isLoading: loadingSusc } = useQuery({
        queryKey: ["suscripcion", empresaId],
        queryFn: suscripcionService.obtenerSuscripcion,
        enabled: isReady && !!empresaId,
    });

    // Mutación para cambiar de plan
    const mutation = useMutation({
        mutationFn: (planId: number) => suscripcionService.cambiarPlan(planId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suscripcion", empresaId] });
            toast.success("Tu plan ha sido actualizado correctamente.");
            router.push("/propietario/suscripcion");
        },
        onError: () => {
            toast.error("No se pudo procesar el cambio de plan. Intenta nuevamente.");
        }
    });

    const handleCambiarPlan = (planId: number, planNombre: string) => {
        if (suscripcion?.plan_id === planId) return;
        
        if (window.confirm(`¿Estás seguro de que deseas cambiar al plan ${planNombre}?`)) {
            mutation.mutate(planId);
        }
    };

    if (!isReady || loadingPlanes || loadingSusc) {
        return (
            <div className="space-y-6">
                <PageHeader title="Cambiar de Plan" description="Cargando planes disponibles..." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Cambiar de Plan"
                description="Selecciona el nivel de servicio que mejor se adapte al crecimiento de tu empresa"
                action={
                    <Link href="/propietario/suscripcion">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}>
                            Volver
                        </Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
                {planes?.map((plan) => {
                    const isCurrent = suscripcion?.plan_id === plan.id;
                    const isPro = plan.nombre === "PRO";

                    return (
                        <Card 
                            key={plan.id} 
                            className={`relative border-2 transition-all duration-300 ${
                                isCurrent 
                                    ? 'border-brand shadow-lg ring-1 ring-brand/10' 
                                    : 'border-transparent hover:border-neutral-200 shadow-sm'
                            }`}
                        >
                            {isCurrent && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge variant="brand" className="px-4 py-1">Tu Plan Actual</Badge>
                                </div>
                            )}

                            {isPro && !isCurrent && (
                                <div className="absolute -top-3 right-4">
                                    <Badge variant="warning" className="flex items-center gap-1">
                                        <Star size={10} fill="currentColor" />
                                        Recomendado
                                    </Badge>
                                </div>
                            )}

                            <CardBody className="p-8">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                                        isPro ? 'bg-orange-50 text-orange-500' : 'bg-brand-light/30 text-brand'
                                    }`}>
                                        {isPro ? <Zap size={32} /> : <Shield size={32} />}
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-2xl font-black text-neutral-900">{plan.nombre}</h3>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            {isPro ? "Para empresas en expansión" : "Ideal para comenzar"}
                                        </p>
                                    </div>

                                    <div className="flex items-baseline gap-1 py-4">
                                        <span className="text-4xl font-black text-neutral-900">S/ {plan.precio_mensual}</span>
                                        <span className="text-sm text-neutral-400">/ mes</span>
                                    </div>

                                    <Divider className="w-full" />

                                    <ul className="w-full space-y-4 text-left pt-4">
                                        <li className="flex items-center gap-3 text-sm text-neutral-600">
                                            <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                                            <span>Hasta <strong>{plan.limite_usuarios}</strong> usuarios activos</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-neutral-600">
                                            <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                                            <span><strong>{plan.almacenamiento_gb} GB</strong> de almacenamiento</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-neutral-600">
                                            <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                                            <span>Soporte por correo {isPro ? '24/7' : 'en horario laboral'}</span>
                                        </li>
                                        {isPro && (
                                            <li className="flex items-center gap-3 text-sm text-neutral-600">
                                                <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                                                <span>Reportes personalizados ilimitados</span>
                                            </li>
                                        )}
                                    </ul>

                                    <div className="w-full pt-8">
                                        <Button 
                                            fullWidth 
                                            variant={isCurrent ? "outline" : "brand"}
                                            disabled={isCurrent || mutation.isPending}
                                            loading={mutation.isPending && mutation.variables === plan.id}
                                            onClick={() => handleCambiarPlan(plan.id, plan.nombre)}
                                        >
                                            {isCurrent ? "Ya tienes este plan" : "Seleccionar Plan"}
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            <div className="max-w-3xl mx-auto text-center py-10 space-y-4">
                <p className="text-sm text-neutral-400">
                    ¿Necesitas un plan personalizado para más de 500 usuarios? 
                    <Button variant="link" size="sm" className="ml-1">Contacta con ventas</Button>
                </p>
                <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
                    <img src="/images/visa.svg" alt="Visa" className="h-6" />
                    <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
                    <img src="/images/amex.svg" alt="Amex" className="h-6" />
                </div>
            </div>
        </div>
    );
}
