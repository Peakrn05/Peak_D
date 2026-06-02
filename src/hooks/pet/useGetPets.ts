/**
 * useGetPets Hook - fetches user's pets list
 * Used in pet selection during booking and pet management pages
 * Manages caching and refetching
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getPetsService } from "@/services/pet.service";
import type { Pet, PetListParams } from "@/types/app/pet";

export const PETS_QUERY_KEY = ["pets"] as const;

export const useGetPets = (params?: PetListParams) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...PETS_QUERY_KEY, params],
    queryFn: () => getPetsService(params),
    staleTime: 0,
    gcTime: 0,
  });

  return {
    // Data
    pets: (data?.pets as Pet[]) || [],
    total: data?.total || 0,
    // States
    isLoading,
    isError,
    error: error?.message || null,
    // Actions
    refetch,
  };
};
