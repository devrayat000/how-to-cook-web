// import { Client } from "@/generated/api";
import { Api } from "@/generated/api";
import { QueryClient,QueryCache } from "@tanstack/react-query";

import "@tanstack/react-query";

interface QueryMeta extends Record<string, unknown> {
  limit?: number;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: QueryMeta;
  }
}

export const queryCache = new QueryCache();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
    },
  },
  queryCache: queryCache,
});

export const { api } = new Api({
  baseApiParams: { mode: "same-origin" },
});
