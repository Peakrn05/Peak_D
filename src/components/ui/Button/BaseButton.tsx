/**
 * BaseButton Component - wrapper around Ant Design Button
 * Provides consistent styling and sizing across the app
 * Used for all clickable actions (submit, cancel, navigate)
 */

"use client";

import { Button, ButtonProps } from "antd";

interface BaseButtonProps extends ButtonProps {
  text?: string | React.ReactNode;
  fullWidth?: boolean;
}

export default function BaseButton({
  text,
  fullWidth = false,
  type = "primary",
  htmlType = "button",
  className = "",
  ...props
}: BaseButtonProps) {
  const widthClass = fullWidth ? "w-full" : "";
  const baseClass = `h-10 rounded-lg text-sm font-medium transition-all ${widthClass}`;

  return (
    <Button
      htmlType={htmlType}
      type={type}
      className={`${baseClass} ${className}`.trim()}
      {...props}
    >
      {text || props.children}
    </Button>
  );
}
