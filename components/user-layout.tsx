"use client"

import type React from "react"
import { UserSidebar } from "@/components/user-sidebar"

interface UserLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function UserLayout({ children, title, description }: UserLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 ml-0 lg:ml-0">
          <div className="flex items-center justify-between ml-12 lg:ml-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-sm lg:text-base text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-white">{children}</main>
      </div>
    </div>
  )
}
