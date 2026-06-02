/**
 * Frontend reservation/service order domain types
 */

import { ServiceType, OrderStatus, PaymentStatus } from "@/types/api/main/common";

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  price: number;
  duration: number;
  icon?: string;
  requirements?: string[];
  selected?: boolean; // UI state
}

export interface ReservationPet {
  id: string;
  name: string;
  type: string;
  breed: string;
  photoUrl?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  petId: string;
  serviceIds: string[];
  services?: Service[];
  pet?: ReservationPet;
  scheduledDate: string;
  scheduledTime: string;
  status: OrderStatus;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  specialRequests?: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationFormValues {
  petId: string;
  serviceIds: string[];
  scheduledDate: string;
  scheduledTime: string;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  specialRequests?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: "PROMPTPAY" | "CARD" | "BANK_TRANSFER";
  qrCodeUrl?: string;
  referenceId?: string;
  createdAt: string;
  paidAt?: string;
}

export interface ReservationListParams {
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
}

export type ReservationModalMode = "create" | "edit" | "view" | "payment";
