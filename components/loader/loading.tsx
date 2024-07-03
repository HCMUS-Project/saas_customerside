"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface LoaderProp {
  className?: string;
}

export const Loader: React.FC<LoaderProp> = ({ className }) => {
  return (
    <div className={cn(" inset-0 flex justify-center items-center", className)}>
      <span className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></span>
    </div>
  );
};

export default Loader;
