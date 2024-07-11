"use client";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/hooks/store/profile.store";
import eventBus from "@/hooks/evenBus"; // Adjust the path as necessary

const CartButton = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();
  const profileStore = useProfileStore();

  useEffect(() => {
    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const count = cartItems.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );
      setCartItemCount(count);
    };

    updateCartItemCount(); // Initial load
    eventBus.on("cartUpdated", updateCartItemCount);

    return () => {
      eventBus.off("cartUpdated", updateCartItemCount);
    };
  }, []);

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <Button
      className="fixed bottom-5 right-5 z-10 flex items-center justify-center w-16 h-16 rounded-full text-white"
      onClick={handleCartClick}
      style={{
        backgroundColor: profileStore.buttonColor,
        color: profileStore.buttonTextColor,
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
