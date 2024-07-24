"use client";

import Footer from "@/components/footer/footer";
import CartButton from "@/components/headers/cart-button";
import { Header } from "@/components/headers/header";
import CustomThemeProvider from "@/components/providers/custom-theme-provider";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import SocketLayer from "./layers/socket-layers";
import Head from "next/head";

interface LayoutHolderProps {
  children: React.ReactNode;
}

const LayoutHolder: React.FC<LayoutHolderProps> = ({ children }) => {
  const profileStore = useProfileStore();
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [favicon, setFavicon] = useState<string>("");

  useEffect(() => {
    if (profileStore.logo) {
      setFavicon(profileStore.logo);
    }
  }, [profileStore.logo]);

  useEffect(() => {
    if (favicon) {
      const link: HTMLLinkElement | null =
        document.querySelector("link[rel='icon']");
      if (link) {
        link.href = favicon;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.type = "image/x-icon";
        newLink.href = favicon;
        document.head.appendChild(newLink);
      }
    }
  }, [favicon]);

  return (
    <CustomThemeProvider>
      <Head>
        <link rel="icon" type="image/x-icon" sizes="32x32" href={favicon} />
      </Head>

      <SocketLayer>
        <Header />

        <div
          className={cn(
            isDesktop ? "px-[10%]" : "px-[5%]",
            "flex-1 overflow-y-auto"
          )}
          style={{
            backgroundColor: profileStore.bodyColor,
            color: profileStore.bodyTextColor,
          }}
        >
          {children}
        </div>
        <Footer />
      </SocketLayer>
    </CustomThemeProvider>
  );
};

export default LayoutHolder;
