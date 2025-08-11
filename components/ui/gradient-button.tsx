"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
}

export function GradientButton({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: GradientButtonProps) {
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300"

  const variants = {
    primary: "skype-gradient text-white shadow-lg hover:shadow-xl hover:shadow-skype-blue/25",
    secondary: "bg-white text-skype-blue border-2 border-skype-blue hover:bg-skype-blue hover:text-white",
    outline: "border-2 border-skype-blue text-skype-blue hover:bg-skype-blue hover:text-white",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-skype-light-blue to-skype-blue opacity-0 hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </Button>
    </motion.div>
  )
}
