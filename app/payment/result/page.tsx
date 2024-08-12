// pages/payment/result.js

"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { useProfileStore } from "@/hooks/store/profile.store";

const PaymentResult = () => {
  const router = useRouter();
  const lang = useLanguage();
  const profileStore = useProfileStore();
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    const status = urlParams.get("status");

    if (status === "success") {
      setIsSuccess(true);
    } else if (status === "failed") {
      setIsSuccess(false);
    }
    
  }, []);

  const handleReturnHome = () => {
    router.push("/product");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      {isSuccess === null ? (
        <p>Loading...</p>
      ) : isSuccess ? (
        <>
          <CheckCircle className="text-green-500" size={96} />{" "}
          {/* Increase icon size */}
          <h1 className="mt-4 text-4xl font-bold">
            {lang.curLangPack.noti?.["ordered"]}
          </h1>{" "}
          {/* Increase title text size */}
          <p className="mt-2 text-2xl">
            {lang.curLangPack.noti?.["thankYou"]}
          </p>{" "}
          {/* Increase description text size */}
          <Button
            style={{
              backgroundColor: profileStore.buttonColor,
              color: profileStore.buttonTextColor,
            }}
            className="mt-6 text-xl py-4 px-8"
            onClick={handleReturnHome}
          >
            {" "}
            {/* Increase button size */}
            {lang.curLangPack.noti?.["return"]}
          </Button>
        </>
      ) : (
        <>
          <XCircle className="text-red-500" size={96} />{" "}
          {/* Increase icon size */}
          <h1 className="mt-4 text-4xl font-bold">
            {lang.curLangPack.noti?.["orderFetch"]}
          </h1>{" "}
          {/* Increase title text size */}
          <Button
            style={{
              backgroundColor: profileStore.buttonColor,
              color: profileStore.buttonTextColor,
            }}
            className="mt-6 text-xl py-4 px-8"
            onClick={handleReturnHome}
          >
            {" "}
            {/* Increase button size */}
            {lang.curLangPack.noti?.["return"]}
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentResult;
