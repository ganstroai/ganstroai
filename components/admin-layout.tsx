"use client";

import type React from "react";

import { AdminSidebar } from "@/components/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({
  children,
  title,
  description,
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-4 py-3 lg:px-6 lg:py-4">
          <div className="ml-12 flex items-center justify-between lg:ml-0">
            <div>
              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-600 lg:text-base">
                  {description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
