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
import { authEndpoint } from "@/constants/api/auth.api";
import { cartEndpoints } from "@/constants/api/cart.api";
import { access } from "fs";
import { error } from "console";
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
    // Add other properties if necessary
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
        uri: productEndpoints.findById(params.id), // Sử dụng ID để tạo URI của sản phẩm cần lấy
      });
      const product = res.data; // Lấy dữ liệu sản phẩm từ API
      setProductData(product);
      console.log(product);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, []);

  useEffect(() => {
    if (accessToken && productId) {
      fetchData(productId); // Gọi hàm fetchData với ID được truyền từ router query
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
    // Kiểm tra xem count có phải là số nguyên dương không
    if (!Number.isInteger(count) || count <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return; // Dừng hàm nếu count không hợp lệ
    }
    try {
      if (!accessToken) {
        throw new Error("no access token");
      }

      // Gửi yêu cầu POST để tạo giỏ hàng mới
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

      // Kiểm tra xem yêu cầu tạo giỏ hàng có thành công hay không
      if (createCartResponse.status >= 200 && createCartResponse.status < 300) {
        // Thông báo cho người dùng rằng sản phẩm đã được thêm vào giỏ hàng thành công
        alert("Product added to cart successfully.");
        return;
      }
    } catch (error) {
      // Kiểm tra xem yêu cầu lấy giỏ hàng thành công và giỏ hàng đã tồn tại hay không
      console.log(error);
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
            {" "}
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
