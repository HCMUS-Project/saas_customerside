"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { MenuIcon, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getJwt } from "@/util/auth.util";
import { useAuthStore } from "@/hooks/store/auth.store";
import { useProfileStore } from "@/hooks/store/profile.store";
import CartButton from "./cart-button";

interface HeaderProps {
  children?: React.ReactNode;
}

const NavLinks = ({ currentPath }: { currentPath: string }) => (
  <div className="flex justify-start gap-8">
    <Link
      className={`hover:text-white ${currentPath === "/" && "text-white"}`}
      href="/"
    >
      Home
    </Link>
    <Link
      className={`hover:text-white ${
        currentPath === "/bookings" && "text-white"
      }`}
      href="/bookings"
    >
      Services
    </Link>
    <Link
      className={`hover:text-white ${
        currentPath === "/product" && "text-white"
      }`}
      href="/product"
    >
      Products
    </Link>
  </div>
);

const UserMenu = ({ onLogout }: { onLogout: () => void }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push("/user-info")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button onClick={onLogout}>Logout</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    try {
      await AXIOS.GET({ uri: authEndpoint.logOut });
      localStorage.removeItem("AT");
      authStore.setIsAuthorized(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <div
        className="w-full"
        style={{
          backgroundColor: profileStore.headerColor,
          color: profileStore.headerTextColor,
        }}
      >
        <div className="container mx-auto flex justify-start h-[60px] items-center px-4">
          <Link href="/">
            <Image
              src={profileStore.logo}
              alt="Logo"
              width={40}
              height={40}
              className="ml-4 mr-8"
            />
          </Link>
          <NavLinks currentPath={currentPath} />
          {authStore.isAuthorized ? (
            <div className="flex items-center ml-auto">
              <UserMenu onLogout={handleLogout} />
              <div
                style={{
                  backgroundColor: profileStore.headerColor,
                  color: profileStore.headerTextColor,
                }}
              >
                <CartButton />
              </div>
            </div>
          ) : (
            <Button
              onClick={handleLoginClick}
              className="my-2 mr-4 bg-secondary-focus bg-opacity-80 ml-auto"
            >
              Login
            </Button>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};
