import * as z from "zod";

export const authorLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter"),
});

export const authorSignUpSchema = authorLoginSchema.extend({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().optional(),
});
