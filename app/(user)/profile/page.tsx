"use client";

import { useEffect, useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";

import { User, Mail, Calendar, Save, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loggedUserAtom } from "@/lib/store";
import { useAtom } from "jotai";
import type { LoggedUser } from "@/lib/utils/constants/types";
import { ProfileUpdateSchema } from "@/lib/schemas/AuthSchema";
import { format } from "date-fns";

type ProfileForm = z.infer<typeof ProfileUpdateSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);

  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: loggedUser?.user?.firstName || "",
      lastName: loggedUser?.user?.lastName || "",
      email: loggedUser?.user?.email || "",
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
    // form.reset({
    //   name: user?.name || "",
    //   email: user?.email || "",
    // });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       Loading...
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (loggedUser) {
      form.reset({
        firstName: loggedUser?.user?.firstName || "",
        lastName: loggedUser?.user?.lastName || "",
        email: loggedUser?.user?.email || "",
      });
    }
  }, [loggedUser?.user?._id]);

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            className="h-10 border-2 border-gray-200 focus:border-primary lg:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            className="h-10 border-2 border-gray-200 focus:border-primary lg:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="h-10 border-2 border-gray-200 focus:border-primary lg:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-4 border-t pt-4">
                  <Button
                    disabled={true}
                    type="submit"
                    className="min-w-[103px] bg-primary hover:bg-primary/90"
                  >
                    Edit Profile
                  </Button>
                </div>
              </form>
            </Form>
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
                    {loggedUser?.user?.createdAt
                      ? format(
                          new Date(loggedUser.user.createdAt),
                          "MMMM d, yyyy",
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* <div className="flex items-center space-x-3">
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
              </div> */}

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-medium capitalize">
                    {loggedUser?.user?.role}
                  </p>
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

      {/* </UserLayout> */}
    </>
  );
}
