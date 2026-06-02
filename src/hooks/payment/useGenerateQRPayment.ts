/**
 * useGenerateQRPayment Hook - generates QR code for PromptPay payment
 * Called after user creates reservation
 * Returns QR code image and reference ID for verification
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { generateQRPaymentService } from "@/services/reservation.service";

export const useGenerateQRPayment = () => {
  const mutation = useMutation({
    mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
      return generateQRPaymentService(orderId, amount);
    },
  });

  return {
    // Data
    qrCodeUrl: mutation.data?.qrCodeUrl || null,
    referenceId: mutation.data?.referenceId || null,
    expiresIn: mutation.data?.expiresIn || 0,
    // States
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    // Error
    error: mutation.error?.message || null,
    // Trigger
    generateQR: mutation.mutate,
    generateQRAsync: mutation.mutateAsync,
    // Reset
    reset: mutation.reset,
  };
};
