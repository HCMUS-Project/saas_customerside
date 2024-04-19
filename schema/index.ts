import * as z from "zod";
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "please enter valid email",
  }),
  name: z.string().min(1, {
    message: "please enter your name",
  }),
  phone: z.string().min(1, {
    message: "please enter your phone number",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters long",
  }),
  confirmPassword: z.string().min(6, {
    message: "password must be at least 6 characters long",
  }),
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
