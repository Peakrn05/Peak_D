/**
 * ServiceSelectionStep - service selection in booking flow
 * Shows available services (grooming, shower, vaccine) with pricing
 * User can select multiple services
 * Total price is calculated automatically
 */

"use client";

import { Card, Empty, Skeleton } from "antd";
import { CheckCircleOutlined, CheckOutlined } from "@ant-design/icons";
import type { Service } from "@/types/app/reservation";
import { SERVICE_ICONS, SERVICE_COLORS } from "../Reservation.config";

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Service[];
  onSelect: (services: Service[]) => void;
  isLoading?: boolean;
}

export default function ServiceSelectionStep({
  services,
  selectedServices,
  onSelect,
  isLoading = false,
}: ServiceSelectionStepProps) {
  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      onSelect(selectedServices.filter((s) => s.id !== service.id));
    } else {
      onSelect([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (services.length === 0) {
    return <Empty description="No services available" />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Services</h3>
      <p className="text-gray-600 text-sm">Select one or multiple services for your pet</p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id);
          const colors = SERVICE_COLORS[service.type] || SERVICE_COLORS.GROOMING;

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all relative ${
                isSelected ? "border-blue-500 border-2 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => toggleService(service)}
              hoverable
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-blue-500">
                  <CheckCircleOutlined style={{ fontSize: 24 }} />
                </div>
              )}

              {/* Service Icon & Header */}
              <div className={`bg-gradient-to-r ${colors} rounded-lg p-4 text-white mb-4`}>
                <div className="text-4xl text-center">
                  {SERVICE_ICONS[service.type] || "🐾"}
                </div>
              </div>

              {/* Service Info */}
              <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

              {/* Duration & Price */}
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-gray-600">
                  ⏱️ {service.duration} mins
                </span>
                <span className="font-bold text-lg text-green-600">
                  ฿{service.price.toLocaleString()}
                </span>
              </div>

              {/* Requirements (if any) */}
              {service.requirements && service.requirements.length > 0 && (
                <div className="text-xs text-gray-500 border-t pt-3">
                  <p className="font-medium mb-1">Requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {service.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Total Price & Summary */}
      {selectedServices.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Selected Services: {selectedServices.length}</p>
              <p className="text-xl font-bold text-gray-900">
                Total: <span className="text-green-600">฿{totalPrice.toLocaleString()}</span>
              </p>
            </div>
            <div className="text-4xl">✨</div>
          </div>
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center text-sm py-1"
              >
                <span className="flex items-center gap-2">
                  <CheckOutlined className="text-green-600" />
                  {service.name}
                </span>
                <span className="font-medium">฿{service.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
