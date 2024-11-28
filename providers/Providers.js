"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SubscriptionProvider } from "./subscriptionProvider";
import { TestProvider } from "./testProvider";
import { AdminDataProvider } from "./adminDataProvider";
import { ProfileProvider } from "./profileProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <AdminDataProvider>{children}</AdminDataProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}
