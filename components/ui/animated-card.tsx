"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export function AnimatedCard({ children, className, delay = 0, hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      className={cn("skype-card-hover", className)}
    >
      <Card className="border-2 border-skype-blue/20 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
        {children}
      </Card>
    </motion.div>
  )
}

export { CardContent, CardDescription, CardHeader, CardTitle }
