"use client";
import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardHeader, CardBody, Button, Badge, Input, Select, Modal } from "@/components/ui";
import { DataTable } from "@/components/tables/DataTable";
import { auditoriaService } from "@/services/auditoria.service";
import { formatDate } from "@/utils/format";
import { useToast } from "@/hooks/useToast";
import { Search, Filter, X, Activity, Clock, Building, User, FileJson, Download } from "lucide-react";
import type { Column } from "@/components/tables/DataTable";
import type { RegistroAuditoria } from "@/types/auditoria.types";

const EVENT_TYPES = [
    { value: "", label: "Todos los eventos" },
    { value: "INICIO_SESION", label: "Inicio de Sesión" },
    { value: "CIERRE_SESION", label: "Cierre de Sesión" },
    { value: "INTENTO_FALLIDO", label: "Intento Fallido" },
    { value: "CREACION_USUARIO", label: "Creación de Usuario" },
    { value: "MODIFICACION_USUARIO", label: "Modificación de Usuario" },
    { value: "ELIMINACION_USUARIO", label: "Eliminación de Usuario" },
    { value: "CREACION_EMPLEADO", label: "Creación de Empleado" },
    { value: "MODIFICACION_EMPLEADO", label: "Modificación de Empleado" },
    { value: "REGISTRO_ASISTENCIA", label: "Registro de Asistencia" },
    { value: "REGISTRO_MANUAL", label: "Registro Manual" },
    { value: "CREACION_SOLICITUD", label: "Creación de Solicitud" },
    { value: "APROBACION_SOLICITUD", label: "Aprobación de Solicitud" },
    { value: "RECHAZO_SOLICITUD", label: "Rechazo de Solicitud" },
    { value: "SUSPENSION_EMPRESA", label: "Suspensión de Empresa" },
    { value: "ELIMINACION_EMPRESA", label: "Eliminación de Empresa" },
    { value: "REACTIVACION_EMPRESA", label: "Reactivación de Empresa" },
    { value: "CAMBIO_PLAN", label: "Cambio de Plan" },
];

export default function SuperadminAuditoriaPage() {
    return (
        <Suspense fallback={null}>
            <SuperadminAuditoriaContent />
        </Suspense>
    );
}

function SuperadminAuditoriaContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useToast();

    // Filtros
    const [empresaId, setEmpresaId] = useState(searchParams.get("empresa") || "");
    const [tipoEvento, setTipoEvento] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");

    // Panel lateral
    const [selectedLog, setSelectedLog] = useState<RegistroAuditoria | null>(null);

    // Exportacion
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportDesde, setExportDesde] = useState("");
    const [exportHasta, setExportHasta] = useState("");
    const [exportFormato, setExportFormato] = useState<"PDF" | "CSV">("CSV");
    const [isExporting, setIsExporting] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["auditoria-global", { empresaId, tipoEvento, fechaDesde }],
        queryFn: () => auditoriaService.listar({ 
            empresa_id: empresaId ? Number(empresaId) : undefined,
            tipo_evento: tipoEvento || undefined,
            fecha_desde: fechaDesde ? new Date(fechaDesde).toISOString() : undefined,
        }),
    });

    const handleExport = async () => {
        if (!exportDesde || !exportHasta) {
            toast.error("Selecciona el rango de fechas a exportar");
            return;
        }
        setIsExporting(true);
        try {
            const blob = await auditoriaService.exportar({
                fecha_desde: new Date(exportDesde).toISOString(),
                fecha_hasta: new Date(exportHasta).toISOString(),
                formato: exportFormato,
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `auditoria_${exportDesde}_${exportHasta}.${exportFormato.toLowerCase()}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Exportación generada correctamente");
            setIsExportModalOpen(false);
        } catch {
            toast.error("No se pudo generar la exportación");
        } finally {
            setIsExporting(false);
        }
    };

    const handleQuickFilter = (days: number) => {
        if (days === 0) {
            setFechaDesde("");
            return;
        }
        const date = new Date();
        date.setDate(date.getDate() - days);
        setFechaDesde(date.toISOString().split("T")[0]);
    };

    const columns: Column<RegistroAuditoria>[] = [
        { key: "timestamp", header: "Fecha", render: (row) => formatDate(row.timestamp) },
        { 
            key: "tipo_evento", 
            header: "Evento",
            render: (row) => <Badge variant="brand">{row.tipo_evento}</Badge>
        },
        { key: "descripcion", header: "Descripción" },
        { 
            key: "id", 
            header: "Acción", 
            render: (row) => (
                <Button variant="outline" size="sm" onClick={() => setSelectedLog(row)}>
                    Detalles
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6 relative h-full">
            <PageHeader
                title="Auditoría Global"
                description="Registro histórico de acciones en todas las empresas"
                action={
                    <Button
                        variant="outline"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={() => setIsExportModalOpen(true)}
                    >
                        Exportar
                    </Button>
                }
            />

            {/* Quick Filters */}
            <div className="flex gap-2">
                <Button variant={!fechaDesde ? "brand" : "outline"} size="sm" onClick={() => handleQuickFilter(0)}>Todos</Button>
                <Button variant={fechaDesde && new Date().getDate() - new Date(fechaDesde).getDate() === 0 ? "brand" : "outline"} size="sm" onClick={() => handleQuickFilter(1)}>Hoy</Button>
                <Button variant={fechaDesde && new Date().getDate() - new Date(fechaDesde).getDate() > 1 && new Date().getDate() - new Date(fechaDesde).getDate() <= 7 ? "brand" : "outline"} size="sm" onClick={() => handleQuickFilter(7)}>Últimos 7 días</Button>
                <Button variant={fechaDesde && new Date().getDate() - new Date(fechaDesde).getDate() > 7 && new Date().getDate() - new Date(fechaDesde).getDate() <= 30 ? "brand" : "outline"} size="sm" onClick={() => handleQuickFilter(30)}>Últimos 30 días</Button>
            </div>

            <Card>
                <CardHeader title="Filtros Avanzados" />
                <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input 
                        placeholder="ID Empresa..." 
                        value={empresaId} 
                        onChange={(e) => setEmpresaId(e.target.value)} 
                        {...({ icon: Search } as any)}
                    />
                    <Select 
                        value={tipoEvento} 
                        onChange={(e) => setTipoEvento(e.target.value)} 
                        options={EVENT_TYPES}
                        {...({ icon: Filter } as any)}
                    />
                    <Input 
                        type="date"
                        value={fechaDesde} 
                        onChange={(e) => setFechaDesde(e.target.value)} 
                    />
                </CardBody>
            </Card>

            <Card>
                <CardBody className="p-0">
                    <DataTable
                        columns={columns}
                        data={data?.results || (data as unknown as RegistroAuditoria[]) || []}
                        keyField="id"
                        isLoading={isLoading}
                        emptyTitle="Sin registros de auditoría"
                    />
                </CardBody>
            </Card>

            {/* Panel Lateral (Drawer) */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setSelectedLog(null)} />
                    <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-slate-900 shadow-xl flex flex-col">
                        <div className="p-6 border-b border-neutral-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">Detalle de Evento</h2>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto space-y-8 bg-neutral-50/50 dark:bg-slate-900/50">
                            {/* Header Section / Context */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                        <Activity size={14} /> Evento
                                    </div>
                                    <Badge variant="brand">{selectedLog.tipo_evento}</Badge>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                        <Clock size={14} /> Fecha
                                    </div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{formatDate(selectedLog.timestamp)}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                        <Building size={14} /> Empresa
                                    </div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {selectedLog.empresa_id ? `ID: ${selectedLog.empresa_id}` : "Global / N/A"}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                        <User size={14} /> Usuario (Autor)
                                    </div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {selectedLog.usuario_id ? `ID: ${selectedLog.usuario_id}` : "Sistema"}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Descripción */}
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Descripción de la Acción</h3>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm">
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{selectedLog.descripcion}</p>
                                </div>
                            </div>

                            {/* Payload (Valores) */}
                            {selectedLog.detalles && Object.keys(selectedLog.detalles).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                                        <FileJson size={16} className="text-brand" /> 
                                        Valores Registrados
                                    </h3>
                                    <div className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-neutral-50 dark:bg-slate-900/50 text-neutral-500 dark:text-slate-400 border-b border-neutral-200 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold w-1/3">Campo</th>
                                                    <th className="px-4 py-3 font-semibold">Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-slate-800">
                                                {Object.entries(selectedLog.detalles).map(([key, value]) => (
                                                    <tr key={key} className="hover:bg-neutral-50 dark:hover:bg-slate-800/50">
                                                        <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                                                            {key.replace(/_/g, " ")}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-400">
                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Exportación */}
            <Modal
                open={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Exportar Auditoría"
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Selecciona el rango de fechas y el formato del archivo a descargar.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Desde"
                            type="date"
                            value={exportDesde}
                            onChange={(e) => setExportDesde(e.target.value)}
                        />
                        <Input
                            label="Hasta"
                            type="date"
                            value={exportHasta}
                            onChange={(e) => setExportHasta(e.target.value)}
                        />
                    </div>
                    <Select
                        label="Formato"
                        value={exportFormato}
                        onChange={(e) => setExportFormato(e.target.value as "PDF" | "CSV")}
                        options={[
                            { value: "CSV", label: "CSV (hoja de cálculo)" },
                            { value: "PDF", label: "PDF" },
                        ]}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>Cancelar</Button>
                    <Button variant="brand" onClick={handleExport} loading={isExporting}>
                        Descargar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
