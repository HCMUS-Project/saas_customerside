"use client";
import { mockProducts } from "@/constants/mock-data/mock-product";

import Image from "next/image";
import Link from "next/link";

export default function CartEntry() {
  const product = mockProducts[0];
  const quantityOption: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOption.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
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
            <select
              className=" select select-border w-full max-w-[80px]"
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
              }}
            >
              {quantityOption}
            </select>
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
