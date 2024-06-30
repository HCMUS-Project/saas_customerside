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
import { Menu as MenuIcon, ShoppingCart } from "lucide-react";
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
  <nav className="hidden lg:flex gap-4 sm:gap-6">
    <Link
      className={`text-sm font-medium hover:underline underline-offset-4 ${
        currentPath === "/" && "text-white"
      }`}
      href="/"
    >
      Home
    </Link>
    <Link
      className={`text-sm font-medium hover:underline underline-offset-4 ${
        currentPath === "/bookings" && "text-white"
      }`}
      href="/bookings"
    >
      Services
    </Link>
    <Link
      className={`text-sm font-medium hover:underline underline-offset-4 ${
        currentPath === "/product" && "text-white"
      }`}
      href="/product"
    >
      Products
    </Link>
  </nav>
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
        <div className="container mx-auto flex justify-between h-[60px] items-center px-4">
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
          <div className="flex gap-2 items-center">
            {authStore.isAuthorized ? (
              <>
                <UserMenu onLogout={handleLogout} />
                <div
                  style={{
                    backgroundColor: profileStore.headerColor,
                    color: profileStore.headerTextColor,
                  }}
                >
                  <CartButton />
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleLoginClick}>
                  Sign In
                </Button>
                <Button
                  style={{
                    backgroundColor: profileStore.buttonColor,
                    color: profileStore.headerTextColor,
                  }}
                  onClick={() => router.push("/auth/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};
