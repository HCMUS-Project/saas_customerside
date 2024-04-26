import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export const AXIOS = {
  ENCODE_FORM_DATA: (data: any) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    return formData;
  },

  GET: async ({
    uri,
    params,
    token,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
  }) => {
    try {
      const res = await API.get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: params,
      });

      return res.data;
    } catch (err: any) {
      return err.response;
    }
  },

  POST: async ({
    uri,
    params,
    token,
    hasFile,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
    hasFile?: boolean;
  }) => {
    try {
      const data = hasFile ? AXIOS.ENCODE_FORM_DATA(params) : params;
      const res = await API.post(uri, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(hasFile
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
          Accept: "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      return error.response;
    }
  },

  POST_DOWNLOAD_FILE: async ({
    uri,
    params,
    token,
    hasFile,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
    hasFile?: boolean;
  }) => {
    try {
      const res = await API.post(uri, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/*",
        },
        responseType: "blob",
      });

      return res.data;
    } catch (error: any) {
      return error.response;
    }
  },

  PUT: async ({
    uri,
    params,
    token,
    hasFile,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
    hasFile?: boolean;
  }) => {
    try {
      const data = hasFile ? AXIOS.ENCODE_FORM_DATA(params) : params;

      const res = await API.put(uri, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(hasFile
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
          Accept: "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      return error.response;
    }
  },

  PATCH: async ({
    uri,
    params,
    token,
    hasFile,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
    hasFile?: boolean;
  }) => {
    try {
      const data = hasFile ? AXIOS.ENCODE_FORM_DATA(params) : params;

      const res = await API.patch(uri, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(hasFile
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
          Accept: "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      return error.response;
    }
  },

  DELETE: async ({
    uri,
    params,
    token,
  }: {
    uri: string;
    params?: object;
    token?: string | undefined;
  }) => {
    try {
      const res = await API.delete(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: params,
      });

      return res.data;
    } catch (error: any) {
      return error.response;
    }
  },
};
