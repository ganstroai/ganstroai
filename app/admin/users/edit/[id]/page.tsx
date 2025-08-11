"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, User, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { mockUsers, type User } from "@/lib/users-data";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user"], { required_error: "Please select a role" }),
});

type UserFormData = z.infer<typeof userSchema>;

export default function EditUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      setIsFetching(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundUser = mockUsers.find((u) => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
          // Pre-populate form
          reset({
            firstName: foundUser.name.split(" ")[0] || "",
            lastName: foundUser.name.split(" ").slice(1).join(" ") || "",
            email: foundUser.email,
            role: foundUser.role as "admin" | "user",
          });
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
  }, [userId, reset, router]);

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("User updated successfully", {
        description: `${data.firstName} ${data.lastName}'s information has been updated.`,
      });

      router.push("/admin/users");
    } catch (error) {
      toast.error("Failed to update user", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user information</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Edit User Information</span>
          </CardTitle>
          <CardDescription>Update the user's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...register("lastName")}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("role", value as "admin" | "user")
                }
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
