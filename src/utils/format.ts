import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("es");

export function formatDate(date: string | Date, format = "DD/MM/YYYY"): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}

export function formatRelative(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-PE", {
    style:    "currency",
    currency: "PEN",
  }).format(value);
}

export function formatRuc(ruc: string): string {
  return ruc.replace(/(\d{2})(\d{8})(\d{1})/, "$1-$2-$3");
}

export function formatNombreCompleto(nombres: string, apellidos: string): string {
  return `${nombres} ${apellidos}`.trim();
}

export function formatInitials(nombre: string): string {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function calcularDiasRestantes(fecha: string): number {
  return dayjs(fecha).diff(dayjs(), "day");
}