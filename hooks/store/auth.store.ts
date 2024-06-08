import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isAuthorized: boolean;
  domain: string;
  email: string;
  setIsAuthorized: (isAuthorized: boolean) => void;
  reset: () => void;
}

const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthorized: false,
      domain: "",
      email: "",
      setIsAuthorized: (isAuthorized: boolean) => set({ isAuthorized }),
      setDomain: (domain: string) => set({ domain }),
      setEmail: (email: string) => set({ email }),
      reset: () => set({ isAuthorized: false, email: "" }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export { useAuthStore };
