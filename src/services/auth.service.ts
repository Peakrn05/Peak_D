/**
 * Auth Service - orchestrates authentication API calls and data transformation
 * Transforms API responses into frontend domain objects
 * Business logic: token handling, session management
 */

import { loginApi, signupApi, getMeApi } from "@/lib/api/api-main";
import type { LoginFormValues, AuthUser } from "@/types/app/auth";
import type { SignupFormValues } from "@/types/app/auth";

/**
 * Handles user login
 * - Calls backend API with credentials
 * - Returns user data (API handles token storage in httpOnly cookie)
 */
export const loginService = async (values: LoginFormValues): Promise<AuthUser> => {
  try {
    const response = await loginApi({
      email: values.email,
      password: values.password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return {
      id: response.data.data.user.id,
      email: response.data.data.user.email,
      name: response.data.data.user.name,
      phone: response.data.data.user.phone,
      role: response.data.data.user.role,
      avatar: response.data.data.user.avatar,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
};

/**
 * Handles user signup
 * - Validates and creates new account
 * - Returns authenticated user
 */
export const signupService = async (values: SignupFormValues): Promise<AuthUser> => {
  try {
    const response = await signupApi({
      email: values.email,
      password: values.password,
      name: values.name,
      phone: values.phone,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Signup failed");
    }

    return {
      id: response.data.data.user.id,
      email: response.data.data.user.email,
      name: response.data.data.user.name,
      phone: response.data.data.user.phone,
      role: response.data.data.user.role,
      avatar: response.data.data.user.avatar,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Signup failed");
  }
};

/**
 * Fetches current user profile
 * Used on app initialization to restore session
 */
export const getCurrentUserService = async (): Promise<AuthUser | null> => {
  try {
    const response = await getMeApi();

    if (!response.data.success) {
      return null;
    }

    const profile = response.data.data;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      role: profile.role,
      avatar: profile.avatar,
      address: profile.address,
    };
  } catch (error) {
    return null;
  }
};
