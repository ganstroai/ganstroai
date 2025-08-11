"use client";

import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, UserPlus, Save, Loader2, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ADMIN_USERS_URL, routes } from "@/lib/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { createAndUpdateGenericAction } from "@/lib/actions";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";

type UserFormData = z.infer<typeof UserSchema>;

export default function AddUserPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const handleFormRequest = async (formData: UserFormData) => {
    const { status, message } = await createAndUpdateGenericAction({
      url: ADMIN_USERS_URL,
      isEdit: false,
      payload: formData,
    });
    if (status) {
      router.push(routes.ADMIN_USERS);
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const { mutate, isPending } = useMutation({ mutationFn: handleFormRequest });

  const handleFormSubmit = (data: UserFormData) => {
    mutate(data);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex w-full flex-wrap items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={routes.ADMIN_USERS}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600">Create a new user account</p>
        </div>
      </div>

      {/* Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new user account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-10 border-2 border-gray-200 pr-10 focus:border-primary lg:h-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  asChild
                >
                  <Link href={routes.ADMIN_USERS}>Cancel</Link>
                </Button>
                <LoadingButton
                  type="submit"
                  isLoading={isPending}
                  className="min-w-[170px] gap-2"
                >
                  <Save className="h-4 w-4" />
                  Create User
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
