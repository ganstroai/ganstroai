"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next-nprogress-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, User, Edit, Calendar, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { mockUsers, type User } from "@/lib/users-data";
import { Loader2 } from "lucide-react";

export default function ViewUserPage() {
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    const fetchUser = async () => {
      setIsFetching(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundUser = mockUsers.find((u) => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
          router.push("/admin/users");
        }
      } catch (error) {
        toast.error("Failed to fetch user");
        router.push("/admin/users");
      } finally {
        setIsFetching(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const handleEdit = () => {
    router.push(`/admin/users/edit/${userId}`);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading user...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const getSubscriptionColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">View user information</p>
          </div>
        </div>
        <Button onClick={handleEdit} className="flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>Edit User</span>
        </Button>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>User's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">User ID: {user.id}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(user.isActive)}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Account Details</span>
            </CardTitle>
            <CardDescription>
              Account and subscription information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-gray-600">
                  {user.createdAt.toLocaleDateString()} at{" "}
                  {user.createdAt.toLocaleTimeString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-gray-600">
                  {user.lastLogin.toLocaleDateString()} at{" "}
                  {user.lastLogin.toLocaleTimeString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Subscription</p>
                {user.subscription ? (
                  <div className="space-y-1">
                    <p className="text-gray-600">{user.subscription.plan}</p>
                    <Badge
                      className={getSubscriptionColor(user.subscription.status)}
                    >
                      {user.subscription.status}
                    </Badge>
                  </div>
                ) : (
                  <p className="italic text-gray-500">No subscription</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Users
        </Button>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </div>
    </div>
  );
}
