"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEmpleados, useDesactivarEmpleado } from "@/hooks/useEmpleados";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Badge } from "@/components/ui";
import { DataTable }     from "@/components/tables/DataTable";
import { TableFilters }  from "@/components/tables/TableFilters";
import { TablePagination } from "@/components/tables/TablePagination";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { formatDate, formatNombreCompleto } from "@/utils/format";
import { ESTADOS_EMPLEADO } from "@/utils/constants";
import { UserPlus, Power } from "lucide-react";
import Link from "next/link";
import type { Column } from "@/components/tables/DataTable";
import type { Empleado } from "@/types/empleado.types";

export default function EmpleadosPage() {
  const router = useRouter();
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState("");
  const [area,   setArea]   = useState("");
  const [confirmarId, setConfirmarId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useEmpleados({
    search: search || undefined,
    area:   area   || undefined,
    page,
    page_size: 20,
  });

  const { mutate: desactivar, isPending } = useDesactivarEmpleado();

  const columns: Column<Empleado>[] = [
    {
      key: "nombres",
      header: "Empleado",
      render: (r) => (
        <div>
          <p className="font-medium text-neutral-800">{formatNombreCompleto(r.nombres, r.apellidos)}</p>
          <p className="text-xs text-neutral-400">{r.codigo_unico}</p>
        </div>
      ),
    },
    { key: "cargo",  header: "Cargo" },
    { key: "area",   header: "Área"  },
    { key: "sede_nombre",   header: "Sede",    render: (r) => r.sede_nombre ?? "—" },
    { key: "fecha_ingreso", header: "Ingreso", render: (r) => formatDate(r.fecha_ingreso) },
    {
      key: "estado",
      header: "Estado",
      render: (r) => {
        const e = ESTADOS_EMPLEADO[r.estado];
        return <Badge variant={e.variant as "success"} dot>{e.label}</Badge>;
      },
    },
    {
      key: "acciones",
      header: "",
      width: "w-20",
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmarId(r.id); }}
          className="text-neutral-400 hover:text-danger transition-colors p-1"
          title="Desactivar empleado"
        >
          <Power size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empleados"
        description={`${data?.count ?? 0} empleado${data?.count !== 1 ? "s" : ""} registrados`}
        action={
          <Link href="/admin/empleados/nuevo">
            <Button leftIcon={<UserPlus size={15} />}>Nuevo empleado</Button>
          </Link>
        }
      />

      <Card>
        <TableFilters
          onSearch={setSearch}
          searchPlaceholder="Buscar por nombre, DNI o código..."
          filters={[{
            key: "area",
            label: "Área",
            options: [
              { value: "Tecnología",   label: "Tecnología"   },
              { value: "RRHH",         label: "RRHH"         },
              { value: "Operaciones",  label: "Operaciones"  },
              { value: "Administración", label: "Administración" },
            ],
          }]}
          onFilterChange={(key, val) => { if (key === "area") setArea(val); }}
        />
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={data?.results ?? []}
            keyField="id"
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(r) => router.push(`/admin/empleados/${r.id}`)}
            emptyTitle="Sin empleados"
            emptyDesc="Registra tu primer empleado para comenzar."
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

      <ConfirmDialog
        open={confirmarId !== null}
        onClose={() => setConfirmarId(null)}
        onConfirm={() => {
          if (confirmarId) {
            desactivar(confirmarId, { onSuccess: () => setConfirmarId(null) });
          }
        }}
        title="Desactivar empleado"
        description="El empleado no podrá acceder al sistema. Podrás reactivarlo en cualquier momento."
        confirmLabel="Desactivar"
        loading={isPending}
      />
    </div>
  );
}