"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { productEndpoints } from "@/constants/api/product.api";
import { cartEndpoints } from "@/constants/api/cart.api";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/constants/use-cart";
import { useAuthStore } from "@/hooks/store/auth.store";
import { useProfileStore } from "@/hooks/store/profile.store";
import Swal from "sweetalert2";
import { Trash2, Minus, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Product {
  productId: string;
  images: string;
  quantity: number;
  name: string;
  price: number;
}

export default function CartPage() {
  const [count, setCount] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartID, setCartID] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [removing, setRemoving] = useState<number | null>(null);
  const router = useRouter();
  const { removeFromCart } = useCart();
  const profileStore = useProfileStore();

  const fetchCartData = async () => {
    try {
      const response = await AXIOS.GET({ uri: cartEndpoints.findall });
      if (response.data) {
        setCartID(response.data.carts[0].id);
        const result = await fetchDataCartFromID(
          response.data.carts[0].cartItems
        );
        if (result) setCartItems(result);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setLoading(false);
    }
  };

  const updateSelectedItemsFromLocalStorage = () => {
    const selectedProductId = localStorage.getItem("selectedProductId");
    if (selectedProductId) {
      setSelectedItems((prevSelectedItems) =>
        cartItems.map((item) => item.productId === selectedProductId)
      );
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    if (!loading) {
      updateSelectedItemsFromLocalStorage();
    }
  }, [cartItems, loading]);

  const fetchDataCartFromID = async (cartItemsTemp: any) => {
    let temp: Array<Product> = [];
    try {
      for (const item of cartItemsTemp) {
        const res = await AXIOS.GET({
          uri: productEndpoints.findById(
            process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? "",
            item.productId
          ),
        });

        if (res.data) {
          const updatedItem = {
            ...item,
            images: res.data.images[0],
            price: res.data.price,
            name: res.data.name,
          };

          temp = [...temp, updatedItem];
        }
      }

      return temp;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);

  const handleCheckboxChange = (index: number) => {
    setSelectedItems((prevState) => {
      const updatedSelectedItems = [...prevState];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const updateCart = async (index: number, newQuantity: number) => {
    try {
      const updatedCartItem = { ...cartItems[index], quantity: newQuantity };
      const params = {
        id: cartID,
        cartItems: {
          quantity: updatedCartItem.quantity,
          productId: updatedCartItem.productId,
        },
      };
      const response = await AXIOS.POST({
        uri: cartEndpoints.updateCart,
        params: params,
      });
      if (!response.data) {
        throw new Error("Response data is empty");
      }
      const updatedCartItems = [...cartItems];
      updatedCartItems[index] = updatedCartItem;
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((acc, item, index) => {
      return selectedItems[index] ? acc + item.price * count[index] : acc;
    }, 0);
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [count, selectedItems]);

  useEffect(() => {
    setCount(cartItems.map((item) => item.quantity));
  }, [cartItems]);

  const increment = async (index: number) => {
    setCount((prevCount) => {
      const newCount = [...prevCount];
      newCount[index]++;
      updateCart(index, newCount[index]);
      return newCount;
    });
  };

  const decrement = async (index: number) => {
    setCount((prevCount) => {
      const newCount = [...prevCount];
      if (newCount[index] > 0) {
        newCount[index]--;
        updateCart(index, newCount[index]);
      }
      return newCount;
    });
  };

  const handleRemoveFromCart = async (index: number) => {
    setRemoving(index);
    await updateCart(index, 0);
    await fetchCartData();
    setRemoving(null);
  };

  const checkout = () => {
    if (!selectedItems.some((item) => item)) {
      Swal.fire({
        title: "Error",
        text: "Please select items to checkout.",
        icon: "error",
        confirmButtonColor: profileStore.buttonColor,
        cancelButtonColor: "Crimson",
        confirmButtonText: "OK",
      });
      return;
    }
    const selectedProducts = cartItems.filter(
      (_, index) => selectedItems[index]
    );
    localStorage.setItem("checkoutProducts", JSON.stringify(selectedProducts));
    router.push("/payment");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex-grow h-full">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div className="grid gap-6">
          {loading ? (
            <div>
              {[...Array(3)].map((_, index) => (
                <div className="mt-4 flex justify-between" key={index}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Skeleton className="w-[20px] h-[20px] rounded-full" />
                    <Skeleton className="w-[200px] h-[200px] rounded-lg" />
                    <div>
                      <Skeleton className="w-[100px] h-[20px] rounded-full" />
                      <Skeleton className="w-[50px] h-[20px] rounded-full mt-2" />
                      <div className="my-1 flex item-center gap-2">
                        <Skeleton className="w-[70px] h-[20px] rounded-full" />
                        <div className="flex font-bold text-center gap-3 mb-2">
                          <Skeleton className="w-[30px] h-[30px] rounded-full" />
                          <Skeleton className="w-[30px] h/[30px] rounded-full" />
                          <Skeleton className="w/[30px] h/[30px] rounded-full" />
                        </div>
                      </div>
                      <Skeleton className="w/[100px] h/[20px] rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="w/[70px] h/[30px] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center  ">
                  <p>No items in the cart.</p>
                  <Button
                    style={{
                      backgroundColor: profileStore.buttonColor,
                      color: profileStore.buttonTextColor,
                    }}
                    onClick={() => router.push("/product")}
                  >
                    Shop Now
                  </Button>
                </div>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <div
                      key={item.productId}
                      className="grid grid-cols-[24px_100px_1fr_auto] items-center gap-4"
                    >
                      <Checkbox
                        style={{
                          backgroundColor: selectedItems[index]
                            ? profileStore.buttonColor
                            : "",
                        }}
                        checked={selectedItems[index]}
                        onCheckedChange={() => handleCheckboxChange(index)}
                      />
                      <Image
                        src={item.images || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <div className="grid gap-1">
                        <Link href={`product/${item.productId}`}>
                          <h3 className="font-semibold">{item.name}</h3>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                          {item.price} VND
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => decrement(index)}
                          disabled={count[index] <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium">{count[index]}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => increment(index)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(index)}
                          className="bg-red-500 text-white"
                        >
                          <Trash2 className="w-4 h-4 " />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>17.000 VND</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} VND</span>
              </div>
            </CardContent>
            <CardFooter className="grid gap-2">
              <Button
                disabled={cartItems.length === 0}
                className="w-full"
                onClick={checkout}
                style={{
                  backgroundColor: profileStore.buttonColor,
                  color: profileStore.buttonTextColor,
                }}
              >
                Proceed to Checkout
              </Button>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
