"use client";

import Image from "next/image";
import { notFound } from "next/navigation";

import Recommended from "../recommend-product";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import StarRating from "./rating";
import CommentForm from "./comment";

import { AXIOS } from "@/constants/network/axios";
import { ShoppingCart, Star } from "lucide-react";
import { productEndpoints } from "@/constants/api/product.api";
import { getJwt } from "@/util/auth.util";

import { cartEndpoints } from "@/constants/api/cart.api";
import Swal from "sweetalert2";

interface CartItem {
  id: string;
  images: string | string[];
  name: string;
  price: number;
  quantity: number;
}

export default function ProductPageProps({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();

  const [productsData, setProductsData] = useState<{ products: any[] }>({
    products: [],
  });
  const productId = params.id;

  const [productData, setProductData] = useState<{
    id: " " | string;
    images: "" | Array<string>;
    name: "" | string;
    price: number;
    rating: "" | Array<string>;
    description: string;
  }>({
    id: "",
    images: "",
    name: "",
    price: 0,
    rating: "",
    description: "",
  });

  const [count, setCount] = useState(0);
  const [cart, setCart] = useState(null);
  const accessToken = getJwt("AT");

  const fetchData = useCallback(async (productId: string) => {
    try {
      const res = await AXIOS.GET({
        uri: productEndpoints.findById("30shine.com", params.id),
      });
      const product = res.data;
      setProductData(product);
      console.log(product);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, []);

  useEffect(() => {
    if (accessToken && productId) {
      fetchData(productId);
    } else {
      console.log("Login ddi ku");
    }
  }, [accessToken, productId]);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!Number.isInteger(count) || count <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid quantity greater than 0.",
      });
      return;
    }
    try {
      const createCartResponse = await AXIOS.POST({
        uri: cartEndpoints.addItemToCart,
        params: {
          userId: "some userId",
          cartItem: {
            productId: productData.id,
            quantity: count,
          },
        },
      });

      console.log("Create Cart Response:", createCartResponse);

      if (createCartResponse.status >= 200 && createCartResponse.status < 300) {
        console.log("Product added to cart successfully.");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product added to cart successfully.",
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <Image
          src={productData?.images?.[0]}
          width={500}
          height={500}
          alt={productData?.name}
          className="rounded-lg"
          priority
        />
        <div>
          <h1 className="text-5xl font-bold">{productData?.name}</h1>
          <div className="flex items-center">
            {Array.from({ length: Number(productData.rating) }, (_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
            ))}
          </div>
          <div className="mt-4">${productData?.price}</div>
          <p>{productData?.description}</p>
          <div className="flex font-bold text-center gap-3 mb-2">
            <Button onClick={decrement}>-</Button>
            <h1 className="flex flex-col items-center my-2">{count}</h1>
            <Button onClick={increment}>+</Button>
          </div>
          <div className="flex gap-3">
            <Link href="/cart">
              <Button variant="outline">Order now</Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddToCart} className="btn btn-primary">
                Add to Cart
                <ShoppingCart />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CommentForm />
      <Recommended products={productsData.products} />
    </div>
  );
}
