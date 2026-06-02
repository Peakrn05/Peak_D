/**
 * Root Layout
 * Global layout wrapper for entire app
 * Configures providers, fonts, styling
 */

import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/context/query/QueryProvider";

export const metadata: Metadata = {
  title: "PetCare - Pet Care Reservation",
  description: "Modern pet care reservation with Grab-like pickup and PromptPay payment",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🐾</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
