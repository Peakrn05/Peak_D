/**
 * PaymentStep - PromptPay QR code payment
 * Generates QR code for user to scan and pay
 * Supports real-time payment verification
 */

"use client";

import { useState, useEffect } from "react";
import { Card, Button, message, Spin, Tabs } from "antd";
import { QrcodeOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";
import type { Service } from "@/types/app/reservation";
import { useGenerateQRPayment } from "@/hooks/payment/useGenerateQRPayment";

interface PaymentStepProps {
  selectedServices: Service[];
  totalPrice: number;
}

export default function PaymentStep({
  selectedServices,
  totalPrice,
}: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "bank">("promptpay");
  const [orderId] = useState("ORD-2024-001"); // In real app, comes from reservation
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const { referenceId, expiresIn, generateQR, isLoading } =
    useGenerateQRPayment();

  // Generate QR on mount
  useEffect(() => {
    if (totalPrice > 0) {
      generateQR({ orderId, amount: totalPrice });
    }
  }, [orderId, totalPrice, generateQR]);

  const handleConfirmPayment = async () => {
    message.success("Payment verified! Your booking is confirmed. 🎉");
    setPaymentConfirmed(true);
  };

  // PromptPay QR payload (EMVCo format used by Thai banks)
  const promptPayQRValue = `promptpay://0812345678?amount=${totalPrice}&ref=${orderId}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment & Confirmation</h3>
        <p className="text-gray-600 text-sm">
          Complete payment using PromptPay QR or bank transfer
        </p>
      </div>

      {/* Payment Method Tabs */}
      <Tabs
        activeKey={paymentMethod}
        onChange={(key) => setPaymentMethod(key as "promptpay" | "bank")}
        items={[
          {
            key: "promptpay",
            label: (
              <span className="flex items-center gap-2">
                <QrcodeOutlined /> PromptPay QR
              </span>
            ),
            children: (
              <div className="space-y-4 py-4">
                {/* Order Summary */}
                <Card className="bg-blue-50 border-blue-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono font-semibold">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Services:</span>
                      <span className="text-right">
                        {selectedServices.map((s) => s.name).join(", ")}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between text-lg">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-green-600 font-bold">
                        ฿{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* QR Code */}
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin tip="Generating QR code..." />
                  </div>
                ) : (
                  <Card className="text-center py-8">
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      Scan with your banking app to pay
                    </p>
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <QRCode
                          value={promptPayQRValue}
                          size={256}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                    {referenceId && (
                      <p className="text-xs text-gray-500 mb-4">
                        Reference: <span className="font-mono">{referenceId}</span>
                      </p>
                    )}
                    {expiresIn > 0 && (
                      <p className="text-sm text-orange-600 flex items-center justify-center gap-1">
                        <ClockCircleOutlined /> QR expires in {expiresIn} seconds
                      </p>
                    )}
                  </Card>
                )}

                {/* Instructions */}
                <Card className="bg-amber-50 border-amber-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    How to pay with PromptPay:
                  </p>
                  <ol className="text-sm space-y-2 text-gray-700 list-decimal list-inside">
                    <li>Open your banking app (Kasikornbank, Bangkok Bank, etc.)</li>
                    <li>Select "Pay with QR code" or "Scan QR"</li>
                    <li>Scan the QR code above</li>
                    <li>Verify amount: ฿{totalPrice.toLocaleString()}</li>
                    <li>Confirm payment with your PIN</li>
                  </ol>
                </Card>

                {/* Confirm Payment Button */}
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleConfirmPayment}
                  disabled={paymentConfirmed}
                  className="h-10 rounded-lg font-medium"
                >
                  {paymentConfirmed ? "Payment Confirmed ✓" : "I've Paid - Confirm"}
                </Button>
              </div>
            ),
          },
          {
            key: "bank",
            label: "Bank Transfer",
            children: (
              <div className="space-y-4 py-4">
                <Card className="bg-gray-50">
                  <p className="text-sm text-gray-600 mb-4">
                    Bank transfer details will be provided after booking. Please use your Order ID
                    as reference.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Bank:</span>
                      <span className="font-semibold">Bangkok Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account:</span>
                      <span className="font-semibold">123-456-7890</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Name:</span>
                      <span className="font-semibold">PetCare Co., Ltd.</span>
                    </div>
                    <div className="flex justify-between text-lg mt-4 pt-4 border-t">
                      <span>Amount:</span>
                      <span className="font-bold text-green-600">
                        ฿{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-mono text-xs">{orderId}</span>
                    </div>
                  </div>
                </Card>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleConfirmPayment}
                  disabled={paymentConfirmed}
                  className="h-10 rounded-lg font-medium"
                >
                  {paymentConfirmed ? "Payment Confirmed ✓" : "I've Transferred - Confirm"}
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* Confirmation Message */}
      {paymentConfirmed && (
        <Card className="bg-green-50 border-green-300 border-2">
          <div className="flex items-start gap-3">
            <CheckCircleOutlined className="text-green-600 text-2xl mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Booking Confirmed! 🎉</h4>
              <p className="text-sm text-gray-700 mb-2">
                Your pet care service has been booked successfully. You'll receive:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Confirmation SMS/Email with order details</li>
                <li>Real-time driver location tracking</li>
                <li>Service updates and completion notification</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
