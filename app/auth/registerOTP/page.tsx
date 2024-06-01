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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import CardWrapper from "@/components/auth/CardWrapper";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authEndpoint } from "@/constants/api/auth.api";
import { AXIOS } from "@/constants/network/axios";
import { useRouter } from "next/navigation";
import { RegisterOTPFSchema } from "@/schema";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { getDomain } from "@/util/get-domain";

export default function RegisterOTP() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(RegisterOTPFSchema),
    defaultValues: {
      email: "",
      pin: "",
    },
  });
  const sendMailOTP = async () => {
    try {
      setLoading(true);
      // Gọi API sendMailOTP để gửi lại mã OTP qua email
      const response = await AXIOS.POST({
        uri: authEndpoint.sendMailOTP,
        params: {
          domain: getDomain(),
          email: form.getValues("email"), // Sử dụng email từ form
        },
      });
      console.log("New OTP sent successfully");
    } catch (error) {
      console.error("Failed to send new OTP:", error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: z.infer<typeof RegisterOTPFSchema>) => {
    setLoading(true);
    console.log(data);

    try {
      // Call the verifyAccount API
      const response = await AXIOS.POST({
        uri: authEndpoint.verifyAccount,
        params: {
          domain: "30shine.com",
          email: data.email,
          otp: data.pin,
        },
      });

      // If verification is successful, redirect to the home page
      if (response.status === 200) {
        router.push("/"); // Redirect to the home page
      }
    } catch (error) {
      // Handle error
      console.error("Verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label="Welcome to Lorem"
      title="Register OTP"
      backButtonTitle="No Account?"
      backButtonHref="/auth/register"
      backButtonLabel="Sign up"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="please enter your email address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  <div>Please enter OTP</div>
                  <Button className="pl-0" variant="link" onClick={sendMailOTP}>
                    Resend OTP
                  </Button>
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
