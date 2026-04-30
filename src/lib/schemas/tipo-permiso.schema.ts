import { z } from "zod";

export const tipoPermisoSchema = z.object({
  nombre:          z.string().min(2, "Ingresa el nombre del tipo de permiso"),
  descripcion:     z.string().optional().default(""),
  requiere_adjunto: z.boolean().default(false),
});

export type TipoPermisoInput = z.infer<typeof tipoPermisoSchema>;