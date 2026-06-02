/**
 * LoginContent Component - login form with email/password
 * Handles user authentication
 * Validates inputs and displays error messages
 * Redirects to dashboard on successful login
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Checkbox, message } from "antd";
import BaseInput from "@/components/ui/Input/BaseInput";
import BaseButton from "@/components/ui/Button/BaseButton";
import { useLogin } from "@/hooks/auth/useLogin";
import type { LoginFormValues } from "@/types/app/auth";
import Link from "next/link";

export default function LoginContent() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: LoginFormValues) => {
    setFieldErrors({});

    // Validation
    if (!values.email) {
      setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!values.password) {
      setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      login(values, {
        onSuccess: () => {
          message.success("Login successful!");
          router.push("/dashboard");
        },
        onError: (err: any) => {
          message.error(err.message || "Login failed");
        },
      });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      {/* Email */}
      <Form.Item name="email" rules={[{ required: true }]} className="mb-4">
        <BaseInput
          placeholder="Enter your email"
          type="email"
          error={fieldErrors.email}
          prefix="✉️"
        />
      </Form.Item>

      {/* Password */}
      <Form.Item name="password" rules={[{ required: true }]} className="mb-4">
        <BaseInput
          placeholder="Enter your password"
          type="password"
          error={fieldErrors.password}
          prefix="🔒"
        />
      </Form.Item>

      {/* Remember & Forgot */}
      <div className="flex justify-between items-center mb-6">
        <Form.Item name="remember" valuePropName="checked" className="m-0">
          <Checkbox className="text-sm">Remember me</Checkbox>
        </Form.Item>
        <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
          Forgot password?
        </Link>
      </div>

      {/* Login Button */}
      <BaseButton
        htmlType="submit"
        text={isLoading ? "Logging in..." : "Login"}
        fullWidth
        disabled={isLoading}
        className="mb-4"
      />

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-blue-500 font-medium hover:text-blue-600">
          Sign up
        </Link>
      </p>
    </Form>
  );
}
