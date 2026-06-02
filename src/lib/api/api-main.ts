/**
 * Main API endpoint functions - all typed axios calls in one place
 * Each function maps to a specific backend endpoint
 * Returns raw API responses (services transform these into domain objects)
 */

import { mainClient } from "./client";
import type { ApiResponse, PageObject } from "@/types/api/main/common";
import type { LoginRequest, LoginResponse, UserProfile, SignupRequest } from "@/types/api/main/auth";
import type { PetResponse, CreatePetRequest, UpdatePetRequest } from "@/types/api/main/pet";
import type {
  ServiceResponse,
  ServiceOrderResponse,
  CreateServiceOrderRequest,
  UpdateServiceOrderRequest,
  PaymentResponse,
  GenerateQRPaymentRequest,
  GenerateQRPaymentResponse,
} from "@/types/api/main/service";

// ============ AUTH ENDPOINTS ============

export const loginApi = (data: LoginRequest) =>
  mainClient.post<ApiResponse<LoginResponse>>("/v1/auth/login", data);

export const signupApi = (data: SignupRequest) =>
  mainClient.post<ApiResponse<LoginResponse>>("/v1/auth/signup", data);

export const getMeApi = () =>
  mainClient.get<ApiResponse<UserProfile>>("/v1/auth/me");

export const logoutApi = () =>
  mainClient.post<ApiResponse<void>>("/v1/auth/logout");

// ============ PET ENDPOINTS ============

export const getPetsApi = (params?: Record<string, unknown>) =>
  mainClient.get<ApiResponse<PageObject<PetResponse>>>("/v1/pets", { params });

export const getPetApi = (petId: string) =>
  mainClient.get<ApiResponse<PetResponse>>(`/v1/pets/${petId}`);

export const createPetApi = (data: CreatePetRequest) =>
  mainClient.post<ApiResponse<PetResponse>>("/v1/pets", data);

export const updatePetApi = (petId: string, data: UpdatePetRequest) =>
  mainClient.put<ApiResponse<PetResponse>>(`/v1/pets/${petId}`, data);

export const deletePetApi = (petId: string) =>
  mainClient.delete<ApiResponse<void>>(`/v1/pets/${petId}`);

// ============ SERVICE ENDPOINTS ============

export const getServicesApi = (params?: Record<string, unknown>) =>
  mainClient.get<ApiResponse<PageObject<ServiceResponse>>>("/v1/services", { params });

export const getServiceApi = (serviceId: string) =>
  mainClient.get<ApiResponse<ServiceResponse>>(`/v1/services/${serviceId}`);

// ============ RESERVATION ENDPOINTS ============

export const getReservationsApi = (params?: Record<string, unknown>) =>
  mainClient.get<ApiResponse<PageObject<ServiceOrderResponse>>>("/v1/reservations", {
    params,
  });

export const getReservationApi = (reservationId: string) =>
  mainClient.get<ApiResponse<ServiceOrderResponse>>(`/v1/reservations/${reservationId}`);

export const createReservationApi = (data: CreateServiceOrderRequest) =>
  mainClient.post<ApiResponse<ServiceOrderResponse>>("/v1/reservations", data);

export const updateReservationApi = (
  reservationId: string,
  data: UpdateServiceOrderRequest,
) =>
  mainClient.put<ApiResponse<ServiceOrderResponse>>(
    `/v1/reservations/${reservationId}`,
    data,
  );

export const cancelReservationApi = (reservationId: string) =>
  mainClient.post<ApiResponse<ServiceOrderResponse>>(
    `/v1/reservations/${reservationId}/cancel`,
  );

// ============ PAYMENT ENDPOINTS ============

export const generateQRPaymentApi = (data: GenerateQRPaymentRequest) =>
  mainClient.post<ApiResponse<GenerateQRPaymentResponse>>(
    "/v1/payments/generate-qr",
    data,
  );

export const getPaymentApi = (paymentId: string) =>
  mainClient.get<ApiResponse<PaymentResponse>>(`/v1/payments/${paymentId}`);

export const verifyPaymentApi = (paymentId: string, referenceId: string) =>
  mainClient.post<ApiResponse<PaymentResponse>>("/v1/payments/verify", {
    paymentId,
    referenceId,
  });
