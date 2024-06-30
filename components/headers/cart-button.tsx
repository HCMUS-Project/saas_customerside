"use client";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartListener } from "@/constants/use-cart";
import { useProfileStore } from "@/hooks/store/profile.store";

const CartButton = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();
  const profileStore = useProfileStore();

  useCartListener((updatedCart) => {
    setCartItemCount(updatedCart.length);
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(savedCart.length);
  }, []);

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <Button
      className="fixed bottom-5 right-5 z-10 flex items-center justify-center w-16 h-16 rounded-full  text-white"
      onClick={handleCartClick}
      style={{
        backgroundColor: profileStore.buttonColor,
        color: profileStore.headerTextColor,
      }}
    >
      <ShoppingCart className="w-6 h-6" />
      {cartItemCount > 0 && (
        <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {cartItemCount}
        </div>
      )}
    </Button>
  );
};

export default CartButton;
