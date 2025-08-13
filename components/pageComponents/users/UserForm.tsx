"use client";
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAndUpdateGenericAction } from "@/lib/actions";
import { ADMIN_USERS_URL, queryNames, routes } from "@/lib/utils/constants";
import { useRouter } from "@bprogress/next/app";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";
import { Eye, EyeOff, Save } from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { get } from "@/lib/server";

type UserFormData = z.infer<typeof UserSchema>;

interface Props {
  id?: string | null;
}

const UserForm: React.FC<Props> = ({ id = null }) => {
  const [showPassword, setShowPassword] = useState(false);

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
  const queryClient = useQueryClient();

  const router = useRouter();

  const handleFormRequest = async (formData: UserFormData) => {
    const { status, message } = await createAndUpdateGenericAction({
      url: id ? `${ADMIN_USERS_URL}/${id}` : ADMIN_USERS_URL,
      isEdit: id ? true : false,
      payload: formData,
    });
    if (status) {
      queryClient.invalidateQueries({
        queryKey: [queryNames.ADMIN_USERS],
      });

      router.push(routes.ADMIN_USERS);
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const { mutate, isPending } = useMutation({ mutationFn: handleFormRequest });

  const handleFormSubmit = (data: UserFormData) => {
    if (!id && !data.password) {
      form.setError("password", {
        type: "manual",
        message: "Password is required",
      });
      return;
    }

    mutate(data);
  };

  const fetchSingleUser = async () => {
    const { status, message, data } = await get<any>({
      url: `${ADMIN_USERS_URL}/${id}`,
    });

    if (status) {
      return data;
    } else {
      toast.error(message);
    }
  };

  const { data, isLoading } = useQuery<any>({
    queryKey: [queryNames.ADMIN_USERS, id],
    queryFn: fetchSingleUser,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        email: data?.email || "",
        password: "",
        role: data?.role || "user",
      });
    }
  }, [data]);

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
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

              {`${id ? " Edit" : " Create"} User`}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserForm;
