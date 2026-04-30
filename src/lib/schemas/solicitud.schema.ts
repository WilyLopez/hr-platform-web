import { z } from "zod";

export const crearSolicitudSchema = z
  .object({
    tipo_permiso_id: z.number({ required_error: "Selecciona el tipo de permiso" }),
    fecha_inicio:    z.string().min(1, "Selecciona la fecha de inicio"),
    fecha_fin:       z.string().min(1, "Selecciona la fecha de fin"),
    motivo:          z.string().min(10, "El motivo debe tener al menos 10 caracteres"),
    adjunto_url:     z.string().url().optional().nullable(),
  })
  .refine(
    (data) => new Date(data.fecha_fin) >= new Date(data.fecha_inicio),
    {
      message: "La fecha de fin no puede ser anterior a la fecha de inicio",
      path: ["fecha_fin"],
    }
  );

export const evaluarSolicitudSchema = z.object({
  comentario: z.string().optional().nullable(),
});

export const rechazarSolicitudSchema = z.object({
  comentario: z.string().min(5, "Ingresa un comentario para el rechazo"),
});

export type CrearSolicitudInput   = z.infer<typeof crearSolicitudSchema>;
export type EvaluarSolicitudInput = z.infer<typeof evaluarSolicitudSchema>;
export type RechazarSolicitudInput = z.infer<typeof rechazarSolicitudSchema>;