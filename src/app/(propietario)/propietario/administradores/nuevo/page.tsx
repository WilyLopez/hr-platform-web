"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NuevoAdminRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/propietario/administradores");
    }, [router]);
    return null;
}
