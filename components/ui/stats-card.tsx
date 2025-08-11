"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

export function StatsCard({ title, value, icon: Icon, trend, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-skype-blue/5 dark:from-gray-900 dark:to-skype-blue/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-skype-gray dark:text-gray-400">{title}</p>
              <motion.p
                className="text-3xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              {trend && (
                <div
                  className={`flex items-center mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  <span>{trend.isPositive ? "↗" : "↘"}</span>
                  <span className="ml-1">{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-skype-blue/20 rounded-full blur-xl" />
              <div className="relative bg-skype-blue/10 p-4 rounded-full">
                <Icon className="h-8 w-8 text-skype-blue" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
