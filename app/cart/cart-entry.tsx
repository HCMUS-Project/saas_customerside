"use client";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/constants/mock-data/mock-product";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartEntry() {
  const product = mockProducts[0];
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Image
          src={product.imgSrc}
          width={200}
          height={200}
          alt={product.name}
          className="rounded-lg"
        />
        <div>
          <Link href="product/product-detail" className="font-bold">
            {product.name}
          </Link>
          <div>${product.price}</div>
          <div className="my-1 flex item-center gap-2">
            Quantity:
            <div className="flex font-bold text-center gap-3 mb-2">
              {" "}
              <Button onClick={decrement}>-</Button>
              <h1 className="flex flex-col items-center my-2">{count}</h1>
              <Button onClick={increment}>+</Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            Total Price: ${product.price}
          </div>
        </div>
      </div>
      <div className="divider" />
    </div>
  );
}
