"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/hooks/store/auth.store";
import CartButton from "./cart-button";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useLanguage } from "@/hooks/use-language";

interface HeaderProps {
  children?: React.ReactNode;
}

const NavLinks = ({ currentPath }: { currentPath: string }) => {
  const { curLangPack } = useLanguage();

  return (
    <nav className="flex justify-center text-center flex-grow">
      <div className="hidden lg:flex gap-6 sm:gap-8">
        <Link
          className={`text-xl font-medium hover:underline underline-offset-4 ${
            currentPath === "/" ? "underline" : ""
          }`}
          href="/"
        >
          {curLangPack.header?.["home"]}
        </Link>
        <Link
          className={`text-xl font-medium hover:underline underline-offset-4 ${
            currentPath.includes("bookings") ? "underline" : ""
          }`}
          href="/bookings"
        >
          {curLangPack.header?.["services"]}
        </Link>
        <Link
          className={`text-xl font-medium hover:underline underline-offset-4 ${
            currentPath.includes("product") ? "underline" : ""
          }`}
          href="/product"
        >
          {curLangPack.header?.["products"]}
        </Link>
      </div>
    </nav>
  );
};

const UserMenu = ({ onLogout }: { onLogout: () => void }) => {
  const router = useRouter();
  const profileStore = useProfileStore();
  const { curLangPack } = useLanguage();

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
          {curLangPack.header?.["profile"]}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/cart")}>
          {curLangPack.header?.["cart"]}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            style={{
              backgroundColor: profileStore.buttonColor,
              color: profileStore.buttonTextColor,
            }}
            onClick={onLogout}
          >
            {curLangPack.header?.["logout"]}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const { curLangPack, curLang, setCurLang } = useLanguage();

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

  const changeLanguage = (lang: string) => {
    window.location.reload();
    setCurLang(lang);
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
        <div className="container mx-auto flex justify-between items-center p-6">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={profileStore.logo}
                alt="Logo"
                width={40}
                height={40}
                className="ml-4 mr-2"
              />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  style={{
                    backgroundColor: profileStore.buttonColor,
                    color: profileStore.buttonTextColor,
                  }}
                >
                  {curLang === "en" ? (
                    <div className="flex text-center space-x-2">
                      <Image
                        src="/images/british.jpg"
                        width={40}
                        height={40}
                        alt="british"
                        className="rounded-full p-1"
                      />{" "}
                      <span className="text-lg content-center">EN</span>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Image
                        src="/images/vietnam.png"
                        width={40}
                        height={40}
                        alt="vietnam"
                        className="rounded-full p-1"
                      />{" "}
                      <span className="text-lg content-center">VI</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  <Image
                    src="/images/british.jpg"
                    width={40}
                    height={40}
                    alt="british"
                    className="pr-2"
                  />
                  EN
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("vi")}>
                  <Image
                    src="/images/vietnam.png"
                    width={40}
                    height={40}
                    alt="vietnam"
                    className="pr-2"
                  />
                  VI
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <NavLinks currentPath={currentPath} />
          <div
            className="flex gap-2 items-center justify-end"
            style={{ minWidth: "200px" }}
          >
            {authStore.isAuthorized ? (
              <>
                <UserMenu onLogout={handleLogout} />
                <CartButton />
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleLoginClick}>
                  {curLangPack.header?.["signin"]}
                </Button>
                <Button
                  style={{
                    backgroundColor: profileStore.buttonColor,
                    color: profileStore.buttonTextColor,
                  }}
                  onClick={() => router.push("/auth/register")}
                >
                  {curLangPack.header?.["signup"]}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};
