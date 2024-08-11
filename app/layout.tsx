import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutHolder from "./layout-holder";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "22NailStore",
  description: "22NailStore - Best place for treating your hands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <LayoutHolder>{children}</LayoutHolder>
      </body>
    </html>
  );
}
