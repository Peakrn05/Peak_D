/**
 * Reservation Service - booking and order management
 * Handles service reservations, payments, and order tracking
 */

import {
  getServicesApi,
  getServiceApi,
  getReservationsApi,
  getReservationApi,
  createReservationApi,
  updateReservationApi,
  cancelReservationApi,
  generateQRPaymentApi,
  getPaymentApi,
  verifyPaymentApi,
} from "@/lib/api/api-main";
import type {
  Service,
  Reservation,
  ReservationFormValues,
  Payment,
  ReservationListParams,
} from "@/types/app/reservation";

// ============ SERVICE MANAGEMENT ============

/**
 * Fetches all available services (grooming, shower, vaccine, etc.)
 * Used for service selection in booking flow
 */
export const getServicesService = async (): Promise<Service[]> => {
  try {
    const response = await getServicesApi();

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch services");
    }

    return response.data.data.content || [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch services");
  }
};

/**
 * Fetches single service details
 */
export const getServiceService = async (serviceId: string): Promise<Service> => {
  try {
    const response = await getServiceApi(serviceId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch service");
    }

    return response.data.data as Service;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch service");
  }
};

// ============ RESERVATION MANAGEMENT ============

/**
 * Fetches user's reservations with optional filtering
 * Used for order history and tracking
 */
export const getReservationsService = async (
  params?: ReservationListParams,
): Promise<{ reservations: Reservation[]; total: number }> => {
  try {
    const response = await getReservationsApi(params as Record<string, unknown>);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch reservations");
    }

    return {
      reservations: (response.data.data.content || []) as unknown as Reservation[],
      total: response.data.data.totalElements || 0,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch reservations",
    );
  }
};

/**
 * Fetches single reservation details
 */
export const getReservationService = async (
  reservationId: string,
): Promise<Reservation> => {
  try {
    const response = await getReservationApi(reservationId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch reservation");
    }

    return response.data.data as unknown as Reservation;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch reservation",
    );
  }
};

/**
 * Creates new service reservation
 * - Accepts pet, services, date/time, pickup address
 * - Returns created reservation with order ID
 * - Used before payment step
 */
export const createReservationService = async (
  values: ReservationFormValues,
): Promise<Reservation> => {
  try {
    const response = await createReservationApi({
      petId: values.petId,
      serviceIds: values.serviceIds,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      pickupAddress: values.pickupAddress,
      specialRequests: values.specialRequests,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create reservation");
    }

    return response.data.data as unknown as Reservation;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create reservation",
    );
  }
};

/**
 * Updates existing reservation
 * Can modify: date, time, special requests, status
 */
export const updateReservationService = async (
  reservationId: string,
  updates: Partial<ReservationFormValues>,
): Promise<Reservation> => {
  try {
    const response = await updateReservationApi(reservationId, updates);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update reservation");
    }

    return response.data.data as unknown as Reservation;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update reservation",
    );
  }
};

/**
 * Cancels reservation
 * Used when user wants to cancel booking
 */
export const cancelReservationService = async (
  reservationId: string,
): Promise<Reservation> => {
  try {
    const response = await cancelReservationApi(reservationId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to cancel reservation");
    }

    return response.data.data as unknown as Reservation;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to cancel reservation",
    );
  }
};

// ============ PAYMENT MANAGEMENT ============

/**
 * Generates QR code for PromptPay payment
 * - Creates QR image for scanning
 * - Returns reference ID for verification
 * - QR expires after configured timeout
 */
export const generateQRPaymentService = async (
  orderId: string,
  amount: number,
): Promise<{ qrCodeUrl: string; referenceId: string; expiresIn: number }> => {
  try {
    const response = await generateQRPaymentApi({ orderId, amount });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to generate QR code");
    }

    return {
      qrCodeUrl: response.data.data.qrCodeUrl,
      referenceId: response.data.data.referenceId,
      expiresIn: response.data.data.expiresIn,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate QR code",
    );
  }
};

/**
 * Fetches payment status
 * Used to check if payment was confirmed
 */
export const getPaymentService = async (paymentId: string): Promise<Payment> => {
  try {
    const response = await getPaymentApi(paymentId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch payment");
    }

    return response.data.data as Payment;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch payment");
  }
};

/**
 * Verifies PromptPay payment
 * - Called after user scans and pays QR code
 * - Confirms payment with bank reference ID
 * - Updates order status on success
 */
export const verifyPaymentService = async (
  paymentId: string,
  referenceId: string,
): Promise<Payment> => {
  try {
    const response = await verifyPaymentApi(paymentId, referenceId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to verify payment");
    }

    return response.data.data as Payment;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to verify payment",
    );
  }
};
