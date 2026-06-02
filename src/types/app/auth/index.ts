/**
 * Frontend auth domain types - internal app representation (may differ from API contracts)
 * These are used within components, hooks, and services to maintain clean separation
 */

import { UserRole } from "@/types/api/main/common";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  agreeToTerms: boolean;
}
