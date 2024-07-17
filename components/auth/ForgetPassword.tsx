"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { OTPSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import Swal from "sweetalert2";
import { useLanguage } from "@/hooks/use-language";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      email: "",
    },
  });
  const lang = useLanguage();

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
        title: lang.curLangPack.noti?.["OTPSend"],
      });

      // Save email to local storage
      localStorage.setItem("email", form.getValues("email"));

      // Navigate to change password page
      router.push("forgetPassword/changePass");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: lang.curLangPack.noti?.["somethingWrong"],
      });
      console.error("Failed to send OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    handleOtpSent();
  };

  return (
    <CardWrapper
      label={lang.curLangPack.auth?.["welcome"]}
      title={lang.curLangPack.auth?.["forgot"]}
      backButtonTitle={lang.curLangPack.auth?.["noAccount"]}
      backButtonHref="/auth/register"
      backButtonLabel={lang.curLangPack.auth?.["signUp"]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang.curLangPack.auth?.["inputEmail"]}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={lang.curLangPack.auth?.["email"]}
                      type="email"
                      suffix={<Mail />}
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
                : lang.curLangPack.auth?.["sendOTP"]}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgetPasswordForm;
