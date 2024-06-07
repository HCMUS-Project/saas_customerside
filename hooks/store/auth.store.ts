import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isAuthorized: boolean;
  domain: string;
  setIsAuthorized: (isAuthorized: boolean) => void;
  reset: () => void;
}

const useAuthStore = create<AuthStoreState>()(
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
