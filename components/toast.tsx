"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Toast({
  message,
  isVisible,
  onHide,
}: {
  message: string
  isVisible: boolean
  onHide: () => void
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, 1500) // Reduced from 2000 to 1500ms
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  return (
    <div
      className={cn(
        "fixed top-1/4 left-1/2 -translate-x-1/2 bg-gray-800/75 text-white px-6 py-3 rounded-lg transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {message}
    </div>
  )
}

