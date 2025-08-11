"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { registerUser, setCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles, ArrowLeft, EyeOff, Eye } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { SignupSchema } from "@/lib/schemas/AuthSchema";
import { SIGN_UP_URL } from "@/lib/utils/constants";
import { post } from "@/lib/server";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { LoggedUser } from "@/lib/utils/constants/types";
import { saveLoggedUser } from "@/lib/actions/auth";
import { useSetAtom } from "jotai";
import { loggedUserAtom } from "@/lib/store";

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const setLoggedUser = useSetAtom(loggedUserAtom);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleFormRequest = async (formData: SignupFormValues) => {
    const { firstName, lastName, email, password } = formData;

    const { status, message, data } = await post({
      url: SIGN_UP_URL,
      payload: { firstName, lastName, email, password },
    });
    if (status) {
      await saveLoggedUser(data as LoggedUser);
      setLoggedUser(data as LoggedUser);
      router.push("/");

      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const { mutate, isPending } = useMutation({ mutationFn: handleFormRequest });

  const handleSubmit = (data: SignupFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
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
            Join the future of AI voice technology
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: "#009A44" }}>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl font-bold text-gray-900 lg:text-2xl">
              Create Account
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Start your AI journey today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
              >
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
                  Create Account
                </LoadingButton>
              </form>
            </Form>

            {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
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
                  placeholder="Create a password"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="h-10 lg:h-12 border-2 border-gray-200 focus:border-primary"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form> */}

            <div className="space-y-4 text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
