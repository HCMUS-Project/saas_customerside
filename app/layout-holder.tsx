"use client";

import Footer from "@/components/footer/footer";
import { Header } from "@/components/headers/header";
import CustomThemeProvider from "@/components/providers/custom-theme-provider";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useMediaQuery } from "@/hooks/use-media-query";

interface LayoutHolderProps {
  children: React.ReactNode;
}

const LayoutHolder: React.FC<LayoutHolderProps> = ({ children }) => {
  const profileStore = useProfileStore();
  const isDesktop = useMediaQuery("(min-width:768px)");

  return (
    <CustomThemeProvider>
      <Header />
      <div
        className={isDesktop ? "px-[10%]" : "px-[5%]"}
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
