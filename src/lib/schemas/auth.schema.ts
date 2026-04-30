import { z } from "zod";

export const loginSchema = z.object({
  codigo_unico: z
    .string()
    .min(1, "El código único es requerido")
    .max(20, "Código inválido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const recuperarContrasenaSchema = z.object({
  correo: z
    .string()
    .min(1, "El correo es requerido")
    .email("Ingresa un correo válido"),
});

export const cambiarContrasenaSchema = z
  .object({
    contrasena_actual: z.string().min(1, "Ingresa tu contraseña actual"),
    contrasena_nueva: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmar_contrasena: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.contrasena_nueva === data.confirmar_contrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_contrasena"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RecuperarContrasenaInput = z.infer<typeof recuperarContrasenaSchema>;
export type CambiarContrasenaInput = z.infer<typeof cambiarContrasenaSchema>;