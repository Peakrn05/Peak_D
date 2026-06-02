/**
 * DateTimeStep - select service date and time
 * User picks preferred appointment time
 * Shows available slots based on service duration
 */

"use client";

import { Form, DatePicker, TimePicker, Card } from "antd";
import dayjs from "dayjs";
import type { ReservationFormValues } from "@/types/app/reservation";

interface DateTimeStepProps {
  formData: Partial<ReservationFormValues>;
  onUpdate: (data: Partial<ReservationFormValues>) => void;
}

export default function DateTimeStep({ formData, onUpdate }: DateTimeStepProps) {
  const [form] = Form.useForm();

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      onUpdate({
        ...formData,
        scheduledDate: date.format("YYYY-MM-DD"),
      });
    }
  };

  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      onUpdate({
        ...formData,
        scheduledTime: time.format("HH:mm"),
      });
    }
  };

  // Disable past dates
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  // Business hours: 9 AM - 6 PM
  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 9 || i >= 18) {
        hours.push(i);
      }
    }
    return hours;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Schedule Your Service</h3>
        <p className="text-gray-600 text-sm mb-6">Choose your preferred date and time</p>
      </div>

      <Card className="bg-blue-50 border-blue-200 mb-6">
        <p className="text-sm text-blue-800 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          Available hours: 9:00 AM - 6:00 PM (Monday - Sunday)
        </p>
      </Card>

      <Form form={form} layout="vertical" className="space-y-4">
        {/* Date Selection */}
        <Form.Item label="Preferred Date" required>
          <DatePicker
            className="w-full h-10 rounded-lg"
            placeholder="Select date"
            value={formData.scheduledDate ? dayjs(formData.scheduledDate) : null}
            onChange={handleDateChange}
            disabledDate={disabledDate}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        {/* Time Selection */}
        <Form.Item label="Preferred Time" required>
          <TimePicker
            className="w-full h-10 rounded-lg"
            placeholder="Select time"
            value={formData.scheduledTime ? dayjs(formData.scheduledTime, "HH:mm") : null}
            onChange={handleTimeChange}
            disabledHours={disabledHours}
            format="HH:mm"
            minuteStep={30}
          />
        </Form.Item>

        {/* Selected DateTime Summary */}
        {formData.scheduledDate && formData.scheduledTime && (
          <Card className="bg-green-50 border-green-200 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointment Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {dayjs(formData.scheduledDate).format("dddd, DD MMMM YYYY")} at{" "}
                  {formData.scheduledTime}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </Card>
        )}
      </Form>
    </div>
  );
}
