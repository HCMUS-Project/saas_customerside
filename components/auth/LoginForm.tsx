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
import { getDomain } from "@/util/get-domain";

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
  const authStore: any = useAuthStore();

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.signIn,
        params: {
          domain: getDomain(),
          email: data.email,
          password: data.password,
        },
      });
      const { accessToken, refreshToken } = response.data;
      storeJwt(accessToken, "AT");
      storeJwt(refreshToken, "RT");
      authStore.setIsAuthorized(true);
      router.push("/"); // Chuyển hướng đến trang chủ
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label="Welcome to Lorem"
      title="Sign In"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="please enter your email address"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordIput {...field} placeholder="Your Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500"
              variant="ghost"
              disabled={loading}
            >
              {loading ? "Loading..." : "Log in"}
            </Button>
            <Link href="/auth/forgetPassword">
              <Button variant="link" className="text-xs text-left font-light">
                Forgot password?
              </Button>
            </Link>
          </div>
          <p className="text-center font-extralight">OR</p>
          <div className="flex">
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
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
