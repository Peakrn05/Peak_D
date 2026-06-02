/**
 * Authentication API types - defines login, user profile, and token structures
 */

import { UserRole } from "./common";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: UserRole;
    avatar?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  createdAt: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}
