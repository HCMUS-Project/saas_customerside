"use client";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartListener } from "@/constants/use-cart";

const CartButton = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();

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
      className="fixed bottom-5 right-5 z-10 flex items-center justify-center w-12 h-12 rounded-full  text-white"
      onClick={handleCartClick}
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
