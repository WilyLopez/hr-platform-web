"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { 
    Card, 
    CardBody, 
    Button, 
    Badge, 
    Input, 
    Select,
    SkeletonTable,
    Divider
} from "@/components/ui";
import { auditoriaService } from "@/services/auditoria.service";
import { 
    ClipboardList, 
    Search, 
    Filter, 
    Download, 
    RefreshCw,
    User,
    Shield,
    Clock,
    Globe,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { formatDate } from "@/utils/format";
import { useAuthStore } from "@/store/auth.store";

const EVENT_TYPES = [
    { label: "Todos los eventos", value: "" },
    { label: "Inicio de sesión", value: "INICIO_SESION" },
    { label: "Cierre de sesión", value: "CIERRE_SESION" },
    { label: "Creación de usuario", value: "CREACION_USUARIO" },
    { label: "Modificación de usuario", value: "MODIFICACION_USUARIO" },
    { label: "Creación de empleado", value: "CREACION_EMPLEADO" },
    { label: "Registro asistencia", value: "REGISTRO_ASISTENCIA" },
    { label: "Solicitud creada", value: "CREACION_SOLICITUD" },
    { label: "Suspensión empresa", value: "SUSPENSION_EMPRESA" },
];

export default function AuditoriaPage() {
    const { usuario } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const empresaId = usuario?.empresa_id ?? 0;

    // Filtros
    const [page, setPage] = useState(1);
    const [tipoEvento, setTipoEvento] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    useEffect(() => {
        if (empresaId) {
            setIsReady(true);
        }
    }, [empresaId]);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["auditoria", empresaId, page, tipoEvento, fechaDesde, fechaHasta],
        queryFn: () => auditoriaService.listar({
            empresa_id: empresaId,
            page,
            tipo_evento: tipoEvento || undefined,
            fecha_desde: fechaDesde || undefined,
            fecha_hasta: fechaHasta || undefined,
        }),
        enabled: isReady && !!empresaId,
    });

    const resetFilters = () => {
        setTipoEvento("");
        setFechaDesde("");
        setFechaHasta("");
        setPage(1);
    };

    if (!isReady || (isLoading && !data)) {
        return (
            <div className="space-y-6">
                <PageHeader title="Auditoría" description="Cargando historial de actividades..." />
                <SkeletonTable rows={10} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Auditoría"
                description="Historial completo de acciones y eventos realizados en la plataforma"
                action={
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => refetch()} 
                            loading={isFetching}
                            leftIcon={<RefreshCw size={14} />}
                        >
                            Actualizar
                        </Button>
                        <Button size="sm" leftIcon={<Download size={14} />} variant="outline">
                            Exportar
                        </Button>
                    </div>
                }
            />

            {/* Filtros */}
            <Card>
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                            <Select
                                label="Evento"
                                value={tipoEvento}
                                onChange={(e) => { setTipoEvento(e.target.value); setPage(1); }}
                                options={EVENT_TYPES}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <Input
                                label="Desde"
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <Input
                                label="Hasta"
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                fullWidth 
                                onClick={resetFilters}
                                className="mb-1"
                            >
                                Limpiar Filtros
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Tabla de Resultados */}
            <Card overflowHidden>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="py-3 px-4 font-medium text-neutral-500">Fecha y Hora</th>
                                <th className="py-3 px-4 font-medium text-neutral-500">Usuario</th>
                                <th className="py-3 px-4 font-medium text-neutral-500">Evento</th>
                                <th className="py-3 px-4 font-medium text-neutral-500">Descripción</th>
                                <th className="py-3 px-4 font-medium text-neutral-500">Origen (IP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {data?.results && data.results.length > 0 ? (
                                data.results.map((log) => (
                                    <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-neutral-600">
                                                <Clock size={14} className="text-neutral-400" />
                                                {formatDate(log.timestamp, "DD/MM/YYYY HH:mm:ss")}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                                                    <User size={14} className="text-neutral-400" />
                                                    ID: {log.usuario_id || "Sistema"}
                                                </div>
                                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                                                    {log.rol_usuario || "PROCESO"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge variant="neutral" className="font-mono text-[10px]">
                                                {log.tipo_evento}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4 text-neutral-600 max-w-xs">
                                            <p className="truncate" title={log.descripcion}>
                                                {log.descripcion}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-neutral-500 font-mono text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Globe size={13} className="text-neutral-300" />
                                                {log.ip_address || "0.0.0.0"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-neutral-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <ClipboardList size={40} className="text-neutral-200" />
                                            <p>No se encontraron registros de auditoría con los filtros seleccionados.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {data && data.count > 0 && (
                    <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                        <p className="text-xs text-neutral-500">
                            Mostrando <span className="font-medium text-neutral-900">{data.results.length}</span> de <span className="font-medium text-neutral-900">{data.count}</span> registros
                        </p>
                        <div className="flex items-center gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                isIcon 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-xs font-medium px-2">Página {page}</span>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                isIcon 
                                disabled={!data.next}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
