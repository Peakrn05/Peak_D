/**
 * Service API types - defines available services, pricing, and service bookings
 */

import { ServiceType, OrderStatus, PaymentStatus } from "./common";

export interface ServiceResponse {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  price: number;
  duration: number; // in minutes
  icon?: string;
  requirements?: string[];
  createdAt: string;
}

export interface ServiceOrderResponse {
  id: string;
  userId: string;
  petId: string;
  serviceId: string;
  service?: ServiceResponse;
  pet?: {
    name: string;
    type: string;
    breed: string;
  };
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

export interface CreateServiceOrderRequest {
  petId: string;
  serviceIds: string[]; // Can book multiple services
  scheduledDate: string;
  scheduledTime: string;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  specialRequests?: string;
}

export interface UpdateServiceOrderRequest {
  status?: OrderStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  specialRequests?: string;
}

export interface PaymentResponse {
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

export interface GenerateQRPaymentRequest {
  orderId: string;
  amount: number;
}

export interface GenerateQRPaymentResponse {
  paymentId: string;
  qrCodeUrl: string;
  referenceId: string;
  expiresIn: number; // seconds
}
