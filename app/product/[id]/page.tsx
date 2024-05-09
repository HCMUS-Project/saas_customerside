"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "./add-to-cart-button";
import Recommended from "../recommend-product";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import StarRating from "./rating";
import CommentForm from "./comment";
import { productEndpoint } from "@/constants/api/auth.api";
import { AXIOS } from "@/constants/network/axios";
import { useAccessToken } from "@/app/AccessTokenContext";
import { Star } from "lucide-react";

export default function ProductPageProps({
  params,
}: {
  params: { id: string };
}) {
  const { accessToken } = useAccessToken();
  const searchParams = useSearchParams();

  const [productsData, setProductsData] = useState<{ products: any[] }>({
    products: [],
  });
  const productId = params.id;
  const [productData, setProductData] = useState<{
    id: " " | string;
    images: "" | Array<string>;
    name: "" | string;
    price: "" | number;
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
  // Chọn một sản phẩm từ mảng mockProducts để hiển thị chi tiết
  // const product = mockProducts[0]; // Đây là một ví dụ, bạn có thể chọn sản phẩm khác tùy thuộc vào logic của bạn
  const [count, setCount] = useState(0);

  const fetchData = useCallback(
    async (productId: string) => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoint.findProductByID.replace("{id}", params.id), // Sử dụng ID để tạo URI của sản phẩm cần lấy
          token: accessToken,
        });
        const product = res.data; // Lấy dữ liệu sản phẩm từ API
        setProductData(product);
        console.log(product);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    },
    [accessToken]
  );
  useEffect(() => {
    if (accessToken && productId) {
      fetchData(productId); // Gọi hàm fetchData với ID được truyền từ router query
    } else {
      notFound();
    }
  }, [accessToken, productId, fetchData]);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  if (!productData) {
    return null;
  }

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
            <AddToCartButton productId={productData.id} />
          </div>
        </div>
      </div>

      <CommentForm />

      <Recommended products={productsData.products} />
    </div>
  );
}
