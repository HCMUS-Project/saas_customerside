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

import { LoginSchema } from "@/schema";
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

const SendOTPForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    console.log(data);
  };
  const { pending } = useFormStatus();
  return (
    <CardWrapper
      label="Welcome to Lorem"
      title="Email OTP"
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
                  <FormLabel>
                    <Input type="email" placeholder="email" />
                  </FormLabel>

                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500 "
              variant="ghost"
              disabled={pending}
            >
              {loading ? " Loading..." : "Send OTP"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SendOTPForm;
