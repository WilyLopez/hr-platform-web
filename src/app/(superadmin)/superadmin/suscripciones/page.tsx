"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Badge, Select } from "@/components/ui";
import { DataTable } from "@/components/tables/DataTable";
import { suscripcionService } from "@/services/suscripcion.service";
import { formatDate, formatCurrency } from "@/utils/format";
import type { Column } from "@/components/tables/DataTable";
import type { SuscripcionSuperadmin } from "@/types/suscripcion.types";

const ESTADOS_SUSCRIPCION: Record<string, { label: string; variant: string }> = {
    TRIAL: { label: "Periodo de prueba", variant: "warning" },
    ACTIVA: { label: "Activa", variant: "success" },
    VENCIDA: { label: "Vencida", variant: "danger" },
    SUSPENDIDA: { label: "Suspendida", variant: "danger" },
};

const columns: Column<SuscripcionSuperadmin>[] = [
    {
        key: "empresa_nombre",
        header: "Empresa",
        render: (row) => (
            <div>
                <p className="font-medium">{row.empresa_nombre}</p>
                <p className="text-xs text-muted-foreground">ID: {row.empresa_id}</p>
            </div>
        ),
    },
    {
        key: "plan_nombre",
        header: "Plan",
        render: (row) => (
            <Badge variant="brand">{row.plan_nombre}</Badge>
        ),
    },
    {
        key: "estado",
        header: "Estado",
        render: (row) => {
            const e = ESTADOS_SUSCRIPCION[row.estado] ?? { label: row.estado, variant: "neutral" };
            return <Badge variant={e.variant as "success"} dot>{e.label}</Badge>;
        },
    },
    {
        key: "usuarios_activos",
        header: "Usuarios",
        render: (row) => (
            <span className="text-sm">
                {row.usuarios_activos} / {row.limite_usuarios}
            </span>
        ),
    },
    {
        key: "fecha_inicio",
        header: "Inicio",
        render: (row) => formatDate(row.fecha_inicio),
    },
    {
        key: "fecha_fin_trial",
        header: "Fin Trial",
        render: (row) => row.fecha_fin_trial ? formatDate(row.fecha_fin_trial) : "—",
    },
    {
        key: "fecha_proxima_facturacion",
        header: "Próx. Facturación",
        render: (row) => row.fecha_proxima_facturacion ? formatDate(row.fecha_proxima_facturacion) : "—",
    },
];

export default function SuscripcionesPage() {
    const router = useRouter();
    const [estadoFilter, setEstadoFilter] = useState("");

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["superadmin-suscripciones", estadoFilter],
        queryFn: () => suscripcionService.listarSuscripcionesSuperadmin(estadoFilter || undefined),
    });

    const estadoOptions = [
        { value: "", label: "Todos los estados" },
        { value: "TRIAL", label: "Periodo de prueba" },
        { value: "ACTIVA", label: "Activa" },
        { value: "VENCIDA", label: "Vencida" },
        { value: "SUSPENDIDA", label: "Suspendida" },
    ];

    // KPI cards
    const total = data?.length ?? 0;
    const activas = data?.filter((s) => s.estado === "ACTIVA").length ?? 0;
    const trial = data?.filter((s) => s.estado === "TRIAL").length ?? 0;
    const suspendidas = data?.filter((s) => s.estado === "SUSPENDIDA").length ?? 0;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Suscripciones"
                description="Gestión de suscripciones de todas las empresas"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: total, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                    { label: "Activas", value: activas, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "En prueba", value: trial, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
                    { label: "Suspendidas", value: suspendidas, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
                ].map((kpi) => (
                    <Card key={kpi.label}>
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                                    <span className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Filters + Table */}
            <Card>
                <div className="p-4 border-b border-neutral-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <label className="text-sm font-medium text-foreground whitespace-nowrap">
                            Filtrar por estado:
                        </label>
                        <select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="form-input w-auto text-sm"
                        >
                            {estadoOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <CardBody className="p-0">
                    <DataTable
                        columns={columns}
                        data={data ?? []}
                        keyField="id"
                        isLoading={isLoading}
                        isError={isError}
                        onRetry={refetch}
                        onRowClick={(row) => router.push(`/superadmin/empresas/${row.empresa_id}`)}
                        emptyTitle="Sin suscripciones"
                        emptyDesc="No se encontraron suscripciones con los filtros aplicados."
                    />
                </CardBody>
            </Card>
        </div>
    );
}
