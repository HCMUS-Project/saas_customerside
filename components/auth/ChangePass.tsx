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

import { ChangePasswordSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import Swal from "sweetalert2";
import { Domain } from "domain";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useLanguage } from "@/hooks/use-language";

// Define the schema for changing the password
const ChangePasswordFormSchema = ChangePasswordSchema;

const ChangePasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      email: "",
      newpassword: "",
      confirmPassword: "",
      otp: "",
    },
  });
  const lang = useLanguage();

  useEffect(() => {
    // Get email from local storage and set it as default value
    const email = localStorage.getItem("email");
    if (email) {
      form.setValue("email", email);
    }
  }, [form]);

  const handleOtpSent = async () => {
    try {
      setLoading(true);
      const response = await AXIOS.POST({
        uri: authEndpoint.sendMailForgotPassord,
        params: {
          email: form.getValues("email"),
          role: 0, // Adjust the role value if needed
          domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
        },
      });

      Swal.fire({
        icon: "success",
        title: "OTP sent successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to send OTP",
        text: "Please try again later.",
      });
      console.error("Failed to send OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof ChangePasswordFormSchema>) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.changeNewPassord,
        params: {
          email: data.email, // Use email from form state
          newpassword: data.newpassword,
          otp: data.otp,
          domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
        },
      });

      Swal.fire({
        icon: "success",
        title: lang.curLangPack.noti?.["success"],
      });

      router.push("/auth/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Opps",
        text: lang.curLangPack.noti?.["somethingWrong"],
      });
      console.error("Failed to update password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label={lang.curLangPack.auth?.["welcome"]}
      title={lang.curLangPack.auth?.["changePass"]}
      backButtonTitle={lang.curLangPack.auth?.["noAccount"]}
      backButtonHref="/auth/register"
      backButtonLabel={lang.curLangPack.auth?.["signUp"]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang.curLangPack.auth?.["OTPInput"]}</FormLabel>
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
                    <Button
                      className="pl-0"
                      variant="link"
                      type="button"
                      onClick={handleOtpSent}
                    >
                      {lang.curLangPack.auth?.["reOTP"]}
                    </Button>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang.curLangPack.auth?.["newPass"]}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={lang.curLangPack.auth?.["confirmNewPass"]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang.curLangPack.auth?.["passInput"]}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={lang.curLangPack.auth?.["confirmNewPass"]}
                    />
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
              disabled={loading}
            >
              {loading
                ? lang.curLangPack.auth?.["loading"]
                : lang.curLangPack.auth?.["changePass"]}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ChangePasswordForm;
