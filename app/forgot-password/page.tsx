"use client";

import { useState } from "react";
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
import { resetPassword } from "@/lib/auth";

import { Bot, Sparkles, ArrowLeft, Mail } from "lucide-react";
import { ForgotPasswordSchema } from "@/lib/schemas/AuthSchema";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { post } from "@/lib/server";
import { FORGOT_PASSWORD_URL } from "@/lib/utils/constants";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleFormRequest = async (formData: ForgotPasswordFormValues) => {
    const { email } = formData;

    const { status, message, data } = await post({
      url: FORGOT_PASSWORD_URL,
      payload: { email },
    });
    if (status) {
      // router.push("/");

      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const { mutate, isPending } = useMutation({ mutationFn: handleFormRequest });

  const handleSubmit = (data: ForgotPasswordFormValues) => {
    mutate(data);
  };

  // const onSubmit = async (data: ForgotPasswordFormValues) => {
  //   setIsLoading(true);

  //   try {
  //     const success = resetPassword(data.email);
  //     if (success) {
  //       setIsEmailSent(true);
  //       toast({
  //         title: "Reset email sent",
  //         description: "Check your email for password reset instructions",
  //       });
  //     } else {
  //       toast({
  //         title: "Email not found",
  //         description: "No account found with this email address",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "An error occurred while sending reset email",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
            Reset your password
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: "#009A44" }}>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl font-bold text-gray-900 lg:text-2xl">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              {isEmailSent
                ? "Check your email for reset instructions"
                : "Enter your email to receive reset instructions"}{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEmailSent ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 p-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Email Sent!
                  </h3>
                  <p className="text-gray-600">
                    We've sent password reset instructions to{" "}
                    <span className="font-semibold">
                      {form.getValues("email")}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or try
                    again.
                  </p>
                </div>
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Try Different Email
                </Button>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-5"
                  >
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
                    <LoadingButton
                      type="submit"
                      className="h-10 w-full bg-primary text-white hover:bg-primary/90 lg:h-12"
                      isLoading={isPending}
                    >
                      Send Reset Instructions
                    </LoadingButton>
                  </form>
                </Form>

                {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form> */}
              </>
            )}

            <div className="space-y-4 text-center">
              <div className="text-sm text-gray-600">
                Remember your password?{" "}
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
