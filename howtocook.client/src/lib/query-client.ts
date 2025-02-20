import { Client } from "@/generated/api";
import { QueryClient } from "@tanstack/react-query";

import "@tanstack/react-query";

interface QueryMeta extends Record<string, unknown> {
  limit?: number;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: QueryMeta;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export const apiClient = new Client();
