"use client";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { StatCard } from "@/components/charts/StatCard";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui";
import { empresaService } from "@/services/empresa.service";
import { formatDate } from "@/utils/format";
import { ESTADOS_EMPRESA } from "@/utils/constants";
import { Building2, Users, CreditCard, TrendingUp, ShieldCheck } from "lucide-react";
import type { Column } from "@/components/tables/DataTable";
import type { EmpresaListItem } from "@/types/empresa.types";

const columns: Column<EmpresaListItem>[] = [
    { key: "ruc", header: "RUC", width: "w-36" },
    { key: "razon_social", header: "Empresa" },
    {
        key: "estado",
        header: "Estado",
        render: (row) => {
            const e = ESTADOS_EMPRESA[row.estado];
            return <Badge variant={e.variant as "success"}>{e.label}</Badge>;
        },
    },
    {
        key: "plan_nombre",
        header: "Plan",
        render: (row) => row.plan_nombre ?? "—",
    },
    {
        key: "fecha_registro",
        header: "Registro",
        render: (row) => formatDate(row.fecha_registro),
    },
];

export default function SuperadminDashboardPage() {
    const { data: listData, isLoading: isLoadingList } = useQuery({
        queryKey: ["empresas-lista"],
        queryFn: () => empresaService.listar({ page: 1 }),
    });

    const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
        queryKey: ["superadmin-dashboard"],
        queryFn: () => empresaService.obtenerDashboardSuperadmin(),
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Resumen global del sistema NexusRH"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Empresas totales"
                    value={dashboardData?.total_empresas ?? "—"}
                    icon={Building2}
                    variant="brand"
                    isLoading={isLoadingDashboard}
                />
                <StatCard
                    title="Usuarios activos"
                    value={dashboardData?.total_usuarios ?? "—"}
                    icon={Users}
                    variant="success"
                    isLoading={isLoadingDashboard}
                />
                <StatCard
                    title="Facturación mensual est."
                    value={dashboardData ? `$${dashboardData.mrr_estimado.toFixed(2)}` : "—"}
                    icon={CreditCard}
                    variant="brand"
                    isLoading={isLoadingDashboard}
                />
                <StatCard
                    title="Pruebas activas"
                    value={dashboardData?.pruebas_activas ?? "—"}
                    icon={TrendingUp}
                    variant="warning"
                    isLoading={isLoadingDashboard}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader
                        title="Actividad Reciente"
                        description="Últimas empresas registradas"
                    />
                    <CardBody className="p-0">
                        <DataTable
                            columns={columns}
                            data={listData?.results?.slice(0, 5) ?? []}
                            keyField="id"
                            isLoading={isLoadingList}
                            emptyTitle="Sin empresas registradas"
                        />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader
                        title="Alertas de Sistema"
                        description="Monitor de operaciones críticas"
                    />
                    <CardBody>
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-success-light dark:bg-success/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-success" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Todo en orden</p>
                            <p className="text-xs text-muted-foreground">No hay alertas críticas en el sistema</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
