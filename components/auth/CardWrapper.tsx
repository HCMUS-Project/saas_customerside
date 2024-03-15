"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthHeader from "./AuthHeader";

import BackButton from "./BackButton";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

interface cardWrapperProps {
  label: string;
  title: string;
  backButtonHref: string;
  backButtonLabel: string;
  backButtonTitle: string;
  children: React.ReactNode;
}

const CardWrapper = ({
  label,
  title,
  backButtonHref,
  backButtonLabel,
  backButtonTitle,
  children,
}: cardWrapperProps) => {
  return (
    <Card className="xl:w-1/3 md:w-1/2 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center  py-2">
          {" "}
          {/* Main flex container */}
          <AuthHeader label={label} title={title} />{" "}
          {/* AuthHeader on the left */}
          <BackButton
            label={backButtonLabel}
            href={backButtonHref}
            title={backButtonTitle}
          />{" "}
          {/* Back button on the right */}
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default CardWrapper;
