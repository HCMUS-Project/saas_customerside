"use client";

import { getJwt, parseJwtBody, storeJwt } from "@/util/auth.util";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authEndpoint } from "@/constants/api/auth.api";
import { AXIOS, setInterceptorAccessToken } from "@/constants/network/axios";
import { AxiosError } from "axios";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRefreshToken = async (refreshToken: string) => {
    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.refreshToken,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.statusCode >= 200 && response.statusCode < 300) {
        const { accessToken, refreshToken } = response.data;
        storeJwt(accessToken, "AT");
        setInterceptorAccessToken(accessToken);
        storeJwt(refreshToken, "RT");
      }
    } catch (error: any) {
      console.log(error.response);
      // router.push("/sign-in");
    }
  };

  useEffect(() => {
    const accessToken = getJwt("AT");
    const refreshToken = getJwt("RT");

    setLoading(true);

    if (!accessToken && refreshToken) {
      setLoading(false);

      return;
    }

    if (!accessToken || !refreshToken) {
      router.push("/auth/login");
    }

    const jwtBody = parseJwtBody(accessToken as string);

    if (jwtBody?.role < 2) {
      router.push("/auth/login");
    }

    setLoading(false);
  }, []);

  const refreshTokenInterval = 60 * 1000;

  useEffect(() => {
    const refreshToken = getJwt("RT");

    const interval = setInterval(() => {
      console.log("Kiểm tra RF");
      fetchRefreshToken(refreshToken as string);
    }, refreshTokenInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {loading ? (
        <div>
          <div className="flex justify-center items-center h-screen w-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AuthGuard;
