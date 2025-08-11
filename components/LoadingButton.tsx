import React, { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";

type ButtonVariantProps = VariantProps<typeof Button>;

export interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  className,
  isLoading = false,
  loadingText,
  startIcon,
  endIcon,
  loadingIcon = <Loader2 className="h-4 w-4 animate-spin" />,
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <>
      <Button
        className={className}
        variant={variant}
        size={size}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>{loadingIcon}</>
        ) : (
          <>
            {startIcon}
            {children}
            {endIcon}
          </>
        )}
      </Button>
    </>
  );
};

export default LoadingButton;
