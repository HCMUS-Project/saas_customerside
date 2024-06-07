"use client";

import Footer from "@/components/footer/footer";
import { Header } from "@/components/headers/header";
import CustomThemeProvider from "@/components/providers/custom-theme-provider";
import { useProfileStore } from "@/hooks/store/profile.store";

interface LayoutHolderProps {
  children: React.ReactNode;
}

const LayoutHolder: React.FC<LayoutHolderProps> = ({ children }) => {
  const profileStore = useProfileStore();

  return (
    <CustomThemeProvider>
      <Header />
      <div
        className="px-[10%]"
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
