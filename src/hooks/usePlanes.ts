"use client";
import { useQuery } from "@tanstack/react-query";
import { suscripcionService } from "@/services/suscripcion.service";

export function usePlanes() {
  return useQuery({
    queryKey: ["planes"],
    queryFn:  suscripcionService.listarPlanes,
    staleTime: 1000 * 60 * 10,
  });
}