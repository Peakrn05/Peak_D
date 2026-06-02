/**
 * Login Page - entry point for authentication
 * Thin async page component that delegates to LoginContent
 * Uses App Router pattern: pages are minimal, real logic in partials
 */

import { LoginContent } from "@/components/partials/Auth";

export const metadata = {
  title: "Login - PetCare",
  description: "Login to your PetCare account",
};

export default async function LoginPage() {
  return <LoginContent />;
}
