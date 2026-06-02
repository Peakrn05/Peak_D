/**
 * useGetReservations Hook - fetches user's reservations/orders
 * Used for order history and tracking page
 * Can filter by status (pending, confirmed, completed, etc)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getReservationsService } from "@/services/reservation.service";
import type { Reservation, ReservationListParams } from "@/types/app/reservation";

export const RESERVATIONS_QUERY_KEY = ["reservations"] as const;

export const useGetReservations = (params?: ReservationListParams) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...RESERVATIONS_QUERY_KEY, params],
    queryFn: () => getReservationsService(params),
    staleTime: 0,
    gcTime: 0,
  });

  return {
    // Data
    reservations: (data?.reservations as Reservation[]) || [],
    total: data?.total || 0,
    // States
    isLoading,
    isError,
    error: error?.message || null,
    // Actions
    refetch,
  };
};
