"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardHeader, CardBody, Button, Modal, Input, Badge } from "@/components/ui";
import { suscripcionService } from "@/services/suscripcion.service";
import { useToast } from "@/hooks/useToast";
import { Edit2, Plus, Users, HardDrive, CheckCircle } from "lucide-react";
import type { Plan } from "@/types/suscripcion.types";

export default function PlanesPage() {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        precio_mensual: 0,
        limite_usuarios: 0,
        almacenamiento_gb: 0,
        descripcion_corta: "",
        color: "#3b82f6",
        orden: 0,
    });

    const { data: planes, isLoading } = useQuery({
        queryKey: ["planes"],
        queryFn: async () => {
            const data = await suscripcionService.listarPlanes();
            return data.sort((a, b) => Number(a.precio_mensual) - Number(b.precio_mensual));
        },
    });

    const mutation = useMutation({
        mutationFn: (data: Partial<Plan>) => 
            editingPlan 
                ? suscripcionService.actualizarPlan(editingPlan.id, data) 
                : suscripcionService.crearPlan(data),
        onSuccess: () => {
            toast.success(`Plan ${editingPlan ? "actualizado" : "creado"} exitosamente`);
            queryClient.invalidateQueries({ queryKey: ["planes"] });
            setIsModalOpen(false);
        },
        onError: () => toast.error("Ocurrió un error al guardar el plan"),
    });

    const handleOpenModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                nombre: plan.nombre,
                precio_mensual: Number(plan.precio_mensual),
                limite_usuarios: plan.limite_usuarios,
                almacenamiento_gb: plan.almacenamiento_gb,
                descripcion_corta: plan.descripcion_corta || "",
                color: plan.color || "#3b82f6",
                orden: plan.orden || 0,
            });
        } else {
            setEditingPlan(null);
            setFormData({
                nombre: "",
                precio_mensual: 0,
                limite_usuarios: 10,
                almacenamiento_gb: 5,
                descripcion_corta: "",
                color: "#3b82f6",
                orden: 0,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="Planes de Suscripción"
                    description="Gestiona los planes disponibles para las empresas"
                />
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Plan
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando planes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {planes?.map((plan) => (
                        <Card key={plan.id} className="relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: plan.color || "#ccc" }} />
                            <CardBody className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{plan.nombre}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{plan.descripcion_corta || "Sin descripción"}</p>
                                    </div>
                                    <Badge variant="brand">${plan.precio_mensual}/mes</Badge>
                                </div>
                                
                                <div className="space-y-2 py-4 border-y border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>Hasta {plan.limite_usuarios} usuarios</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <HardDrive className="w-4 h-4 text-gray-400" />
                                        <span>{plan.almacenamiento_gb} GB Almacenamiento</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{plan.empresas_count} empresas suscritas</span>
                                    </div>
                                </div>

                                <Button 
                                    variant="outline" 
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={() => handleOpenModal(plan)}
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar Plan
                                </Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? "Editar Plan" : "Nuevo Plan"}
            >
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <Input
                        label="Nombre del Plan"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                    />
                    <Input
                        label="Descripción corta"
                        value={formData.descripcion_corta}
                        onChange={(e) => setFormData({ ...formData, descripcion_corta: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Precio Mensual ($)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.precio_mensual}
                            onChange={(e) => setFormData({ ...formData, precio_mensual: Number(e.target.value) })}
                            required
                        />
                        <Input
                            label="Límite Usuarios"
                            type="number"
                            min="1"
                            value={formData.limite_usuarios}
                            onChange={(e) => setFormData({ ...formData, limite_usuarios: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Almacenamiento (GB)"
                            type="number"
                            min="1"
                            value={formData.almacenamiento_gb}
                            onChange={(e) => setFormData({ ...formData, almacenamiento_gb: Number(e.target.value) })}
                            required
                        />
                        <Input
                            label="Color principal (HEX)"
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button 
                            variant="brand" 
                            type="submit"
                            loading={mutation.isPending}
                        >
                            Guardar Plan
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
