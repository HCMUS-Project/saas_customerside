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
import { LoginSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PasswordIput } from "../ui/passwordInput";
import { Mail } from "lucide-react";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import { useRouter } from "next/navigation";
// import { useAccessToken } from "@/app/AccessTokenContext";
import { storeJwt } from "@/util/auth.util";

const LoginForm = () => {
  // const { setAccessToken } = useAccessToken();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.signIn,
        params: {
          domain: "30shine.com",
          email: data.email,
          password: data.password,
        },
      });
      if (response.statusCode >= 200 && response.statusCode < 300) {
        const { accessToken, refreshToken } = response.data;
        storeJwt(accessToken, "AT");
        storeJwt(refreshToken, "RT");
        // const accessToken = response.data.accessToken;
        // setAccessToken(accessToken); // Đặt access token vào Context
        router.push("/"); // Chuyển hướng đến trang chủ
      } else {
        console.error("Login failed"); // Thông báo đăng nhập thất bại
      }
    } catch (error) {
      console.error("Error logging in:", error); // Xử lý lỗi khi gửi yêu cầu đăng nhập
    } finally {
      setLoading(false);
    }
  };
  const { pending } = useFormStatus();
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
              className="w-full bg-blue-500 "
              variant="ghost"
              disabled={pending}
            >
              {loading ? " Loading..." : "Log in"}
            </Button>
            <Link href="/auth/forgetPassword">
              <Button variant="link" className="text-xs text-left font-light">
                Forgot password?
              </Button>
            </Link>
          </div>

          <p className=" text-center font-extralight">OR</p>
          <div className="flex ">
            <div className="flex justify-between w-full space-x-2">
              <Link href="/auth/google">
                <Button
                  variant="ghost"
                  className="w-full flex  md:ml-0 bg-blue-200 px-8"
                >
                  <Image
                    src="/images/google.png"
                    alt="My image"
                    width={30}
                    height={30}
                    className=" pr-2"
                  />
                  Sign In with Google
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full flex  md:ml-0 bg-blue-200 pr-2 "
              >
                <Image
                  src="/images/facebook.png"
                  alt="My image"
                  width={30}
                  height={30}
                  className=" pr-2"
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
