/**
 * useLogin Hook - handles login form submission and authentication
 * Manages loading, error states during login process
 * Returns user data on success
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { loginService } from "@/services/auth.service";
import type { LoginFormValues, AuthUser } from "@/types/app/auth";

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      return loginService(values);
    },
  });

  return {
    // Data
    user: mutation.data as AuthUser | undefined,
    // States
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    // Error handling
    error: mutation.error?.message || null,
    // Trigger
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
  };
};
