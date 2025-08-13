import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .refine((val) => val.length === 0 || val.length >= 6, {
      message: "Password must be at least 6 characters",
    })
    .optional(),

  role: z.enum(["admin", "user"], { required_error: "Please select a role" }),
});
