import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SimpleCardProps {
  children: React.ReactNode
  className?: string
}

export function SimpleCard({ children, className }: SimpleCardProps) {
  return (
    <Card
      className={cn(
        "border-2 border-skype-blue/20 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30",
        className,
      )}
    >
      {children}
    </Card>
  )
}

export { CardContent, CardDescription, CardHeader, CardTitle }
