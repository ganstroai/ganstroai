"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface VoiceVisualizerProps {
  isRecording: boolean
  className?: string
}

export function VoiceVisualizer({ isRecording, className }: VoiceVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0))

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(12).fill(0))
      return
    }

    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 100))
    }, 150)

    return () => clearInterval(interval)
  }, [isRecording])

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="bg-skype-blue rounded-full"
          style={{
            width: "4px",
            height: isRecording ? `${Math.max(height, 20)}%` : "20%",
            maxHeight: "60px",
            minHeight: "8px",
          }}
          animate={{
            height: isRecording ? `${Math.max(height, 20)}%` : "20%",
            opacity: isRecording ? 1 : 0.3,
          }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
