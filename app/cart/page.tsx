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
import { Trash, Trash2, XIcon } from "lucide-react";

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
  const [showAlert, setShowAlert] = useState(false);
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
          uri: productEndpoints.findById("30shine.com", item.productId),
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
    <div className="mt-4 mb-10 pb-10 min-h-screen bg-white">
      <div className="flex justify-center">
        <div className="text-4xl font-bold">Your Cart</div>
      </div>
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
                      <Skeleton className="w-[30px] h-[30px] rounded-full" />
                      <Skeleton className="w-[30px] h-[30px] rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </div>
              </div>
              <div className="flex items-center">
                <Skeleton className="w-[70px] h-[30px] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <div className="mt-8 px-4 py-4 flex flex-col items-center">
              <p>No items in the cart.</p>
              <Button
                style={{
                  backgroundColor: profileStore.buttonColor,
                  color: profileStore.headerTextColor,
                }}
                onClick={() => router.push("/product")}
              >
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="container mt-8 mx-auto p-4 bg-white shadow-md rounded-lg space-y-4">
              {cartItems.map((item, index) => (
                <div
                  className="flex justify-between items-center border-b pb-4"
                  key={item.productId}
                >
                  <div className="flex items-center gap-4 w-full">
                    <Checkbox
                      style={{
                        backgroundColor: selectedItems[index]
                          ? profileStore.buttonColor
                          : "",
                      }}
                      checked={selectedItems[index]}
                      onCheckedChange={() => handleCheckboxChange(index)}
                    />
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images}
                        width={100}
                        height={100}
                        alt={item.name}
                        className="rounded-lg"
                      />
                    ) : (
                      <div>No Image Available</div>
                    )}
                    <div className="flex flex-col w-full">
                      <Link
                        href={`product/product-detail?id=${item.productId}`}
                      >
                        <div className="font-bold text-lg">{item.name}</div>
                      </Link>
                      <div className="text-gray-600">{item.price} VND</div>
                      <div className="flex items-center mt-2 gap-2">
                        <div>Quantity:</div>
                        <div className="flex items-center gap-2">
                          <Button
                            style={{
                              backgroundColor: profileStore.buttonColor,
                              color: profileStore.headerTextColor,
                            }}
                            onClick={() => decrement(index)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {count[index]}
                          </span>
                          <Button
                            style={{
                              backgroundColor: profileStore.buttonColor,
                              color: profileStore.headerTextColor,
                            }}
                            onClick={() => increment(index)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        Total Price:{" "}
                        <span className="font-bold">
                          {item.price * count[index]} VND
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    style={{
                      backgroundColor: profileStore.buttonColor,
                      color: profileStore.headerTextColor,
                    }}
                    onClick={() => handleRemoveFromCart(index)}
                    disabled={removing === index}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4">
                <div className="container mx-auto flex justify-between items-center">
                  <p className="font-bold text-xl">Total: {totalPrice} VND</p>
                  <Button
                    style={{
                      backgroundColor: profileStore.buttonColor,
                      color: profileStore.headerTextColor,
                    }}
                    onClick={checkout}
                    className="px-4 py-2"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
