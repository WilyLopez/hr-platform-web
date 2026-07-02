import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexusRH | Gestión inteligente de RRHH",
  description: "Digitaliza y centraliza la gestión de empleados, asistencia y solicitudes de tu empresa con NexusRH.",
};

import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection />
      <TrustSection />
      <FeatureSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  );
}
