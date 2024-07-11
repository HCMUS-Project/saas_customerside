"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const lang = useLanguage();

  const handleReturnHome = () => {
    router.push("/product");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <CheckCircle className="text-green-500" size={96} />{" "}
      {/* Tăng kích thước biểu tượng */}
      <h1 className="mt-4 text-4xl font-bold">
        {lang.curLangPack.noti?.["ordered"]}
      </h1>{" "}
      {/* Tăng kích thước văn bản tiêu đề */}
      <p className="mt-2 text-2xl">
        {" "}
        {lang.curLangPack.noti?.["thankYou"]}
      </p>{" "}
      {/* Tăng kích thước văn bản mô tả */}
      <Button className="mt-6 text-xl py-4 px-8" onClick={handleReturnHome}>
        {" "}
        {/* Tăng kích thước nút */}
        {lang.curLangPack.noti?.["return"]}
      </Button>
    </div>
  );
};

export default PaymentSuccess;
