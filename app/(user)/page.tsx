"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { UserLayout } from "@/components/user-layout";

import { CreditCard, Calendar, TrendingUp, MessageCircle } from "lucide-react";
import { UserInvoiceSummary } from "@/components/user-invoice-summary";
import { routes } from "@/lib/utils/constants";

export default function UserDashboard() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  });

  // useEffect(() => {
  //   if (!isLoading && (!user || user.role !== "user")) {
  //     router.push("/login");
  //   }
  // }, [user, isLoading, router]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  return (
    <>
      {/* <UserLayout
      title="Dashboard"
      description="Welcome to your AI assistant dashboard"
    > */}
      <div className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Welcome Section */}
          <div className="col-span-2 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-4 lg:p-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900 lg:text-2xl">
              {/* Welcome back, {user.name || user.email}! */}
            </h2>
            <p className="text-sm text-gray-600 lg:text-base">
              Manage your AI assistant subscription and explore powerful voice
              features.
            </p>
          </div>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 lg:text-sm">
                    Member Since
                  </p>
                  <p className="text-lg font-bold text-gray-900 lg:text-2xl">
                    {/* {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })} */}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 lg:p-3">
                  <Calendar className="h-5 w-5 text-blue-600 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* <UserInvoiceSummary userId={user.id} /> */}

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 lg:text-sm">
                    Total Voice Messages
                  </p>
                  <p className="text-lg font-bold text-gray-900 lg:text-2xl">
                    24
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-2 lg:p-3">
                  <MessageCircle className="h-5 w-5 text-purple-600 lg:h-6 lg:w-6" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Common tasks and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              <div
                className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 lg:p-4"
                onClick={() => router.push(routes.SUBSCRIPTION)}
              >
                <CreditCard className="mb-2 h-6 w-6 text-primary lg:h-8 lg:w-8" />
                <h3 className="text-sm font-semibold lg:text-base">
                  Manage Subscription
                </h3>
                <p className="text-xs text-gray-600 lg:text-sm">
                  View and update your plan
                </p>
              </div>

              <div
                className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 lg:p-4"
                onClick={() => router.push(routes.INVOICES)}
              >
                <TrendingUp className="mb-2 h-6 w-6 text-blue-600 lg:h-8 lg:w-8" />
                <h3 className="text-sm font-semibold lg:text-base">
                  View Invoices
                </h3>
                <p className="text-xs text-gray-600 lg:text-sm">
                  Check billing history
                </p>
              </div>

              <div
                className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 lg:p-4"
                onClick={() => router.push(routes.PROFILE)}
              >
                <Calendar className="mb-2 h-6 w-6 text-purple-600 lg:h-8 lg:w-8" />
                <h3 className="text-sm font-semibold lg:text-base">
                  Edit Profile
                </h3>
                <p className="text-xs text-gray-600 lg:text-sm">
                  Update your information
                </p>
              </div>

              <div className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 lg:p-4">
                <MessageCircle className="mb-2 h-6 w-6 text-green-600 lg:h-8 lg:w-8" />
                <h3 className="text-sm font-semibold lg:text-base">AI Chat</h3>
                <p className="text-xs text-gray-600 lg:text-sm">
                  Use floating chat button
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* </UserLayout> */}
    </>
  );
}
