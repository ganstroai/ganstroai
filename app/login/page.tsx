"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authenticateUser, setCurrentUser } from "@/lib/auth";
import { Bot, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { LoginSchema } from "@/lib/schemas/AuthSchema";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/server";
import { LOGIN_URL, routes } from "@/lib/utils/constants";
import { useSetAtom } from "jotai";
import { loggedUserAtom } from "@/lib/store";
import { saveLoggedUser } from "@/lib/actions/auth";
import { LoggedUser } from "@/lib/utils/constants/types";

import { useRouter } from "@bprogress/next/app";

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const setLoggedUser = useSetAtom(loggedUserAtom);

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  // const onSubmit = async (data: LoginFormValues) => {
  //   setIsLoading(true);

  //   try {
  //     const user = authenticateUser(data.email, data.password);
  //     if (user) {
  //       setCurrentUser(user);

  //       toast.success("Login successful", {
  //         description: `Welcome back, ${user.name || user.email}!`,
  //       });

  //       // Force a small delay to ensure cookie is set
  //       setTimeout(() => {
  //         // Redirect based on role
  //         if (user.role === "admin") {
  //           window.location.href = "/admin";
  //         } else {
  //           // Check if user has subscription
  //           if (user.subscription?.status === "active") {
  //             window.location.href = "/dashboard";
  //           } else {
  //             window.location.href = "/subscriptions";
  //           }
  //         }
  //       }, 100);
  //     } else {
  //       toast.error("Login failed", {
  //         description: "Invalid email or password",
  //       });
  //     }
  //   } catch (error) {
  //     toast.error("Error", {
  //       description: "An error occurred during login",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFormRequest = async (formData: LoginFormValues) => {
    const { email, password } = formData;

    const { status, message, data } = await post<any>({
      url: LOGIN_URL,
      payload: { email, password },
    });
    if (status) {
      await saveLoggedUser(data as LoggedUser);
      setLoggedUser(data as LoggedUser);
      if (data?.user?.role === "user") {
        router.push("/");
      } else {
        router.push(routes.ADMIN);
      }
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const { mutate, isPending } = useMutation({ mutationFn: handleFormRequest });

  const handleSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-6 lg:space-y-8">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center space-x-3 lg:mb-6">
            <div className="rounded-2xl bg-primary/10 p-2 lg:p-3">
              <Bot className="h-6 w-6 text-primary lg:h-8 lg:w-8" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-primary lg:text-4xl">
            GanStró AI Assistant
          </h1>
          <p className="text-base text-gray-600 lg:text-lg">
            Advanced AI-powered voice platform
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: "#009A44" }}>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl font-bold text-gray-900 lg:text-2xl">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Sign in to continue your AI journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            {/* <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 lg:space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form> */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 lg:space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
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
                {/* <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="h-10 border-2 border-gray-200 focus:border-primary lg:h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

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

                <LoadingButton
                  type="submit"
                  className="h-10 w-full bg-primary text-white hover:bg-primary/90 lg:h-12"
                  isLoading={isPending}
                >
                  Sign In
                </LoadingButton>
              </form>
            </Form>

            <div className="space-y-4 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>

            {/* <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 lg:mt-6 lg:p-4">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Demo Credentials:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex flex-col space-y-1 rounded-lg bg-white p-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span>
                    <strong>User:</strong> user@example.com
                  </span>
                  <Badge
                    variant="secondary"
                    className="self-start sm:self-center"
                  >
                    password
                  </Badge>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg bg-white p-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span>
                    <strong>Admin:</strong> admin@example.com
                  </span>
                  <Badge
                    variant="secondary"
                    className="self-start sm:self-center"
                  >
                    password
                  </Badge>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
