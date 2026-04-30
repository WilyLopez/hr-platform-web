import { z } from "zod";

export const validarRucSchema = z.object({
  ruc: z
    .string()
    .length(11, "El RUC debe tener exactamente 11 dígitos")
    .regex(/^\d+$/, "El RUC solo debe contener números"),
});

export const registrarEmpresaSchema = z.object({
  ruc:        z.string().length(11, "RUC inválido").regex(/^\d+$/),
  correo:     z.string().email("Correo inválido"),
  telefono:   z.string().min(7, "Teléfono inválido").max(15),
  direccion:  z.string().min(5, "Ingresa una dirección válida"),
  contrasena: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  plan_id: z.number({ required_error: "Selecciona un plan" }),
});

export const actualizarEmpresaSchema = z.object({
  nombre_comercial: z.string().min(2, "Ingresa el nombre comercial"),
  telefono:         z.string().min(7).max(15),
  direccion:        z.string().min(5),
  logo_url:         z.string().url().optional().nullable(),
});

export type ValidarRucInput       = z.infer<typeof validarRucSchema>;
export type RegistrarEmpresaInput = z.infer<typeof registrarEmpresaSchema>;
export type ActualizarEmpresaInput = z.infer<typeof actualizarEmpresaSchema>;