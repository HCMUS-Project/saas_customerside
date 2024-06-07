"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface HeaderProps {
  children?: React.ReactNode;
}

const NavLinks = () => (
  <div className="flex justify-evenly gap-48">
    <Link href="/">Trang Chu</Link>
    <Link href="/bookings">Dich Vu</Link>
    <Link href="/product">San Pham</Link>
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    try {
      await AXIOS.GET({ uri: authEndpoint.logOut });
      localStorage.removeItem("AT"); // Xóa token khỏi localStorage
      authStore.setIsAuthorized(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return isDesktop ? (
    <div
      className="px-[10%] flex justify-between h-[60px] items-center bg-accent border rounded-sm"
      style={{
        backgroundColor: profileStore.headerColor,
        color: profileStore.headerTextColor,
      }}
    >
      <Image
        src={profileStore.logo}
        alt="Logo"
        width={40}
        height={40}
        className="ml-4"
      />
      <NavLinks />
      {authStore.isAuthorized ? (
        <div className="flex items-center">
          <UserMenu onLogout={handleLogout} />
          <Button
            className="fixed bottom-5 right-5 z-10 flex items-center justify-center w-12 h-12 rounded-full"
            onClick={handleCartClick}
            style={{ bottom: "20px", right: "20px" }}
          >
            <ShoppingCart className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleLoginClick}
          className="my-2 mr-4 bg-secondary-focus bg-opacity-80"
        >
          Dang nhap
        </Button>
      )}
    </div>
  ) : (
    <Drawer direction="left">
      <DrawerTrigger>
        <div className="px-4 py-2">
          <MenuIcon size={24} />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <Image
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1395880969.1710252000&semt=sph"
            alt="Logo"
            width={40}
            height={40}
            className="ml-4"
          />
        </DrawerHeader>
        <div className="flex flex-col gap-4 pl-5 my-5">
          <Link href="/">Trang Chu</Link>
          <Link href="/bookings">Dich Vu</Link>
          <Link href="/product">San Pham</Link>
          {authStore.isAuthorized ? (
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/user-info">Profile</Link>
              <Link href="/">Settings</Link>
              <Link href="#" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          ) : (
            <Button
              onClick={handleLoginClick}
              className="my-2 mr-4 bg-secondary-focus bg-opacity-80"
            >
              Dang nhap
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
