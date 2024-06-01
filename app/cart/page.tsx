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
  const [showAlert, setShowAlert] = useState(false);
  const [cartID, setCartID] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const router = useRouter();

  const fetchCartData = async () => {
    try {
      const response = await AXIOS.GET({ uri: cartEndpoints.findall });
      if (response.data) {
        setCartID(response.data.carts[0].id);
        const result = await fetchDataCartFromID(
          response.data.carts[0].cartItems
        );
        if (result) setCartItems(result);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
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

  const removeFromCart = async (index: number) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems.splice(index, 1);
      updateCart(index, 0);
      setShowAlert(true);
      return newCartItems;
    });
  };

  const checkout = () => {
    const selectedProducts = cartItems.filter(
      (_, index) => selectedItems[index]
    );
    localStorage.setItem("checkoutProducts", JSON.stringify(selectedProducts));
    router.push("/payment");
  };

  return (
    <div className="mt-2">
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
              <Link href={`product/product-detail?id=${item.productId}`}>
                <div className="font-bold">{item.name}</div>
              </Link>
              <div>${item.price}</div>
              <div className="my-1 flex item-center gap-2">
                Quantity:
                <div className="flex font-bold text-center gap-3 mb-2">
                  <Button onClick={() => decrement(index)}>-</Button>
                  <h1 className="flex flex-col items-center my-2">
                    {count[index]}
                  </h1>
                  <Button onClick={() => increment(index)}>+</Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                Total Price: ${item.price * count[index]}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={() => removeFromCart(index)}>Remove</Button>
          </div>
        </div>
      ))}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">Total: ${totalPrice}</p>
        <Button onClick={checkout} className="btn btn-primary sm:w-[200px]">
          Checkout
        </Button>
      </div>
    </div>
  );
}
