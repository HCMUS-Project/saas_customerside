"use client";
import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  title: string;
  href: string;
}

const BackButton = ({ label, href, title }: BackButtonProps) => {
  return (
    <div>
      <p className="text-xs font-size: 8px">{title}</p>{" "}
      <div className="button-container ">
        <Button variant="link" className="font-light" size="sm" asChild>
          <Link href={href}>{label}</Link>
        </Button>
      </div>
    </div>
  );
};

export default BackButton;
