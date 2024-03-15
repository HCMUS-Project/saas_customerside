"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isDesktop ? (
    <div className="px-[10%] flex justify-between h-[60px] items-center bg-accent border rounded-sm">
      <Image
        src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1395880969.1710252000&semt=sph"
        alt="Logo"
        width={40}
        height={40}
        className="ml-4"
      />

      <div className="flex justify-evenly gap-48">
        <Link href="/">Trang Chu</Link>
        <Link href="/">Dich Vu</Link>
        <Link href="/">San Pham</Link>
      </div>

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/">Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href="/">Settings</Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href="/">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => {}}
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
          <Link href="/">Dich Vu</Link>
          <Link href="/">San Pham</Link>

          {isLoggedIn ? (
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/">Profile</Link>
              <Link href="/">Settings</Link>
              <Link href="/">Logout</Link>
            </div>
          ) : (
            <Button
              onClick={() => {}}
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
