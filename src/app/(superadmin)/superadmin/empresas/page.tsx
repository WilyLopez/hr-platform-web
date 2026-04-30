"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Badge } from "@/components/ui";
import { DataTable }    from "@/components/tables/DataTable";
import { TableFilters } from "@/components/tables/TableFilters";
import { TablePagination } from "@/components/tables/TablePagination";
import { empresaService } from "@/services/empresa.service";
import { formatDate } from "@/utils/format";
import { ESTADOS_EMPRESA } from "@/utils/constants";
import type { Column } from "@/components/tables/DataTable";
import type { EmpresaListItem } from "@/types/empresa.types";

const columns: Column<EmpresaListItem>[] = [
  { key: "ruc",          header: "RUC",      width: "w-36" },
  { key: "razon_social", header: "Empresa"                 },
  {
    key: "estado",
    header: "Estado",
    render: (row) => {
      const e = ESTADOS_EMPRESA[row.estado];
      return <Badge variant={e.variant as "success"} dot>{e.label}</Badge>;
    },
  },
  { key: "plan_nombre",    header: "Plan",      render: (row) => row.plan_nombre ?? "—" },
  { key: "fecha_registro", header: "Registro",  render: (row) => formatDate(row.fecha_registro) },
];

export default function EmpresasPage() {
  const router = useRouter();
  const [page,    setPage]    = useState(1);
  const [estado,  setEstado]  = useState("");
  const [search,  setSearch]  = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["empresas", { page, estado, search }],
    queryFn:  () => empresaService.listar({ estado: estado || undefined, page }),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Empresas" description="Todas las empresas registradas en el sistema" />

      <Card>
        <TableFilters
          onSearch={setSearch}
          searchPlaceholder="Buscar por razón social o RUC..."
          filters={[{
            key: "estado",
            label: "Estado",
            options: Object.entries(ESTADOS_EMPRESA).map(([k, v]) => ({ value: k, label: v.label })),
          }]}
          onFilterChange={(key, val) => { if (key === "estado") setEstado(val); }}
        />
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={data?.results ?? []}
            keyField="id"
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(row) => router.push(`/superadmin/empresas/${row.id}`)}
            emptyTitle="Sin empresas"
            emptyDesc="No se encontraron empresas con los filtros aplicados."
          />
        </CardBody>
        {data && (
          <TablePagination
            currentPage={page}
            totalPages={data.total_pages}
            totalItems={data.count}
            pageSize={20}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}