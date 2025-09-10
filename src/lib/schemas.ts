import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  body: z
    .string()
    .min(1, "Body is required")
    .min(3, "Body must be at least 3 characters"),
});

export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
