import { authEndpoint } from "@/constants/api/auth.api";
import { AXIOS, setInterceptorAccessToken } from "@/constants/network/axios";
import nookies from "nookies";

export const parseJwt = (token: string) => {
  if (!token) return null;

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT token format");
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  return {
    encodedHeader,
    encodedPayload,
    signature,
  };
};

export const parseJwtBody = (token: string) => {
  if (!token) return null;

  const jwt = parseJwt(token);

  if (!jwt) return null;

  return JSON.parse(atob(jwt.encodedPayload));
};

export const storeJwt = (token: string, type: string) => {
  if (!token) return;

  const jwt = parseJwt(token);

  if (!jwt) return;

  localStorage.setItem(`jwtHeader${type}`, jwt.encodedHeader);
  localStorage.setItem(`jwtPayload${type}`, jwt.encodedPayload);

  if (type === "AT") {
    setInterceptorAccessToken(token);
  }

  const exp = new Date(JSON.parse(atob(jwt.encodedPayload)).exp * 1000);

  nookies.set(null, `jwtSignature${type}`, jwt.signature, {
    path: "/",
    expires: exp,
  });
};

export const getJwt = (type: string) => {
  const header = localStorage.getItem(`jwtHeader${type}`);
  const payload = localStorage.getItem(`jwtPayload${type}`);
  const cookies = nookies.get(null);
  const signature = cookies[`jwtSignature${type}`];

  if (!header || !payload || !signature) {
    return null;
  }

  return `${header}.${payload}.${signature}`;
};

const fetchRefreshToken = async ({ router }: { router: any }) => {
  try {
    const refreshToken = getJwt("RT");

    const response = await AXIOS.POST({
      uri: authEndpoint.refeshToken,
      params: {
        refreshToken,
      },
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      const { accessToken, refreshToken } = response.data;
      storeJwt(accessToken, "AT");
      storeJwt(refreshToken, "RT");
    }

    throw new Error("Invalid refresh token");
  } catch (error) {
    router.push("/sign-in");
  }
};
