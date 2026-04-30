"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { StatCard }   from "@/components/charts/StatCard";
import { Card, CardHeader, CardBody, Badge } from "@/components/ui";
import { DataTable }  from "@/components/tables/DataTable";
import { empleadoService }  from "@/services/empleado.service";
import { solicitudService } from "@/services/solicitud.service";
import { ESTADOS_SOLICITUD } from "@/utils/constants";
import { formatDate, formatNombreCompleto } from "@/utils/format";
import { Users, Clock, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import type { Column } from "@/components/tables/DataTable";
import type { Solicitud } from "@/types/solicitud.types";

const solicitudCols: Column<Solicitud>[] = [
  { key: "empleado_nombre",    header: "Empleado"  },
  { key: "tipo_permiso_nombre", header: "Tipo"     },
  { key: "fecha_inicio",       header: "Desde",    render: (r) => formatDate(r.fecha_inicio) },
  { key: "dias_solicitados",   header: "Días"      },
  {
    key: "estado",
    header: "Estado",
    render: (r) => {
      const e = ESTADOS_SOLICITUD[r.estado];
      return <Badge variant={e.variant as "warning"} dot>{e.label}</Badge>;
    },
  },
];

export default function AdminDashboardPage() {
  const { usuario } = useAuth();

  const { data: empleados, isLoading: loadingEmp } = useQuery({
    queryKey: ["empleados", { page: 1 }],
    queryFn:  () => empleadoService.listar({ estado: "ACTIVO", page: 1, page_size: 5 }),
  });

  const { data: solicitudes, isLoading: loadingSol } = useQuery({
    queryKey: ["solicitudes", { estado: "PENDIENTE" }],
    queryFn:  () => solicitudService.listar({ estado: "PENDIENTE", page: 1 }),
  });

  const pendientes = solicitudes?.count ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Resumen de Recursos Humanos" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Empleados activos"
          value={empleados?.count ?? "—"}
          icon={Users}
          iconColor="text-brand"
          isLoading={loadingEmp}
        />
        <StatCard
          title="Solicitudes pendientes"
          value={pendientes}
          icon={AlertTriangle}
          iconColor={pendientes > 0 ? "text-warning" : "text-neutral-400"}
          isLoading={loadingSol}
        />
        <StatCard title="Marcajes hoy"    value="—" icon={Clock}    iconColor="text-success" />
        <StatCard title="Tardanzas hoy"   value="—" icon={FileText} iconColor="text-danger"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Solicitudes pendientes"
            action={
              <Link href="/admin/solicitudes">
                <Button variant="ghost" size="sm">Ver todas</Button>
              </Link>
            }
          />
          <CardBody className="p-0">
            <DataTable
              columns={solicitudCols}
              data={solicitudes?.results ?? []}
              keyField="id"
              isLoading={loadingSol}
              emptyTitle="Sin solicitudes pendientes"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Empleados recientes"
            action={
              <Link href="/admin/empleados">
                <Button variant="ghost" size="sm">Ver todos</Button>
              </Link>
            }
          />
          <CardBody className="p-0">
            <DataTable
              columns={[
                { key: "nombres",      header: "Nombre",  render: (r) => formatNombreCompleto(r.nombres, r.apellidos) },
                { key: "cargo",        header: "Cargo"    },
                { key: "fecha_ingreso",header: "Ingreso", render: (r) => formatDate(r.fecha_ingreso) },
              ]}
              data={empleados?.results ?? []}
              keyField="id"
              isLoading={loadingEmp}
              emptyTitle="Sin empleados registrados"
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}