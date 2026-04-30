import { z } from "zod";

export const empleadoSchema = z.object({
  nombres:          z.string().min(2, "Ingresa los nombres"),
  apellidos:        z.string().min(2, "Ingresa los apellidos"),
  tipo_documento:   z.enum(["DNI", "CE", "PASAPORTE", "RUC"], {
    required_error: "Selecciona el tipo de documento",
  }),
  numero_documento: z.string().min(8, "Número de documento inválido"),
  correo:           z.string().email("Correo inválido"),
  cargo:            z.string().min(2, "Ingresa el cargo"),
  area:             z.string().min(2, "Ingresa el área"),
  sede_id:          z.number({ required_error: "Selecciona una sede" }),
  fecha_ingreso:    z.string().min(1, "Ingresa la fecha de ingreso"),
});

export const actualizarEmpleadoSchema = z.object({
  nombres:   z.string().min(2),
  apellidos: z.string().min(2),
  correo:    z.string().email("Correo inválido"),
  cargo:     z.string().min(2),
  area:      z.string().min(2),
});

export type EmpleadoInput          = z.infer<typeof empleadoSchema>;
export type ActualizarEmpleadoInput = z.infer<typeof actualizarEmpleadoSchema>;