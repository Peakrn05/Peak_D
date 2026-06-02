/**
 * useGetServices Hook - fetches available pet care services
 * Used when user is selecting services to book (grooming, shower, vaccine)
 * Services include pricing, duration, and requirements
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getServicesService } from "@/services/reservation.service";
import type { Service } from "@/types/app/reservation";

export const SERVICES_QUERY_KEY = ["services"] as const;

export const useGetServices = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: () => getServicesService(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });

  return {
    // Data
    services: (data as Service[]) || [],
    // States
    isLoading,
    isError,
    error: error?.message || null,
    // Actions
    refetch,
  };
};
