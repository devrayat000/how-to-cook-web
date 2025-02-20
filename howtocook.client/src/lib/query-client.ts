import { Client } from "@/generated/api";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const apiClient = new Client();
