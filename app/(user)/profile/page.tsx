"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { UserLayout } from "@/components/user-layout";
import { FloatingChat } from "@/components/floating-chat";
import { User, Mail, Calendar, Save, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: api.updateUserProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      setIsEditing(false);
      toast.success("Profile updated", {
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* <UserLayout title="Profile" description="Manage your account information"> */}
      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="border-2 border-gray-200 focus:border-primary"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-md border bg-gray-50 p-3">
                      {user?.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-2 border-gray-200 focus:border-primary"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-md border bg-gray-50 p-3">
                      {user?.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 border-t pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={handleEdit}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-green-100 p-2">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="font-medium text-green-600">
                    {user?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="font-medium">
                    {user?.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account settings and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/settings")}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings
              </Button>
              <Button
                variant="outline"
                className="border-red-200 bg-transparent text-red-600 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingChat />
      {/* </UserLayout> */}
    </>
  );
}
