/**
 * useCreatePet Hook - handles pet creation/registration
 * Manages form submission and loading states
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPetService } from "@/services/pet.service";
import type { Pet, PetFormValues } from "@/types/app/pet";
import { PETS_QUERY_KEY } from "./useGetPets";

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: PetFormValues) => {
      return createPetService(values);
    },
    onSuccess: () => {
      // Invalidate pets list to refetch
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });

  return {
    // Data
    pet: mutation.data as Pet | undefined,
    // States
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    // Error
    error: mutation.error?.message || null,
    // Trigger
    createPet: mutation.mutate,
    createPetAsync: mutation.mutateAsync,
    // Reset
    reset: mutation.reset,
  };
};
