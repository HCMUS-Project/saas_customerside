"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { LoginSchema, OTPSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Mail } from "lucide-react";
import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { PasswordIput } from "@/components/ui/passwordInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data: z.infer<typeof OTPSchema>) => {
    setLoading(true);
    console.log(data);
  };
  const { pending } = useFormStatus();
  const handleOtpSent = async () => {
    // Replace with your actual OTP sending logic (e.g., API call)
    const otpSent = await sendOtp(); // Simulate OTP sending

    if (otpSent) {
      // OTP sent successfully, navigate to "forgetPassword/OTP" route
      router.push(`forgetPassword/OTP`);
    } else {
      // Handle OTP sending failure (e.g., display error message)
      console.error("Failed to send OTP"); // Replace with appropriate error handling
    }
  };

  // Function to simulate OTP sending (replace with your actual implementation)
  const sendOtp = async () => {
    // Simulate asynchronous behavior
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000)); // Simulate 1 second delay
  };
  return (
    <CardWrapper
      label="Welcome to Lorem"
      title="Forgot Password"
      backButtonTitle="No Account?"
      backButtonHref="/auth/register"
      backButtonLabel="Sign up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your Email or Username</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" suffix={<Mail />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              variant="ghost"
              disabled={pending}
              onClick={handleOtpSent} // Call a function to handle OTP sending logic
            >
              {loading ? "Loading..." : "Send OTP"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgetPasswordForm;
