"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "./CardWrapper";
import { LoginSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PasswordIput } from "../ui/passwordInput";
import { Mail } from "lucide-react";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import { useRouter } from "next/navigation";
import { storeJwt } from "@/util/auth.util";

import { useAuthStore } from "@/hooks/store/auth.store";

import Swal from "sweetalert2";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useLanguage } from "@/hooks/use-language";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  // const { setIsLoggedIn } = useAuth(); // Sử dụng AuthContext
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const lang = useLanguage();

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.signIn,
        params: {
          domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
          email: data.email,
          password: data.password,
        },
      });
      const { accessToken, refreshToken } = response.data;
      storeJwt(accessToken, "AT");
      storeJwt(refreshToken, "RT");
      authStore.setIsAuthorized(true);
      Swal.fire({
        icon: "success",
        title: `${lang.curLangPack.noti?.["loginComplete"]}`,
      });
      router.push("/"); // Chuyển hướng đến trang chủ
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${lang.curLangPack.noti?.["somethingWrong"]}`,
      });
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label={lang.curLangPack.auth?.["welcome"]}
      title={lang.curLangPack.auth?.["signIn"]}
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
          </div>
          <div>
            <Button
              style={{
                backgroundColor: profileStore.buttonColor,
                color: profileStore.buttonTextColor,
              }}
              type="submit"
              className="w-full "
              variant="ghost"
              disabled={loading}
            >
              {loading
                ? `${lang.curLangPack.auth?.["loading"]}`
                : `${lang.curLangPack.auth?.["login"]}`}
            </Button>
            <Link href="/auth/forgetPassword">
              <Button variant="link" className="text-xs text-left font-light">
                {lang.curLangPack.auth?.["forgot"]}
              </Button>
            </Link>
          </div>
          {/* <p className="text-center font-extralight">OR</p> */}
          {/* <div className="flex">
            <div className="flex justify-between w-full space-x-2">
              <Link href="/auth/google">
                <Button
                  variant="ghost"
                  className="w-full flex bg-blue-200 px-8"
                >
                  <Image
                    src="/images/google.png"
                    alt="Google"
                    width={30}
                    height={30}
                    className="pr-2"
                  />
                  Sign In with Google
                </Button>
              </Link>
              <Button variant="ghost" className="w-full flex bg-blue-200 pr-2">
                <Image
                  src="/images/facebook.png"
                  alt="Facebook"
                  width={30}
                  height={30}
                  className="pr-2"
                />
                Sign In with Facebook
              </Button>
            </div>
          </div> */}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
