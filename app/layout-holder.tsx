"use client";

import Footer from "@/components/footer/footer";
import CartButton from "@/components/headers/cart-button";
import { Header } from "@/components/headers/header";
import CustomThemeProvider from "@/components/providers/custom-theme-provider";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LayoutHolderProps {
  children: React.ReactNode;
}

const LayoutHolder: React.FC<LayoutHolderProps> = ({ children }) => {
  const profileStore = useProfileStore();
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [favicon, setFavicon] = useState<string>("");

  // const useFavicon = (url: string) => {
  //   useEffect(() => {
  //     const updateFavicon = () => {
  //       try {
  //         if (!document.head) throw new Error("Document head not available");

  //         const link = document.createElement("link");
  //         link.rel = "icon";
  //         link.href = url;

  //         const oldLink = document.querySelector('link[rel="icon"]');
  //         if (oldLink) {
  //           document.head.removeChild(oldLink);
  //         }
  //         document.head.appendChild(link);
  //       } catch (error) {
  //         console.error("Failed to update favicon:", error);
  //       }
  //     };

  //     updateFavicon();
  //   }, [url]);
  // };

  // useEffect(() => {
  //   if (profileStore.logo) {
  //     setFavicon(profileStore.logo);
  //   }
  // }, [profileStore.logo]);

  // useFavicon(favicon);

  return (
    <CustomThemeProvider>
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
    </CustomThemeProvider>
  );
};

export default LayoutHolder;
