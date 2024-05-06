import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email",
    }),
    username: z.string().min(1, {
      message: "Please enter your name",
    }),
    phone: z.string().min(1, {
      message: "Please enter your phone number",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
export const LoginSchema = z.object({
  email: z.string().email({
    message: "please enter your email",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters long",
  }),
});

export const OTPSchema = z.object({
  email: z.string().email({
    message: "please enter valid email",
  }),
});
export const RegisterOTPFSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
