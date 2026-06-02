/**
 * Axios client instances for API communication
 * Configured with interceptors for auth tokens and error handling
 */

import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Creates an Axios instance with base configuration
 * - Sets up base URL and headers
 * - Configured for JSON communication
 * - Ready for interceptors (auth, error handling)
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor - adds auth token to headers
  client.interceptors.request.use(
    (config) => {
      // Token will be added by middleware in production
      // For demo, tokens are stored in cookies/session
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor - handles errors globally
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401: Unauthorized - redirect to login
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const mainClient = createApiClient();
