"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { 
    Card, 
    CardBody, 
    Button, 
    Badge, 
    Input, 
    SkeletonText,
    Divider,
    Avatar
} from "@/components/ui";
import { empresaService } from "@/services/empresa.service";
import { 
    Building2, 
    Mail, 
    Phone, 
    MapPin, 
    Hash, 
    Pencil, 
    Save, 
    X, 
    Globe, 
    ShieldCheck,
    Camera,
    CalendarDays,
    Fingerprint,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const ESTADOS: Record<string, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
    ACTIVA:     { label: "Activa",      variant: "success" },
    EN_PRUEBA:  { label: "En prueba",   variant: "warning" },
    SUSPENDIDA: { label: "Suspendida",  variant: "danger"  },
    ELIMINADA:  { label: "Eliminada",   variant: "neutral" },
};

const empresaSchema = z.object({
    nombre_comercial: z.string().min(1, "El nombre comercial es obligatorio"),
    telefono: z.string().min(7, "Teléfono inválido"),
    direccion: z.string().min(5, "La dirección es muy corta"),
    logo_url: z.string().nullable().optional(),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

// Componente auxiliar para filas de info
function InfoRow({ icon: Icon, label, value, iconClass = "text-neutral-400" }: {
    icon: React.ElementType;
    label: string;
    value: string;
    iconClass?: string;
}) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
            <div className={`w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} className={iconClass} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
                <p className="text-sm font-semibold text-neutral-900 truncate">{value || "No definido"}</p>
            </div>
        </div>
    );
}

// Skeleton de carga mejorado
function EmpresaPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-40 bg-neutral-100 animate-pulse rounded-lg" />
                    <div className="h-3 w-64 bg-neutral-100 animate-pulse rounded-lg" />
                </div>
                <div className="h-8 w-28 bg-neutral-100 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 animate-pulse" />
                    <div className="w-36 h-4 bg-neutral-100 animate-pulse rounded-lg" />
                    <div className="w-24 h-3 bg-neutral-100 animate-pulse rounded-lg" />
                    <div className="w-16 h-5 bg-neutral-100 animate-pulse rounded-full" />
                    <div className="w-full h-px bg-neutral-100 my-2" />
                    <div className="w-full space-y-4">
                        {[1,2].map(i => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="w-8 h-8 bg-neutral-100 animate-pulse rounded-lg" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-2 w-16 bg-neutral-100 animate-pulse rounded" />
                                    <div className="h-3 w-28 bg-neutral-100 animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-6">
                    <SkeletonText lines={8} />
                </div>
            </div>
        </div>
    );
}

export default function EmpresaPage() {
    const { usuario } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const toast = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    
    const logoFileRef = React.useRef<HTMLInputElement>(null);

    const empresaId = usuario?.empresa_id ?? 0;

    // ✅ FIX: Siempre activar al montar, sin condición
    useEffect(() => {
        setIsReady(true);
    }, []);

    const { data: empresa, isLoading } = useQuery({
        queryKey: ["empresa", empresaId],
        queryFn: () => empresaService.obtener(empresaId),
        enabled: isReady && !!empresaId,
    });

    const { register, handleSubmit, reset, control, setValue, formState: { errors, isDirty } } = useForm<EmpresaFormData>({
        resolver: zodResolver(empresaSchema),
    });

    const currentLogo = useWatch({ control, name: "logo_url" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen no puede pesar más de 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setValue("logo_url", reader.result as string, { shouldDirty: true });
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (empresa) {
            reset({
                nombre_comercial: empresa.nombre_comercial || "",
                telefono: empresa.telefono || "",
                direccion: empresa.direccion || "",
                logo_url: empresa.logo_url,
            });
        }
    }, [empresa, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: EmpresaFormData) => empresaService.actualizar(empresaId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empresa", empresaId] });
            toast.success("Información actualizada correctamente");
            setIsEditing(false);
        },
        onError: () => {
            toast.error("No se pudo actualizar la información");
        }
    });

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const onSubmit = (data: EmpresaFormData) => {
        updateMutation.mutate(data);
    };

    const estado = empresa
        ? (ESTADOS[empresa.estado] ?? { label: empresa.estado, variant: "neutral" as const })
        : null;

    // ✅ FIX: Eliminado !isReady del loading
    if (isLoading) {
        return <EmpresaPageSkeleton />;
    }

    if (!empresa) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <AlertCircle size={28} className="text-neutral-300" />
                </div>
                <div>
                    <p className="font-semibold text-neutral-700">No se pudo cargar la empresa</p>
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
                title="Mi Empresa"
                description="Gestiona la identidad y datos de contacto de tu organización"
                action={
                    !isEditing ? (
                        <Button size="sm" leftIcon={<Pencil size={14} />} onClick={() => setIsEditing(true)}>
                            Editar Perfil
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<X size={14} />}
                                onClick={handleCancel}
                                disabled={updateMutation.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                leftIcon={<Save size={14} />}
                                onClick={handleSubmit(onSubmit)}
                                loading={updateMutation.isPending}
                                disabled={!isDirty}
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    )
                }
            />

            {/* Banner de modo edición */}
            {isEditing && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand/5 border border-brand/15 text-brand-dark">
                    <Pencil size={15} className="text-brand flex-shrink-0" />
                    <p className="text-xs font-medium">
                        Estás en modo edición. Los cambios no se guardarán hasta que hagas clic en <strong>"Guardar Cambios"</strong>.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Columna izquierda: Identidad ── */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        {/* Franja superior decorativa */}
                        <div className="h-20 bg-gradient-to-br from-brand/10 via-blue-500/10 to-purple-500/10 relative">
                            <div className="absolute inset-0 opacity-30" 
                                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #2E75B6 1px, transparent 1px), radial-gradient(circle at 80% 20%, #6366f1 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
                            />
                        </div>

                        <CardBody className="px-6 pb-6 -mt-12 text-center">
                            {/* Avatar con botón de cámara */}
                            <div className="relative inline-block group mb-3">
                                <div className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                                    {currentLogo || empresa.logo_url ? (
                                        <img 
                                            src={currentLogo || empresa.logo_url || ""} 
                                            alt="Logo" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <Avatar
                                            name={empresa.razon_social}
                                            size="lg"
                                            className="w-full h-full text-xl rounded-none"
                                        />
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            ref={logoFileRef}
                                            onChange={handleFileChange}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => logoFileRef.current?.click()}
                                            className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                        >
                                            <Camera size={18} className="text-white" />
                                        </button>
                                    </>
                                )}
                            </div>

                            <h3 className="text-base font-bold text-neutral-900 truncate leading-tight">
                                {empresa.nombre_comercial || empresa.razon_social}
                            </h3>
                            <p className="text-xs text-neutral-400 truncate mt-0.5 mb-3">{empresa.razon_social}</p>

                            {estado && (
                                <Badge variant={estado.variant} dot>
                                    {estado.label}
                                </Badge>
                            )}

                            <Divider className="my-5" />

                            {/* Datos no editables */}
                            <div className="text-left space-y-1">
                                <InfoRow
                                    icon={Hash}
                                    label="RUC"
                                    value={empresa.ruc}
                                    iconClass="text-neutral-400"
                                />
                                <InfoRow
                                    icon={Mail}
                                    label="Correo Corporativo"
                                    value={empresa.correo}
                                    iconClass="text-blue-400"
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Tarjeta de auditoría */}
                    <Card className="border-none shadow-sm">
                        <CardBody className="p-4 space-y-1">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Auditoría</p>
                            <InfoRow
                                icon={CalendarDays}
                                label="Fecha de Registro"
                                value={new Date(empresa.fecha_registro).toLocaleDateString("es-PE", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                                iconClass="text-purple-400"
                            />
                            <InfoRow
                                icon={Fingerprint}
                                label="ID de Organización"
                                value={`#${empresa.id.toString().padStart(5, "0")}`}
                                iconClass="text-neutral-400"
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* ── Columna derecha: Detalle / Formulario ── */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardBody className="p-6">
                        {isEditing ? (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                        Información Editable
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="Nombre Comercial"
                                            placeholder="Ej: NexusRH Tech"
                                            leftIcon={<Building2 size={15} />}
                                            error={errors.nombre_comercial?.message}
                                            {...register("nombre_comercial")}
                                        />
                                        <Input
                                            label="Teléfono de Contacto"
                                            placeholder="987 654 321"
                                            leftIcon={<Phone size={15} />}
                                            error={errors.telefono?.message}
                                            {...register("telefono")}
                                        />
                                    </div>
                                </div>

                                <Input
                                    label="Dirección Fiscal"
                                    placeholder="Av. Ejemplo 123, Miraflores, Lima"
                                    leftIcon={<MapPin size={15} />}
                                    error={errors.direccion?.message}
                                    {...register("direccion")}
                                />

                                {/* Nota de seguridad */}
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <ShieldCheck size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-800 mb-0.5">Campos bloqueados</p>
                                        <p className="text-xs text-amber-700 leading-relaxed">
                                            El RUC y la Razón Social son datos verificados por SUNAT. Para modificarlos, contacta a soporte.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Sección operativa */}
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                        Información Operativa
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                                        <InfoRow
                                            icon={Globe}
                                            label="Nombre Comercial"
                                            value={empresa.nombre_comercial}
                                            iconClass="text-blue-400"
                                        />
                                        <InfoRow
                                            icon={Phone}
                                            label="Teléfono Corporativo"
                                            value={empresa.telefono}
                                            iconClass="text-green-400"
                                        />
                                    </div>
                                </div>

                                <Divider />

                                {/* Dirección */}
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                        Sede Fiscal
                                    </p>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                                        <div className="p-2.5 rounded-xl bg-white border border-orange-100 shadow-sm flex-shrink-0">
                                            <MapPin size={18} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900">
                                                {empresa.direccion || "Sin dirección registrada"}
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-1">
                                                Dirección oficial para facturación y reportes legales.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                {/* Verificación SUNAT */}
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                        Datos Verificados
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">RUC Verificado</p>
                                                <p className="text-sm font-mono font-semibold text-neutral-900">{empresa.ruc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Razón Social</p>
                                                <p className="text-sm font-semibold text-neutral-900 truncate">{empresa.razon_social}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}