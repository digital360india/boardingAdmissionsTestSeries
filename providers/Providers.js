"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AdminDataProvider } from "./adminDataProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AdminDataProvider>{children}</AdminDataProvider>
    </QueryClientProvider>
  );
}
