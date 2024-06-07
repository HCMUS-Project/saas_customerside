import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthorized: boolean;
  domain: string;
  email: string;
  setIsAuthorized: (isAuthorized: boolean) => void;
  setDomain: (domain: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
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
