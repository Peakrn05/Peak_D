/**
 * useCreateReservation Hook - handles service booking/reservation creation
 * Manages the flow from selecting services to creating order
 * After success, user proceeds to payment
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReservationService } from "@/services/reservation.service";
import type { Reservation, ReservationFormValues } from "@/types/app/reservation";
import { RESERVATIONS_QUERY_KEY } from "./useGetReservations";

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ReservationFormValues) => {
      return createReservationService(values);
    },
    onSuccess: () => {
      // Invalidate reservations list
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });

  return {
    // Data
    reservation: mutation.data as Reservation | undefined,
    // States
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    // Error
    error: mutation.error?.message || null,
    // Trigger
    createReservation: mutation.mutate,
    createReservationAsync: mutation.mutateAsync,
    // Reset
    reset: mutation.reset,
  };
};
