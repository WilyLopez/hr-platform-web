import { LandingTopbar } from "@/components/layout/landing/Topbar";
import { LandingFooter } from "@/components/layout/landing/Footer";
import { ToastProvider } from "@/components/feedback/ToastProvider";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <LandingTopbar />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </div>
    </ToastProvider>
  );
}