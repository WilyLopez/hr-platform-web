"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardHeader, CardBody, Button, Badge, Input, Select } from "@/components/ui";
import { DataTable } from "@/components/tables/DataTable";
import { auditoriaService } from "@/services/auditoria.service";
import { formatDate } from "@/utils/format";
import { Search, Filter, X } from "lucide-react";
import type { Column } from "@/components/tables/DataTable";
import type { RegistroAuditoria } from "@/types/auditoria.types";

export default function SuperadminAuditoriaPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Filtros
    const [empresaId, setEmpresaId] = useState(searchParams.get("empresa") || "");
    const [tipoEvento, setTipoEvento] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    
    // Panel lateral
    const [selectedLog, setSelectedLog] = useState<RegistroAuditoria | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["auditoria-global", { empresaId, tipoEvento, fechaDesde }],
        queryFn: () => auditoriaService.listar({ 
            empresa_id: empresaId ? Number(empresaId) : undefined,
            tipo_evento: tipoEvento || undefined,
            fecha_desde: fechaDesde ? new Date(fechaDesde).toISOString() : undefined,
        }),
    });

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
                        icon={Search}
                    />
                    <Input 
                        placeholder="Tipo de Evento..." 
                        value={tipoEvento} 
                        onChange={(e) => setTipoEvento(e.target.value)} 
                        icon={Filter}
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
                    <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-900 shadow-xl flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Detalle de Evento</h2>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Contexto</h3>
                                <div className="mt-2 space-y-2">
                                    <p><strong>Evento:</strong> {selectedLog.tipo_evento}</p>
                                    <p><strong>Fecha:</strong> {formatDate(selectedLog.timestamp)}</p>
                                    <p><strong>Empresa ID:</strong> {selectedLog.empresa_id || "N/A"}</p>
                                    <p><strong>Usuario ID:</strong> {selectedLog.usuario_id || "N/A"}</p>
                                    <p><strong>IP:</strong> {selectedLog.ip_address || "N/A"}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Descripción</h3>
                                <p className="mt-2">{selectedLog.descripcion}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Payload (Valores)</h3>
                                <pre className="mt-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs">
                                    {JSON.stringify(selectedLog.detalles, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
