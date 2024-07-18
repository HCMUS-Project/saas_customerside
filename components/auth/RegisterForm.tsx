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
import CardWrapper from "./CardWrapper";
import { RegisterSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { PasswordIput } from "../ui/passwordInput";
import { useRouter } from "next/navigation";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";

import { useProfileStore } from "@/hooks/store/profile.store";
import Swal from "sweetalert2";
import { useLanguage } from "@/hooks/use-language";
import { error } from "console";
import { Mail } from "lucide-react";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const profileStore = useProfileStore();
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const lang = useLanguage();

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);

    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.signUp,
        params: {
          email: data.email,
          username: data.username,
          phone: data.phone,
          password: data.password,
          domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
          // Assuming device is constant
        },
      });

      Swal.fire({
        icon: "success",
        title: `${lang.curLangPack.noti?.["registerComplete"]}`,
      });

      router.push("/auth/registerOTP");
    } catch (error: unknown) {
      console.error("Error during registration:", error);

      // if (error instanceof AxiosError) {
      //   const statusCode = error.response?.status;
      //   const errorMessage = error.response?.data.message;
      //   if (error.response?.statusCode === 400) {
      //     Swal.fire({
      //       icon: "error",
      //       title: "Validation Error",
      //       text: error.response.data.message,
      //     });
      //   } else if (error.response?.statusCode === 403) {
      //     Swal.fire({
      //       icon: "error",
      //       title: "Oops...",
      //       text: `${lang.curLangPack.noti?.["userRegisted"]}`,
      //     });
      //   } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${lang.curLangPack.noti?.["somethingWrong"]}`,
      });
      // }
    } finally {
      setLoading(false);
    }
  };
  const { pending } = useFormStatus();
  return (
    <CardWrapper
      label={lang.curLangPack.auth?.["welcome"]}
      title={lang.curLangPack.auth?.["signUp"]}
      backButtonTitle={lang.curLangPack.auth?.["haveAccount"]}
      backButtonHref="/auth/login"
      backButtonLabel="Sign in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang.curLangPack.auth?.["email"]}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={lang.curLangPack.auth?.["inputEmail"]}
                      suffix={<Mail />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              {" "}
              {/* Added flex container */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{lang.curLangPack.auth?.["username"]}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="name"
                        placeholder={lang.curLangPack.auth?.["username"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{lang.curLangPack.auth?.["phone"]}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="phone"
                        placeholder={lang.curLangPack.auth?.["phone"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang.curLangPack.auth?.["password"]}</FormLabel>
                  <FormControl>
                    <PasswordIput
                      {...field}
                      placeholder={lang.curLangPack.auth?.["password"]}
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
                  <FormLabel>
                    {lang.curLangPack.auth?.["confirmPass"]}
                  </FormLabel>
                  <FormControl>
                    <PasswordIput
                      {...field}
                      placeholder={lang.curLangPack.auth?.["passInput"]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            style={{
              backgroundColor: profileStore.buttonColor,
              color: profileStore.buttonTextColor,
            }}
            type="submit"
            className="w-full"
            disabled={pending}
          >
            {loading
              ? `${lang.curLangPack.auth?.["loading"]}`
              : `${lang.curLangPack.auth?.["signUp"]}`}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
