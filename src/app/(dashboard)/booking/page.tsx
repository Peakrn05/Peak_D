/**
 * Booking Page
 * Main page for service booking flow
 */

import { BookingContent } from "@/components/partials/Reservation";

export const metadata = {
  title: "New Booking - PetCare",
  description: "Book a pet care service",
};

export default function BookingPage() {
  return <BookingContent />;
}
