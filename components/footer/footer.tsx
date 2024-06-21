"use client";

import { useProfileStore } from "@/hooks/store/profile.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const profileStore = useProfileStore();

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
            <h2 className="mb-6 text-sm font-semibold ">Information</h2>
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
                        <div>{profileStore.description}</div>
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
            <h2 className="mb-6 text-sm font-semibold">Legal</h2>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="/legal/policy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/legal/term" className="hover:underline">
                  Term Of Use
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold ">Social Contact</h2>
            <ul className="space-y-2 font-medium">
              <li>
                <a href={profileStore.youtubeUrl} className="hover:underline">
                  <div className="flex items-center gap-2">
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
