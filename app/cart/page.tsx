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
  const [loading, setLoading] = useState(true); // Loading state
  const [showAlert, setShowAlert] = useState(false);
  const [cartID, setCartID] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const router = useRouter();
  const { removeFromCart } = useCart(); // Use removeFromCart from the custom hook

  const fetchCartData = async () => {
    try {
      const response = await AXIOS.GET({ uri: cartEndpoints.findall });
      if (response.data) {
        setCartID(response.data.carts[0].id);
        const result = await fetchDataCartFromID(
          response.data.carts[0].cartItems
        );
        if (result) setCartItems(result);
        setLoading(false); // Set loading to false after data is fetched
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

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

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prevCartItems) => {
      const newCartItems = prevCartItems.filter((_, i) => i !== index);
      return newCartItems;
    });
    removeFromCart(index); // Call removeFromCart from the custom hook
  };

  const checkout = () => {
    const selectedProducts = cartItems.filter(
      (_, index) => selectedItems[index]
    );
    localStorage.setItem("checkoutProducts", JSON.stringify(selectedProducts));
    router.push("/payment");
  };

  return (
    <div className=" mt-2 pb-10">
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
            <div className="px-4 py-4 flex flex-col items-center">
              <p>No items in the cart.</p>
              <Button onClick={() => router.push("/product")}>Shop Now</Button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div className="mt-4 flex justify-between" key={item.productId}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Checkbox
                      checked={selectedItems[index]}
                      onCheckedChange={() => handleCheckboxChange(index)}
                    />
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images}
                        width={200}
                        height={200}
                        alt={item.name}
                        className="rounded-lg"
                      />
                    ) : (
                      <div>No Image Available</div>
                    )}
                    <div>
                      <Link
                        href={`product/product-detail?id=${item.productId}`}
                      >
                        <div className="font-bold">{item.name}</div>
                      </Link>
                      <div>{item.price}VND</div>
                      <div className="my-1 flex items-center gap-2">
                        Quantity:
                        <div className="flex items-center font-bold text-center gap-3 mb-2">
                          <Button onClick={() => decrement(index)}>-</Button>
                          <h1 className="flex items-center justify-center my-2 w-12 text-center">
                            {count[index]}
                          </h1>
                          <Button onClick={() => increment(index)}>+</Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        Total Price: {item.price * count[index]}VND
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button onClick={() => handleRemoveFromCart(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-end sm:items-center">
                <p className="mb-3 font-bold">Total: {totalPrice}VND</p>
                <Button
                  onClick={checkout}
                  className="btn btn-primary sm:w-[200px]"
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
