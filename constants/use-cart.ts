// useCart.ts
import { useState, useEffect } from "react";
import eventBus from "@/hooks/evenBus"; // Adjust the path as necessary

interface CartItem {
  images: string[];
  name: string;
  price: number;
  productId: string;
  quantity: number;
  // Add other properties as needed
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as CartItem[];
    console.log("Saved cart loaded:", savedCart);
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    eventBus.dispatch("cartUpdated", cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const newCartItems = [...prevItems, item];
      console.log("Item added to cart:", newCartItems);
      return newCartItems;
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => {
      const newCartItems = prevItems.filter((_, i) => i !== index);
      console.log("Item removed from cart:", newCartItems);
      return newCartItems;
    });
  };

  const getCartItemCount = () => {
    const itemCount = cartItems.reduce((count, item) => {
      console.log("Calculating count for item:", item);
      return count + item.quantity;
    }, 0);
    console.log("Cart item count calculated:", itemCount);
    return itemCount;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    getCartItemCount,
  };
};

export const useCartListener = (callback: (data: any) => void) => {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe("cartUpdated", callback);
    return () => {
      unsubscribe();
    };
  }, [callback]);
};
