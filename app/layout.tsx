import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutHolder from "./layout-holder";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "30Shine",
  description: "30Shine - Best place for haircut and hair treatment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LayoutHolder>{children}</LayoutHolder>
      </body>
    </html>
  );
}
