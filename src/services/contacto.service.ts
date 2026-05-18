import { apiClient } from "@/lib/axios";

export interface ContactoInput {
  nombre: string;
  email: string;
  empresa: string;
  telefono: string;
  mensaje: string;
}

export const contactoService = {
  async enviarContacto(data: ContactoInput): Promise<{ mensaje: string }> {
    const response = await apiClient.post<{ mensaje: string }>(
      "/notificaciones/contacto/",
      data
    );
    return response.data;
  },
};
