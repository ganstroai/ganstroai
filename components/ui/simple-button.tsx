import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
}

export function SimpleButton({ variant = "primary", size = "md", children, className, ...props }: SimpleButtonProps) {
  const baseClasses = "font-semibold transition-colors duration-200"

  const variants = {
    primary: "skype-gradient text-white hover:opacity-90",
    secondary: "bg-white text-skype-blue border-2 border-skype-blue hover:bg-skype-blue hover:text-white",
    outline: "border-2 border-skype-blue text-skype-blue hover:bg-skype-blue hover:text-white",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <Button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Button>
  )
}
