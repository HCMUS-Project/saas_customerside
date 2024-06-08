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
    >
      <div className="flex justify-around mx-[10%] max-w-screen-xl">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 px-4 py-6 lg:py-8 ">
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-sm font-semibold ">Information</h2>
            <ul>
              <li className="mb-4">{profileStore.serviceName}</li>
              <li className="mb-4">{profileStore.address}</li>
              <li className="mb-4">
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
            <ul className=" font-medium">
              <li className="mb-4">
                <a href="/legal/policy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-4">
                <a href="/legal/term" className="hover:underline">
                  Term Of Use
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold ">Social Contact</h2>
            <ul className=" font-medium">
              <li className="mb-4">
                <a href={profileStore.youtubeUrl} className="hover:underline">
                  <div className="flex gap-4">
                    <Youtube /> Youtube
                  </div>
                </a>
              </li>
              <li className="mb-4">
                <a href={profileStore.instagramUrl} className="hover:underline">
                  <div className="flex gap-4">
                    <Instagram /> Instagram
                  </div>
                </a>
              </li>
              <li className="mb-4">
                <a href={profileStore.facebookUrl} className="hover:underline">
                  <div className="flex gap-4">
                    {" "}
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
