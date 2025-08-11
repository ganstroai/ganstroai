"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { mockVoiceNotes } from "@/lib/voice-notes-data";
import { mockUsers } from "@/lib/users-data";
import { AdminLayout } from "@/components/admin-layout";
import { Play, Users, Settings, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      // router.push("/login");
    }
  }, [router]);

  const stats = {
    totalNotes: mockVoiceNotes.length,
    totalUsers: mockUsers.filter((u) => u.role === "user").length,
    activeUsers: mockUsers.filter((u) => u.isActive && u.role === "user")
      .length,
    processedNotes: mockVoiceNotes.filter((n) => n.status === "processed")
      .length,
  };

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 lg:text-sm">
                    Total Voice Notes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 lg:text-3xl">
                    {stats.totalNotes}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 lg:p-3">
                  <Play className="h-5 w-5 text-blue-600 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 lg:text-sm">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 lg:text-3xl">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-2 lg:p-3">
                  <Users className="h-5 w-5 text-green-600 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 lg:text-sm">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 lg:text-3xl">
                    {stats.activeUsers}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-2 lg:p-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 lg:text-sm">
                    Processed Notes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 lg:text-3xl">
                    {stats.processedNotes}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-2 lg:p-3">
                  <Settings className="h-5 w-5 text-orange-600 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">
                Recent Voice Notes
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Latest voice messages from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">
                {mockVoiceNotes.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className="flex flex-col justify-between space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-center sm:space-y-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {note.userEmail}
                      </p>
                      {/* <p className="text-xs text-gray-500">
                        {note.timestamp.toLocaleDateString()}
                      </p> */}
                    </div>
                    <div className="flex-shrink-0 text-left sm:text-right">
                      <p className="text-sm font-medium">
                        {Math.floor(note.duration / 60)}:
                        {(note.duration % 60).toString().padStart(2, "0")}
                      </p>
                      <p
                        className={`text-xs ${
                          note.status === "processed"
                            ? "text-green-600"
                            : note.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {note.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Recent Users</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Newly registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">
                {mockUsers
                  .filter((u) => u.role === "user")
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col justify-between space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-center sm:space-y-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-left sm:text-right">
                        <p className="text-sm font-medium">
                          {user.subscription?.plan || "No Plan"}
                        </p>
                        <p
                          className={`text-xs ${
                            user.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
