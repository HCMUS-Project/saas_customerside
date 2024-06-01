import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthorized: false,
      domain: "",
      setIsAuthorized: (isAuthorized: boolean) => set(() => ({ isAuthorized })),
      setDomain: (domain: string) => set(() => ({ domain })),
      reset: () => set(() => ({ isAuthorized: false })),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export { useAuthStore };
