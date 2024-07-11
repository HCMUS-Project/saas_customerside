import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  curLang: string;
  setCurLang: (lang: string) => void;
  curLangPack: Record<string, any>;
  en: () => Promise<Record<string, any>>;
  vi: () => Promise<Record<string, any>>;
}

const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      curLang: "vi",
      curLangPack: {},
      setCurLang: async (lang: string) => {
        let newLangPack = {};

        switch (lang) {
          case "en":
            newLangPack = await useLanguage.getState().en();
            break;
          case "vi":
            newLangPack = await useLanguage.getState().vi();
            break;
          default:
            newLangPack = await useLanguage.getState().vi();
            break;
        }

        set({ curLang: lang, curLangPack: newLangPack });
      },
      en: () => import("@/locales/en.json").then((module) => module.default),
      vi: () => import("@/locales/vi.json").then((module) => module.default),
    }),
    {
      name: "language-storage",
      getStorage: () => localStorage,
    }
  )
);

useLanguage.getState().setCurLang(useLanguage.getState().curLang);

export { useLanguage };
