"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader }      from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Badge } from "@/components/ui";
import { DataTable }       from "@/components/tables/DataTable";
import { TableFilters }    from "@/components/tables/TableFilters";
import { TablePagination } from "@/components/tables/TablePagination";
import { solicitudService } from "@/services/solicitud.service";
import { formatDate }       from "@/utils/format";
import { ESTADOS_SOLICITUD } from "@/utils/constants";
import type { Column } from "@/components/tables/DataTable";
import type { Solicitud } from "@/types/solicitud.types";

const columns: Column<Solicitud>[] = [
  { key: "empleado_nombre",     header: "Empleado"    },
  { key: "tipo_permiso_nombre", header: "Tipo"        },
  {
    key: "fecha_inicio",
    header: "Período",
    render: (r) => `${formatDate(r.fecha_inicio)} — ${formatDate(r.fecha_fin)}`,
  },
  { key: "dias_solicitados", header: "Días" },
  {
    key: "estado",
    header: "Estado",
    render: (r) => {
      const e = ESTADOS_SOLICITUD[r.estado];
      return <Badge variant={e.variant as "warning"} dot>{e.label}</Badge>;
    },
  },
  { key: "fecha_creacion", header: "Creada", render: (r) => formatDate(r.fecha_creacion) },
];

export default function SolicitudesPage() {
  const router  = useRouter();
  const [page,   setPage]   = useState(1);
  const [estado, setEstado] = useState("PENDIENTE");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["solicitudes", { estado, page }],
    queryFn:  () => solicitudService.listar({ estado: estado as Solicitud["estado"] || undefined, page }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitudes"
        description="Vacaciones, permisos y licencias del personal"
      />

      <Card>
        <TableFilters
          filters={[{
            key: "estado",
            label: "Estado",
            options: Object.entries(ESTADOS_SOLICITUD).map(([k, v]) => ({ value: k, label: v.label })),
          }]}
          onFilterChange={(key, val) => { if (key === "estado") { setEstado(val); setPage(1); } }}
        />
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={data?.results ?? []}
            keyField="id"
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(r) => router.push(`/admin/solicitudes/${r.id}`)}
            emptyTitle="Sin solicitudes"
            emptyDesc="No hay solicitudes con el estado seleccionado."
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