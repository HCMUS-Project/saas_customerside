"use client";

import { useProfileStore } from "@/hooks/store/profile.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Footer() {
  const profileStore = useProfileStore();
  const lang = useLanguage();

  return (
    <footer
      style={{
        backgroundColor: profileStore.footerColor,
        color: profileStore.footerTextColor,
      }}
      className="py-6"
    >
      <div className="flex justify-center w-full max-w-screen-xl mx-auto">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 px-4 py-6 lg:py-8">
          <div>
            <h2 className="mb-6 text-sm font-semibold drop-shadow-lg ">
              {lang.curLangPack.footer?.["information"]}
            </h2>
            <ul className="space-y-2">
              <li>{profileStore.serviceName}</li>
              <li>{profileStore.address}</li>
              <li>
                {profileStore.description.length > 30 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {profileStore.description.slice(0, 30) + "..."}
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="drop-shadow-lg">
                          {profileStore.description}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  profileStore.description
                )}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold drop-shadow-lg">
              {lang.curLangPack.footer?.["legal"]}
            </h2>
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="/legal/policy"
                  className="drop-shadow-lg hover:underline"
                >
                  {lang.curLangPack.footer?.["privacy"]}
                </a>
              </li>
              <li>
                <a
                  href="/legal/term"
                  className="drop-shadow-lg hover:underline"
                >
                  {lang.curLangPack.footer?.["term"]}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold drop-shadow-lg ">
              {lang.curLangPack.footer?.["social"]}
            </h2>
            <ul className="space-y-2 font-medium">
              <li>
                <a href={profileStore.youtubeUrl} className="hover:underline">
                  <div className="drop-shadow-lg flex items-center gap-2">
                    <Youtube /> Youtube
                  </div>
                </a>
              </li>
              <li>
                <a href={profileStore.instagramUrl} className="hover:underline">
                  <div className="flex items-center gap-2">
                    <Instagram /> Instagram
                  </div>
                </a>
              </li>
              <li>
                <a href={profileStore.facebookUrl} className="hover:underline">
                  <div className="flex items-center gap-2">
                    <Facebook /> Facebook
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
