"use client";

import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <span className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></span>
    </div>
  );
}
