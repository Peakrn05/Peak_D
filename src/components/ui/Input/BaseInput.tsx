/**
 * BaseInput Component - wrapper around Ant Design Input
 * Provides consistent form input styling
 * Used for text, email, phone, password inputs
 */

"use client";

import { Input, InputProps } from "antd";

interface BaseInputProps extends InputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function BaseInput({
  label,
  error,
  helperText,
  className = "",
  ...props
}: BaseInputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1.5 text-gray-700">{label}</label>}
      <Input
        className={`h-10 rounded-lg ${error ? "border-red-500" : ""} ${className}`.trim()}
        status={error ? "error" : ""}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
