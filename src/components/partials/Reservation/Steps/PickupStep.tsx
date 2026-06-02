/**
 * PickupStep - pet pickup address configuration
 * Similar to Grab/LineMan, user specifies pickup location
 * Can use current location or enter custom address
 * Driver will arrive at specified address to pick up pet
 */

"use client";

import { Form, Input, Button, Card, Space, message } from "antd";
import { EnvironmentOutlined, EnvironmentFilled } from "@ant-design/icons";
import type { ReservationFormValues } from "@/types/app/reservation";

interface PickupStepProps {
  formData: Partial<ReservationFormValues>;
  onUpdate: (data: Partial<ReservationFormValues>) => void;
}

export default function PickupStep({ formData, onUpdate }: PickupStepProps) {
  const [form] = Form.useForm();

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...formData,
      pickupAddress: e.target.value,
    });
  };

  // Get current location (demo - in real app, use geolocation API)
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app: convert coordinates to address
          const mockAddress = "123 Pet Lane, Bangkok, Thailand";
          onUpdate({
            ...formData,
            pickupAddress: mockAddress,
            pickupLatitude: position.coords.latitude,
            pickupLongitude: position.coords.longitude,
          });
          message.success("Location updated!");
        },
        () => {
          message.error("Unable to get your location");
        },
      );
    } else {
      message.warning("Geolocation not supported");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pickup Address</h3>
        <p className="text-gray-600 text-sm mb-6">
          Our driver will pick up your pet from this address
        </p>
      </div>

      {/* Service Area Info */}
      <Card className="bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚐</span>
          <div>
            <p className="font-semibold text-gray-900">Pet Pickup Service (Grab-like)</p>
            <p className="text-sm text-gray-600 mt-1">
              Our professional drivers will arrive within 30-60 minutes. You'll receive real-time
              tracking updates on the driver's location.
            </p>
          </div>
        </div>
      </Card>

      <Form form={form} layout="vertical" className="space-y-4">
        {/* Address Input */}
        <Form.Item
          label="Pickup Address"
          required
          rules={[
            {
              required: true,
              message: "Please enter pickup address",
            },
            {
              min: 10,
              message: "Please enter a valid address",
            },
          ]}
        >
          <Input.TextArea
            placeholder="e.g., 123 Pet Lane, Bangkok, Thailand 10110"
            rows={4}
            value={formData.pickupAddress || ""}
            onChange={handleAddressChange}
            className="rounded-lg"
          />
        </Form.Item>

        {/* Current Location Button */}
        <Button
          icon={<EnvironmentFilled />}
          onClick={handleUseCurrentLocation}
          className="w-full h-10 rounded-lg font-medium"
        >
          Use Current Location
        </Button>

        {/* Address Suggestions (Demo) */}
        {!formData.pickupAddress && (
          <Card className="bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Recent Addresses:</p>
            <Space direction="vertical" className="w-full">
              <Button
                type="text"
                icon={<EnvironmentOutlined />}
                className="w-full justify-start h-auto py-2 text-left text-gray-600 hover:text-blue-600"
                onClick={() =>
                  onUpdate({
                    ...formData,
                    pickupAddress: "456 Paw Street, Bangkok, Thailand",
                  })
                }
              >
                456 Paw Street, Bangkok, Thailand
              </Button>
              <Button
                type="text"
                icon={<EnvironmentOutlined />}
                className="w-full justify-start h-auto py-2 text-left text-gray-600 hover:text-blue-600"
                onClick={() =>
                  onUpdate({
                    ...formData,
                    pickupAddress: "789 Pet Park Avenue, Bangkok, Thailand",
                  })
                }
              >
                789 Pet Park Avenue, Bangkok, Thailand
              </Button>
            </Space>
          </Card>
        )}

        {/* Address Summary */}
        {formData.pickupAddress && (
          <Card className="bg-green-50 border-green-200 mt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm text-gray-600">Pickup Address Confirmed</p>
                <p className="font-semibold text-gray-900 mt-1">{formData.pickupAddress}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Special Requests */}
        <Form.Item label="Special Requests (Optional)">
          <Input.TextArea
            placeholder="e.g., Gate code is 1234, my pet is nervous with strangers, etc."
            rows={3}
            value={formData.specialRequests || ""}
            onChange={(e) =>
              onUpdate({
                ...formData,
                specialRequests: e.target.value,
              })
            }
            className="rounded-lg"
          />
        </Form.Item>
      </Form>
    </div>
  );
}
