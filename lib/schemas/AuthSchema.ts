import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});

export const SignupSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});
