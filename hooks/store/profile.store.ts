import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  logo: string;
  description: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

interface Theme {
  headerColor: string;
  headerTextColor: string;
  bodyColor: string;
  bodyTextColor: string;
  footerColor: string;
  footerTextColor: string;
  textFont: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonRadius: number;
}

interface ProfileState {
  logo: string;
  description: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  headerColor: string;
  headerTextColor: string;
  bodyColor: string;
  bodyTextColor: string;
  footerColor: string;
  footerTextColor: string;
  textFont: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonRadius: number;
  setProfile: (profile: Profile) => void;
  setTheme: (theme: Theme) => void;
  reset: () => void;
}

const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      logo: "",
      description: "",
      facebookUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      headerColor: "#000000",
      headerTextColor: "#FFFFFF",
      bodyColor: "#FFFFFF",
      bodyTextColor: "#000000",
      footerColor: "#000000",
      footerTextColor: "#FFFFFF",
      textFont: "Arial",
      buttonColor: "#0000FF",
      buttonTextColor: "#FFFFFF",
      buttonRadius: 0,
      setProfile: (profile: Profile) => {
        set({
          logo: profile.logo,
          description: profile.description,
          facebookUrl: profile.facebookUrl,
          instagramUrl: profile.instagramUrl,
          youtubeUrl: profile.facebookUrl,
        });
      },
      setTheme: (theme: Theme) => {
        set({
          headerColor: theme.headerColor,
          headerTextColor: theme.headerTextColor,
          bodyColor: theme.bodyColor,
          bodyTextColor: theme.bodyTextColor,
          footerColor: theme.footerColor,
          footerTextColor: theme.footerTextColor,
          textFont: theme.textFont,
          buttonColor: theme.buttonColor,
          buttonTextColor: theme.buttonTextColor,
          buttonRadius: theme.buttonRadius,
        });
      },
      reset: () => {
        set({
          logo: "",
          description: "",
          facebookUrl: "",
          instagramUrl: "",
          youtubeUrl: "",
          headerColor: "#000000",
          headerTextColor: "#FFFFFF",
          bodyColor: "#FFFFFF",
          bodyTextColor: "#000000",
          footerColor: "#000000",
          footerTextColor: "#FFFFFF",
          textFont: "Arial",
          buttonColor: "#0000FF",
          buttonTextColor: "#FFFFFF",
          buttonRadius: 0,
        });
      },
    }),
    {
      name: "profile-storage",
      getStorage: () => localStorage,
    }
  )
);

export { useProfileStore };
