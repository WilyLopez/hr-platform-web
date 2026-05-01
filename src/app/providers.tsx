"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  // Aseguramos que el QueryClient se cree solo una vez en el cliente
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
