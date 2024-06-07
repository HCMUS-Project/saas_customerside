import { useState, useEffect } from "react";

// A simple event bus for cross-component communication
const eventBus = {
  events: {} as { [key: string]: Array<(data: any) => void> },
  dispatch(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  },
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  },
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    eventBus.dispatch("cartUpdated", cartItems);
  }, [cartItems]);

  const addToCart = (item: any) => {
    setCartItems((prevItems) => {
      const newCartItems = [...prevItems, item];
      return newCartItems;
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => {
      const newCartItems = prevItems.filter((_, i) => i !== index);
      return newCartItems;
    });
  };

  const getCartItemCount = () => {
    return cartItems.length;
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
