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
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";
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
    const { data, isLoading } = useQuery({
        queryKey: ["empresas-lista"],
        queryFn: () => empresaService.listar({ page: 1 }),
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Resumen global del sistema NexusRH"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Empresas activas"
                    value={data?.count ?? "—"}
                    icon={Building2}
                    iconColor="text-brand"
                    isLoading={isLoading}
                />
                <StatCard
                    title="En periodo de prueba"
                    value="—"
                    icon={TrendingUp}
                    iconColor="text-warning"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Usuarios totales"
                    value="—"
                    icon={Users}
                    iconColor="text-success"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Ingresos del mes"
                    value="—"
                    icon={CreditCard}
                    iconColor="text-brand"
                    isLoading={isLoading}
                />
            </div>

            <Card>
                <CardHeader
                    title="Empresas registradas"
                    description="Últimas empresas en el sistema"
                />
                <CardBody className="p-0">
                    <DataTable
                        columns={columns}
                        data={data?.results ?? []}
                        keyField="id"
                        isLoading={isLoading}
                        emptyTitle="Sin empresas registradas"
                    />
                </CardBody>
            </Card>
        </div>
    );
}
