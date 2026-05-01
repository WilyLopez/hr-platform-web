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
  nombres:    z.string().min(2, "Ingresa los nombres"),
  apellidos:  z.string().min(2, "Ingresa los apellidos"),
  contrasena: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  plan_id: z.number({ required_error: "Selecciona un plan" }),
});

// Esquema para el Paso 2 (Datos Empresa)
export const datosEmpresaSchema = registrarEmpresaSchema.omit({
  nombres: true,
  apellidos: true,
  contrasena: true,
});

// Esquema para el Paso 3 (Datos Propietario)
export const datosPropietarioSchema = registrarEmpresaSchema.pick({
  nombres: true,
  apellidos: true,
  contrasena: true,
});

export type ValidarRucInput       = z.infer<typeof validarRucSchema>;
export type RegistrarEmpresaInput = z.infer<typeof registrarEmpresaSchema>;
export type DatosEmpresaInput     = z.infer<typeof datosEmpresaSchema>;
export type DatosPropietarioInput = z.infer<typeof datosPropietarioSchema>;