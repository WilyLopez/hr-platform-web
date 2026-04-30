import { z } from "zod";

export const sedeSchema = z.object({
  nombre:       z.string().min(2, "Ingresa el nombre de la sede"),
  direccion:    z.string().min(5, "Ingresa la dirección"),
  latitud:      z
    .number({ invalid_type_error: "Latitud inválida" })
    .min(-90).max(90),
  longitud:     z
    .number({ invalid_type_error: "Longitud inválida" })
    .min(-180).max(180),
  radio_metros: z
    .number({ invalid_type_error: "Radio inválido" })
    .min(10, "Mínimo 10 metros")
    .max(10000, "Máximo 10,000 metros"),
});

export type SedeInput = z.infer<typeof sedeSchema>;