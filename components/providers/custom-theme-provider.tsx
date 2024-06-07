"use client";

import { configEnpoints } from "@/constants/api/config.api";
import { AXIOS } from "@/constants/network/axios";
import themeOptions from "@/constants/theme-options";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  const profileStore = useProfileStore();
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);

        // setTheme("ocean-breeze");

        const apiToFetch = [
          AXIOS.GET({
            uri: configEnpoints.findProfile,
            params: { domain: "30shine.com" },
          }),
          AXIOS.GET({
            uri: configEnpoints.findTheme,
            params: {
              domain: "30shine.com",
            },
          }),
        ];

        const res = await Promise.all(apiToFetch);

        profileStore.setProfile(res[0].data?.tenantProfile);
        profileStore.setTheme(res[1].data?.themeConfig);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (loading) return null;

  return <>{children}</>;
};

export default CustomThemeProvider;
