import { getJwt, storeJwt } from "@/util/auth.util";
import axios, { AxiosError } from "axios";
import { authEndpoint } from "../api/auth.api";
import { useAuthStore } from "@/hooks/store/auth.store";

const authStore = useAuthStore.getState();

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

API.interceptors.request.use(async (config) => {
  const token = getJwt("AT");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = getJwt("RT");

          originalRequest.headers.Authorization = `Bearer ${refreshToken}`;
          const refreshNewToken = await AXIOS.POST({
            uri: authEndpoint.refreshToken,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshNewToken.data;

          storeJwt(newAccessToken, "AT");
          storeJwt(newRefreshToken, "RT");

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return await API(originalRequest);
        } catch (err) {
          authStore.setIsAuthorized(false);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export const setInterceptorAccessToken = (token: string) => {
  API.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export const AXIOS = {
  ENCODE_FORM_DATA: (data: any) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    return formData;
  },

  GET: async ({ uri, params }: { uri: string; params?: object }) => {
    const res = await API.get(uri, {
      params: params,
    });

    return res.data;
  },

  POST: async ({
    uri,
    params,
    headers,
    hasFile,
  }: {
    uri: string;
    params?: object;
    headers?: object;
    hasFile?: boolean;
  }) => {
    const data = hasFile ? AXIOS.ENCODE_FORM_DATA(params) : params;
    const res = await API.post(uri, data, {
      headers: {
        ...(headers || {}),
        ...(hasFile
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        Accept: "application/json",
      },
    });

    return res.data;
  },

  POST_DOWNLOAD_FILE: async ({
    uri,
    params,
    hasFile,
  }: {
    uri: string;
    params?: object;
    hasFile?: boolean;
  }) => {
    const res = await API.post(uri, params, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/*",
      },
      responseType: "blob",
    });

    return res.data;
  },

  PUT: async ({
    uri,
    params,
    hasFile,
  }: {
    uri: string;
    params?: object;
    hasFile?: boolean;
  }) => {
    const data = hasFile ? AXIOS.ENCODE_FORM_DATA(params) : params;

    const res = await API.put(uri, data, {
      headers: {
        ...(hasFile
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        Accept: "application/json",
      },
    });

    return res.data;
  },

  PATCH: async ({
    uri,
    params,
    hasFile,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
    hasFile?: boolean;
  }) => {
    const data = hasFile ? AXIOS.ENCODE_FORM_DATA(params) : params;

    const res = await API.patch(uri, data, {
      headers: {
        ...(hasFile
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        Accept: "application/json",
      },
    });

    return res.data;
  },

  DELETE: async ({
    uri,
    params,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
  }) => {
    const res = await API.delete(uri, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: params,
    });

    return res.data;
  },
};
