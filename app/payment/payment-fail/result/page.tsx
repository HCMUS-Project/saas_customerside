"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { useProfileStore } from "@/hooks/store/profile.store";

const PaymentFail: React.FC = () => {
  const router = useRouter();
  const lang = useLanguage();
  const profileStore = useProfileStore();
  const handleReturnHome = () => {
    router.push("/product");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <XCircle className="text-red-500" size={96} />{" "}
      {/* Tăng kích thước biểu tượng */}
      <h1 className="mt-4 text-4xl font-bold">
        {lang.curLangPack.noti?.["orderFetch"]}
      </h1>{" "}
      {/* Tăng kích thước văn bản tiêu đề */}
      {/* Tăng kích thước văn bản mô tả */}
      <Button
        style={{
          backgroundColor: profileStore.buttonColor,
          color: profileStore.buttonTextColor,
        }}
        className="mt-6 text-xl py-4 px-8"
        onClick={handleReturnHome}
      >
        {" "}
        {/* Tăng kích thước nút */}
        {lang.curLangPack.noti?.["return"]}
      </Button>
    </div>
  );
};

export default PaymentFail;
