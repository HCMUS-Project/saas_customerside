"use client";

import { configEnpoints } from "@/constants/api/config.api";
import { AXIOS } from "@/constants/network/axios";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useEffect, useRef, useState } from "react";

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  const profileStore = useProfileStore();
  const loadingRef = useRef(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const apiToFetch = [
          AXIOS.GET({
            uri: configEnpoints.findProfile,
            params: { domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN },
          }),
          AXIOS.GET({
            uri: configEnpoints.findTheme,
            params: {
              domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
            },
          }),
        ];

        const res = await Promise.all(apiToFetch);

        profileStore.setProfile(res[0].data?.tenantProfile);
        profileStore.setTheme(res[1].data?.themeConfig);
      } catch (error) {
      } finally {
        loadingRef.current = false;
      }
    };

    fetchThemes();
  }, []);

  if (loadingRef.current) return null;

  return <>{children}</>;
};

export default CustomThemeProvider;
