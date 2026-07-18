"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { StatCard } from "@/components/charts/StatCard";
import { Card, CardHeader, CardBody, Badge, Button, Modal, Input, Progress, Select } from "@/components/ui";
import { empresaService } from "@/services/empresa.service";
import { suscripcionService } from "@/services/suscripcion.service";
import { auditoriaService } from "@/services/auditoria.service";
import { ESTADOS_EMPRESA } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { useToast } from "@/hooks/useToast";
import { Building2, Users, Database, ShieldAlert, ArrowRightCircle, AlertTriangle } from "lucide-react";

const MOTIVOS_SUSPENSION = [
    { value: "FALTA_PAGO", label: "Falta de pago" },
    { value: "SOLICITUD_CLIENTE", label: "Solicitud del cliente" },
    { value: "INCUMPLIMIENTO_TERMINOS", label: "Incumplimiento de términos" },
    { value: "FRAUDE", label: "Fraude" },
    { value: "DUPLICADO", label: "Duplicado" },
    { value: "OTRO", label: "Otro" }
];

export default function EmpresaDetailPage() {
    const toast = useToast();
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const empresaId = Number(params.id);

    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [suspendConfirmText, setSuspendConfirmText] = useState("");
    const [suspendMotivo, setSuspendMotivo] = useState("");
    const [suspendComentario, setSuspendComentario] = useState("");
    const [suspendError, setSuspendError] = useState<string | null>(null);
    
    const [isReactivarModalOpen, setIsReactivarModalOpen] = useState(false);
    const [reactivarMotivo, setReactivarMotivo] = useState("");
    const [reactivarComentario, setReactivarComentario] = useState("");

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState("");

    const { data: empresa, isLoading: isLoadingEmpresa } = useQuery({
        queryKey: ["empresa", empresaId],
        queryFn: () => empresaService.obtener(empresaId),
    });

    const { data: metricas, isLoading: isLoadingMetricas } = useQuery({
        queryKey: ["empresa-metricas", empresaId],
        queryFn: () => empresaService.obtenerMetricas(empresaId),
    });

    const { data: planes, isLoading: isLoadingPlanes } = useQuery({
        queryKey: ["planes"],
        queryFn: () => suscripcionService.listarPlanes(),
    });

    const { data: auditoria, isLoading: isLoadingAuditoria } = useQuery({
        queryKey: ["auditoria", empresaId],
        queryFn: () => auditoriaService.listar({ empresa_id: empresaId }),
    });

    const suspendMutation = useMutation({
        mutationFn: () => empresaService.suspender(
            empresaId, 
            suspendMotivo, 
            suspendComentario, 
            empresa?.correo
        ),
        onSuccess: () => {
            toast.success("Empresa suspendida exitosamente");
            queryClient.invalidateQueries({ queryKey: ["empresa", empresaId] });
            closeSuspendModal();
        },
        onError: (err: any) => {
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Error al suspender empresa";
            setSuspendError(errorMsg);
        },
    });

    const reactivarMutation = useMutation({
        mutationFn: () => empresaService.reactivar(
            empresaId, 
            reactivarMotivo, 
            reactivarComentario
        ),
        onSuccess: () => {
            toast.success("Empresa reactivada exitosamente");
            queryClient.invalidateQueries({ queryKey: ["empresa", empresaId] });
            closeReactivarModal();
        },
        onError: () => toast.error("Error al reactivar empresa"),
    });

    const cambiarPlanMutation = useMutation({
        mutationFn: () => suscripcionService.cambiarPlanSuperadmin(empresaId, Number(selectedPlanId)),
        onSuccess: () => {
            toast.success("Plan cambiado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["empresa", empresaId] });
            setIsPlanModalOpen(false);
            setSelectedPlanId("");
        },
        onError: () => toast.error("Error al cambiar de plan"),
    });

    const closeSuspendModal = () => {
        setIsSuspendModalOpen(false);
        setSuspendConfirmText("");
        setSuspendMotivo("");
        setSuspendComentario("");
        setSuspendError(null);
    };

    const handleSuspend = () => {
        setSuspendError(null);
        if (suspendConfirmText !== "SUSPENDER") {
            setSuspendError("Debes escribir SUSPENDER para confirmar");
            return;
        }
        if (!suspendMotivo || !suspendComentario) {
            setSuspendError("Debe seleccionar un motivo y proporcionar un comentario");
            return;
        }
        suspendMutation.mutate();
    };

    const closeReactivarModal = () => {
        setIsReactivarModalOpen(false);
        setReactivarMotivo("");
        setReactivarComentario("");
    };

    const handleReactivar = () => {
        if (!reactivarMotivo || !reactivarComentario) {
            toast.error("Debe seleccionar un motivo y proporcionar un comentario");
            return;
        }
        reactivarMutation.mutate();
    };

    if (isLoadingEmpresa || isLoadingMetricas) return <div>Cargando...</div>;
    if (!empresa) return <div>Empresa no encontrada</div>;

    const eState = ESTADOS_EMPRESA[empresa.estado] || { label: "Desconocido", variant: "default" };
    const pctUsuarios = metricas ? Math.min(100, Math.round((metricas.usuarios / metricas.limite_usuarios) * 100)) : 0;
    const pctEspacio = metricas ? Math.min(100, Math.round((metricas.espacio_gb / metricas.limite_espacio) * 100)) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <PageHeader
                    title={empresa.razon_social}
                    description={`RUC: ${empresa.ruc} | Creada: ${formatDate(empresa.fecha_registro)}`}
                />
                <div className="flex gap-2 items-center">
                    <Badge variant={eState.variant as "success"}>{eState.label}</Badge>
                    <Badge variant="brand">{(empresa as any).plan_nombre || "Sin Plan"}</Badge>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Empleados activos"
                    value={metricas?.empleados ?? "—"}
                    icon={Users}
                    variant="brand"
                />
                <StatCard
                    title="Usuarios sistema"
                    value={metricas?.usuarios ?? "—"}
                    icon={Building2}
                    variant="brand"
                />
                <StatCard
                    title="Marcajes de hoy"
                    value={metricas?.marcajes_hoy ?? "—"}
                    icon={ArrowRightCircle}
                    variant="success"
                />
                <StatCard
                    title="Solicitudes del mes"
                    value={metricas?.solicitudes_mes ?? "—"}
                    icon={Database}
                    variant="warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Uso del Plan */}
                <Card>
                    <CardHeader title="Uso del Plan Actual" description="Monitoreo de límites de suscripción" />
                    <CardBody className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700 dark:text-gray-200">Usuarios del Sistema</span>
                                <span className="text-gray-500">{metricas?.usuarios} / {metricas?.limite_usuarios}</span>
                            </div>
                            <Progress value={pctUsuarios} variant={pctUsuarios > 90 ? "danger" : "brand"} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700 dark:text-gray-200">Almacenamiento (GB)</span>
                                <span className="text-gray-500">{metricas?.espacio_gb} / {metricas?.limite_espacio}</span>
                            </div>
                            <Progress value={pctEspacio} variant={pctEspacio > 90 ? "danger" : "brand"} />
                        </div>
                    </CardBody>
                </Card>

                {/* Acciones Avanzadas */}
                <Card>
                    <CardHeader title="Acciones Avanzadas" description="Operaciones críticas sobre la empresa" />
                    <CardBody className="space-y-4">
                        <Button 
                            variant="outline" 
                            className="w-full justify-between"
                            onClick={() => setIsPlanModalOpen(true)}
                        >
                            <span>Cambiar Plan de Suscripción</span>
                            <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-between"
                            onClick={() => router.push(`/superadmin/auditoria?empresa=${empresa.id}`)}
                        >
                            <span>Ver Auditoría de esta Empresa</span>
                            <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                            {["ACTIVA", "EN_PRUEBA"].includes(empresa.estado) ? (
                                <Button 
                                    variant="danger" 
                                    className="w-full justify-between"
                                    onClick={() => setIsSuspendModalOpen(true)}
                                >
                                    <span>Suspender Empresa</span>
                                    <ShieldAlert className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button 
                                    variant={"outline" as any} 
                                    className="w-full justify-between bg-green-500 text-white hover:bg-green-600 border-none"
                                    onClick={() => setIsReactivarModalOpen(true)}
                                >
                                    <span>Reactivar Empresa</span>
                                    <ShieldAlert className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Timeline Histórico */}
            <Card>
                <CardHeader title="Timeline Histórico" description="Eventos críticos de la empresa" />
                <CardBody>
                    {isLoadingAuditoria ? (
                        <div>Cargando timeline...</div>
                    ) : auditoria?.results?.length ? (
                        <div className="space-y-6">
                            {auditoria.results.map((log) => (
                                <div key={log.id} className="relative flex gap-4 pl-4 border-l-2 border-brand-500">
                                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-brand-500" />
                                    <div>
                                        <p className="text-sm font-semibold">{log.descripcion}</p>
                                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                            <span>{formatDate(log.timestamp)}</span>
                                            <span>•</span>
                                            <span>{log.tipo_evento}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No hay eventos históricos registrados.</p>
                    )}
                </CardBody>
            </Card>

            {/* Modal de Suspensión */}
            <Modal
                open={isSuspendModalOpen}
                onClose={closeSuspendModal}
                title="Suspender Empresa"
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">Estás a punto de suspender los servicios de {empresa.razon_social}.</p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm mb-2">Resumen de Impacto:</h4>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                            <li>Todas las sesiones activas de usuarios serán terminadas.</li>
                            <li>Se bloqueará el acceso a la plataforma web y móvil.</li>
                            <li>Se enviará un correo automático de notificación a {empresa.correo}.</li>
                        </ul>
                    </div>

                    {suspendError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4" role="alert">
                            <div className="flex items-center mb-2">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                <span className="font-bold">Error de Políticas</span>
                            </div>
                            <p className="text-sm">{suspendError}</p>
                            
                            {(suspendError.includes("suscripción activa") || suspendError.includes("plan")) && (
                                <Button 
                                    variant="outline" 
                                    className="mt-3 text-red-700 border-red-700 hover:bg-red-200"
                                    onClick={() => {
                                        closeSuspendModal();
                                        setIsPlanModalOpen(true);
                                    }}
                                >
                                    Ir a Suscripción o Cambiar Plan
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Select
                            label="Motivo (categoría)"
                            placeholder="Seleccione un motivo..."
                            value={suspendMotivo}
                            onChange={(e) => setSuspendMotivo(e.target.value)}
                            options={MOTIVOS_SUSPENSION}
                        />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción (comentario)
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none h-24"
                                placeholder="Especifique los detalles de la suspensión..."
                                value={suspendComentario}
                                onChange={(e) => setSuspendComentario(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Para confirmar esta acción crítica, por favor escribe <strong>SUSPENDER</strong>:
                            </p>
                            <Input
                                value={suspendConfirmText}
                                onChange={(e) => setSuspendConfirmText(e.target.value)}
                                placeholder="Escribe SUSPENDER"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={closeSuspendModal}>Cancelar</Button>
                    <Button 
                        variant="danger" 
                        onClick={handleSuspend}
                        loading={suspendMutation.isPending}
                        disabled={suspendConfirmText !== "SUSPENDER" || !suspendMotivo || !suspendComentario}
                    >
                        Ejecutar Suspensión
                    </Button>
                </div>
            </Modal>

            {/* Modal de Reactivación */}
            <Modal
                open={isReactivarModalOpen}
                onClose={closeReactivarModal}
                title="Reactivar Empresa"
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">Restaura el acceso a la plataforma para {empresa.razon_social}.</p>
                    <Select
                        label="Motivo (categoría)"
                        placeholder="Seleccione un motivo..."
                        value={reactivarMotivo}
                        onChange={(e) => setReactivarMotivo(e.target.value)}
                        options={[
                            { value: "PAGO_RECIBIDO", label: "Pago recibido" },
                            { value: "RESOLUCION_DISPUTA", label: "Resolución de disputa" },
                            { value: "ERROR_SISTEMA", label: "Error de sistema previo" },
                            { value: "OTRO", label: "Otro" }
                        ]}
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descripción (comentario)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none h-24"
                            placeholder="Detalle la razón de la reactivación..."
                            value={reactivarComentario}
                            onChange={(e) => setReactivarComentario(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={closeReactivarModal}>Cancelar</Button>
                    <Button 
                        variant={"outline" as any} 
                        className="bg-green-500 text-white hover:bg-green-600 border-none"
                        onClick={handleReactivar}
                        loading={reactivarMutation.isPending}
                        disabled={!reactivarMotivo || !reactivarComentario}
                    >
                        Reactivar Empresa
                    </Button>
                </div>
            </Modal>

            {/* Modal Cambiar Plan */}
            <Modal
                open={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                title="Cambiar Plan de Suscripción"
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">Selecciona el nuevo plan para {empresa.razon_social}. El cambio aplicará inmediatamente.</p>
                    <Select
                        label="Nuevo Plan"
                        placeholder="Selecciona un plan..."
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        options={[...(planes ?? [])]
                            .sort((a, b) => Number(a.precio_mensual) - Number(b.precio_mensual))
                            .map((p) => ({
                            value: p.id.toString(),
                            label: `${p.nombre} ($${p.precio_mensual}/mes)`
                        }))}
                        disabled={isLoadingPlanes}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>Cancelar</Button>
                    <Button 
                        variant="brand" 
                        onClick={() => cambiarPlanMutation.mutate()}
                        loading={cambiarPlanMutation.isPending}
                        disabled={!selectedPlanId}
                    >
                        Aplicar cambio
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
