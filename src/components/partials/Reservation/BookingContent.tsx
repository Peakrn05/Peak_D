/**
 * BookingContent Component - main booking flow
 * Multi-step form: Pet Selection → Service Selection → DateTime → Pickup → Payment
 * Manages state across all booking steps
 */

"use client";

import { useState } from "react";
import { Card, Steps, Button, Space, message, Empty } from "antd";
import { useGetPets } from "@/hooks/pet/useGetPets";
import { useGetServices } from "@/hooks/reservation/useGetServices";
import { useCreateReservation } from "@/hooks/reservation/useCreateReservation";
import type { Service, ReservationFormValues } from "@/types/app/reservation";
import type { Pet } from "@/types/app/pet";
import { BOOKING_STEPS, SERVICE_ICONS, SERVICE_COLORS } from "./Reservation.config";
import ServiceSelectionStep from "./Steps/ServiceSelectionStep";
import DateTimeStep from "./Steps/DateTimeStep";
import PickupStep from "./Steps/PickupStep";
import PaymentStep from "./Steps/PaymentStep";

export default function BookingContent() {
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Partial<ReservationFormValues>>({});

  const { pets, isLoading: petsLoading } = useGetPets();
  const { services, isLoading: servicesLoading } = useGetServices();
  const { createReservation, isLoading: bookingLoading } = useCreateReservation();

  // Handle next step
  const handleNext = async () => {
    if (step === BOOKING_STEPS.length - 1) {
      // Final step - submit booking
      if (!selectedPet?.id || selectedServices.length === 0) {
        message.error("Please complete all steps");
        return;
      }

      const bookingData: ReservationFormValues = {
        petId: selectedPet.id,
        serviceIds: selectedServices.map((s) => s.id),
        scheduledDate: formData.scheduledDate || "",
        scheduledTime: formData.scheduledTime || "",
        pickupAddress: formData.pickupAddress || "",
        specialRequests: formData.specialRequests,
      };

      createReservation(bookingData, {
        onSuccess: (reservation) => {
          message.success("Booking created! Proceed to payment.");
          setStep(step + 1);
        },
        onError: (error) => {
          message.error(error.message || "Booking failed");
        },
      });
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => setStep(Math.max(0, step - 1));

  // Step 1: Pet Selection
  const renderPetSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Your Pet</h3>
      {petsLoading ? (
        <div className="text-center py-8">Loading pets...</div>
      ) : pets.length === 0 ? (
        <Empty
          description="No pets found"
          style={{ marginTop: 50 }}
          className="mb-4"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className={`cursor-pointer transition-all ${
                selectedPet?.id === pet.id
                  ? "border-blue-500 border-2 bg-blue-50"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPet(pet)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🐾</div>
                <h4 className="font-semibold text-lg">{pet.name}</h4>
                <p className="text-sm text-gray-600">{pet.type} - {pet.breed}</p>
                <p className="text-xs text-gray-500 mt-1">Age: {pet.age} years</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Step 2: Service Selection
  const renderServiceSelection = () => (
    <ServiceSelectionStep
      services={services}
      selectedServices={selectedServices}
      onSelect={setSelectedServices}
      isLoading={servicesLoading}
    />
  );

  // Step 3: DateTime Selection
  const renderDateTime = () => (
    <DateTimeStep formData={formData} onUpdate={setFormData} />
  );

  // Step 4: Pickup Address
  const renderPickup = () => (
    <PickupStep formData={formData} onUpdate={setFormData} />
  );

  // Step 5: Payment
  const renderPayment = () => (
    <PaymentStep selectedServices={selectedServices} totalPrice={0} />
  );

  const steps = [
    { content: renderPetSelection() },
    { content: renderServiceSelection() },
    { content: renderDateTime() },
    { content: renderPickup() },
    { content: renderPayment() },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Steps */}
      <Steps
        current={step}
        items={BOOKING_STEPS.map((s) => ({ title: s.label }))}
        className="mb-8"
      />

      {/* Step Content */}
      <Card className="min-h-96">
        <div className="mb-8">{steps[step]?.content}</div>

        {/* Navigation Buttons */}
        <Space className="float-right mt-6">
          <Button
            onClick={handlePrev}
            disabled={step === 0}
            className="h-10 rounded-lg"
          >
            Previous
          </Button>
          <Button
            type="primary"
            onClick={handleNext}
            loading={bookingLoading}
            className="h-10 rounded-lg"
          >
            {step === BOOKING_STEPS.length - 1 ? "Complete Booking" : "Next"}
          </Button>
        </Space>
      </Card>
    </div>
  );
}
