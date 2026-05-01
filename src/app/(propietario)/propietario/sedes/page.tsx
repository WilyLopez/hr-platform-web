"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Badge, SkeletonTable } from "@/components/ui";
import { empresaService } from "@/services/empresa.service";
import { MapPin, Plus, Pencil, Radio } from "lucide-react";

export default function SedesPage() {
    const { usuario } = useAuth();
    const empresaId = usuario?.empresa_id ?? 0;

    const { data: sedes, isLoading } = useQuery({
        queryKey: ["sedes", empresaId],
        queryFn: () => empresaService.listarSedes(empresaId),
        enabled: !!empresaId,
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sedes"
                description="Gestiona las ubicaciones de tu empresa"
                action={
                    <Link href="/propietario/sedes/nueva">
                        <Button size="sm" leftIcon={<Plus size={14} />}>
                            Nueva sede
                        </Button>
                    </Link>
                }
            />

            {isLoading ? (
                <SkeletonTable rows={4} />
            ) : !sedes || sedes.length === 0 ? (
                <Card>
                    <CardBody>
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <MapPin size={32} className="text-neutral-300" />
                            <p className="text-sm text-neutral-500">
                                Aún no has registrado ninguna sede.
                            </p>
                            <Link href="/propietario/sedes/nueva">
                                <Button size="sm" variant="outline">
                                    Agregar primera sede
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sedes.map((sede) => (
                        <Card key={sede.id}>
                            <CardBody>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <MapPin size={16} className="text-brand mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">
                                                {sede.nombre}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                                                {sede.direccion}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={sede.es_activa ? "success" : "neutral"}>
                                        {sede.es_activa ? "Activa" : "Inactiva"}
                                    </Badge>
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
                                    <Radio size={12} />
                                    <span>Radio: {sede.radio_metros} m</span>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Link href={`/propietario/sedes/${sede.id}/editar`}>
                                        <Button size="sm" variant="ghost" leftIcon={<Pencil size={13} />}>
                                            Editar
                                        </Button>
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
