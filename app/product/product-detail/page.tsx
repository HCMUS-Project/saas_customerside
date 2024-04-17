"use client";
import { mockProducts } from "@/constants/mock-data/mock-product";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "./add-to-cart-button";
import Recommended from "../recommend-product";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

import React, { useState } from "react";

export default function ProductPageProps() {
  // Chọn một sản phẩm từ mảng mockProducts để hiển thị chi tiết
  const product = mockProducts[0]; // Đây là một ví dụ, bạn có thể chọn sản phẩm khác tùy thuộc vào logic của bạn
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };
  if (!product) {
    // Kiểm tra nếu không có sản phẩm nào tồn tại
    notFound();
    return null;
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <Image
          src={product.imgSrc}
          width={500}
          height={500}
          alt={product.name}
          className="rounded-lg"
          priority
        />
        <div>
          <h1 className="text-5xl font-bold">{product.name}</h1>
          <div className="mt-4">${product.price}</div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            officiis dolor totam! Modi quidem quas est minima similique aperiam
            facilis voluptatem eveniet, nulla repellat doloribus odit nam harum
            fuga enim?
          </p>
          <div className="flex font-bold text-center gap-3 mb-2">
            {" "}
            <Button onClick={decrement}>-</Button>
            <h1 className="flex flex-col items-center my-2">{count}</h1>
            <Button onClick={increment}>+</Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Order now</Button>
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
      <Recommended />
    </div>
  );
}
