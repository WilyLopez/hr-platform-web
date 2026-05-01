"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { 
    Card, 
    CardBody, 
    Button, 
    Badge, 
    Modal, 
    Input, 
    Select,
    SkeletonTable,
    Divider
} from "@/components/ui";
import { administradorService } from "@/services/administrador.service";
import { 
    Users, 
    Plus, 
    Mail, 
    Hash, 
    Eye, 
    EyeOff, 
    Search, 
    Filter,
    MoreVertical,
    UserPlus,
    RefreshCw
} from "lucide-react";
import { formatDate } from "@/utils/format";

const ESTADOS: Record<string, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
    ACTIVO:    { label: "Activo",    variant: "success" },
    INACTIVO:  { label: "Inactivo",  variant: "neutral" },
    BLOQUEADO: { label: "Bloqueado", variant: "danger"  },
};

interface FormState {
    correo: string;
    contrasena: string;
    confirmar: string;
}

const EMPTY: FormState = { correo: "", contrasena: "" , confirmar: "" };

export default function AdministradoresPage() {
    const { usuario } = useAuth();
    const toast = useToast();
    const queryClient = useQueryClient();
    const empresaId = usuario?.empresa_id ?? 0;

    // Estados de UI
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");
    
    // Formulario
    const [form, setForm] = useState<FormState>(EMPTY);
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Consulta de datos
    const { data: admins, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["administradores", empresaId],
        queryFn: () => administradorService.listar(empresaId),
        enabled: !!empresaId,
    });

    // Mutación para crear
    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            administradorService.crear(empresaId, {
                correo: form.correo,
                contrasena: form.contrasena,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["administradores", empresaId] });
            toast.success("Administrador creado correctamente.");
            handleClose();
        },
        onError: () => {
            toast.error("No se pudo crear el administrador. Verifica el correo.");
        },
    });

    // Filtrado de datos (Client-side)
    const filteredAdmins = useMemo(() => {
        if (!admins) return [];
        return admins.filter(admin => {
            const matchesSearch = 
                admin.correo.toLowerCase().includes(search.toLowerCase()) ||
                admin.codigo_unico.toLowerCase().includes(search.toLowerCase());
            
            const matchesStatus = statusFilter === "TODOS" || admin.estado === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [admins, search, statusFilter]);

    function handleClose() {
        setOpen(false);
        setForm(EMPTY);
        setErrors({});
        setShowPass(false);
        setShowConfirm(false);
    }

    function validate(): boolean {
        const next: Partial<FormState> = {};
        if (!form.correo.trim()) next.correo = "El correo es obligatorio.";
        if (!form.contrasena) next.contrasena = "La contraseña es obligatoria.";
        else if (form.contrasena.length < 8) next.contrasena = "Mínimo 8 caracteres.";
        if (!form.confirmar) next.confirmar = "Confirma la contraseña.";
        else if (form.contrasena !== form.confirmar) next.confirmar = "Las contraseñas no coinciden.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (validate()) mutate();
    }

    function field(key: keyof FormState) {
        return {
            value: form[key],
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((f) => ({ ...f, [key]: e.target.value }));
                if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
            },
        };
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Administradores"
                description="Gestión de usuarios con permisos administrativos en la plataforma"
                action={
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => refetch()}
                            loading={isRefetching}
                            leftIcon={<RefreshCw size={14} />}
                        >
                            Actualizar
                        </Button>
                        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setOpen(true)}>
                            Nuevo administrador
                        </Button>
                    </div>
                }
            />

            {/* Filtros */}
            <Card>
                <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por correo o código..."
                                leftIcon={<Search size={16} className="text-neutral-400" />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { label: "Todos los estados", value: "TODOS" },
                                    { label: "Activos", value: "ACTIVO" },
                                    { label: "Inactivos", value: "INACTIVO" },
                                    { label: "Bloqueados", value: "BLOQUEADO" },
                                ]}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Contenido Principal */}
            {isLoading ? (
                <SkeletonTable rows={5} />
            ) : !admins || admins.length === 0 ? (
                <Card>
                    <CardBody>
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center">
                                <Users size={32} className="text-neutral-300" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">No hay administradores</h3>
                                <p className="text-sm text-neutral-500 max-w-xs mx-auto mt-1">
                                    Aún no has registrado ningún administrador para tu empresa.
                                </p>
                            </div>
                            <Button size="sm" variant="outline" leftIcon={<UserPlus size={14} />} onClick={() => setOpen(true)}>
                                Agregar el primero
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Card overflowHidden>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="py-3 px-4 font-medium text-neutral-500">Administrador</th>
                                    <th className="py-3 px-4 font-medium text-neutral-500">Código</th>
                                    <th className="py-3 px-4 font-medium text-neutral-500">Estado</th>
                                    <th className="py-3 px-4 font-medium text-neutral-500">Último Acceso</th>
                                    <th className="py-3 px-4 font-medium text-neutral-500 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredAdmins.length > 0 ? (
                                    filteredAdmins.map((admin) => {
                                        const config = ESTADOS[admin.estado] || { label: admin.estado, variant: "neutral" as const };
                                        return (
                                            <tr key={admin.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xs">
                                                            {admin.correo.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-neutral-900">{admin.correo}</span>
                                                            <span className="text-xs text-neutral-400">Rol: Administrador</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-neutral-600">
                                                    <code className="text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 font-mono">
                                                        {admin.codigo_unico}
                                                    </code>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant={config.variant}>{config.label}</Badge>
                                                </td>
                                                <td className="py-4 px-4 text-neutral-500">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs">
                                                            {admin.ultimo_acceso ? formatDate(admin.ultimo_acceso) : "Sin acceso"}
                                                        </span>
                                                        {admin.fecha_creacion && (
                                                            <span className="text-[10px] text-neutral-400 mt-0.5">
                                                                Creado: {formatDate(admin.fecha_creacion)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Button variant="ghost" size="sm" isIcon>
                                                        <MoreVertical size={16} className="text-neutral-400" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-neutral-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search size={24} className="text-neutral-200" />
                                                <p>No se encontraron resultados para tu búsqueda.</p>
                                                <Button variant="link" size="sm" onClick={() => { setSearch(""); setStatusFilter("TODOS"); }}>
                                                    Limpiar filtros
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filteredAdmins.length > 0 && (
                        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500">
                            Mostrando {filteredAdmins.length} de {admins.length} administradores
                        </div>
                    )}
                </Card>
            )}

            {/* Modal de Creación */}
            <Modal open={open} onClose={handleClose} title="Registrar Administrador" size="md">
                <div className="space-y-4">
                    <div className="bg-brand-light/30 p-3 rounded-lg flex items-start gap-3">
                        <Mail size={18} className="text-brand mt-0.5" />
                        <p className="text-xs text-brand-dark leading-relaxed">
                            Se enviará un correo de bienvenida al nuevo administrador con su código de acceso único.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            placeholder="nombre@empresa.com"
                            leftIcon={<Mail size={14} />}
                            error={errors.correo}
                            required
                            {...field("correo")}
                        />

                        <Divider label="Seguridad" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Contraseña"
                                type={showPass ? "text" : "password"}
                                placeholder="Mínimo 8 caracteres"
                                error={errors.contrasena}
                                required
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((v) => !v)}
                                        className="text-neutral-400 hover:text-neutral-600"
                                        tabIndex={-1}
                                    >
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                }
                                {...field("contrasena")}
                            />

                            <Input
                                label="Confirmar"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repite contraseña"
                                error={errors.confirmar}
                                required
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="text-neutral-400 hover:text-neutral-600"
                                        tabIndex={-1}
                                    >
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                }
                                {...field("confirmar")}
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button type="button" variant="ghost" fullWidth onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" loading={isPending} fullWidth>
                                Crear Cuenta
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

