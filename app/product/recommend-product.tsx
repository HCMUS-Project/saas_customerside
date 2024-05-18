import React from "react";
import Link from "next/link";
// import { mockProducts } from "@/constants/mock-data/mock-product";
interface Product {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
  // Add other properties if necessary
}
import Image from "next/image";
import { Star, StarIcon, StarsIcon } from "lucide-react";
const Recommended = ({ products }: { products: Product[] }) => {
  return (
    <div className="container pt-16">
      <h2 className="font-medium text-2xl pb-4">Recommended</h2>

      <div className="grid grid-cols-4 gap-2">
        {products?.map((_: any, index: number) => (
          <div
            key={index}
            className="px-4 border border-gray-200 rounded-xl max-w-[400px]"
          >
            <Link href={`/product/${products[index].id}`}>
              <div className="w-full h-[200px] relative">
                <Image
                  className="object-fill "
                  src={products?.[index]?.images?.[0]}
                  alt={products[index]?.name}
                  fill
                />
              </div>

              <div className="space-y-2 py-2">
                <h2 className="text-accent font-medium uppercase">
                  {products[index]?.name}
                  <div className="flex items-center">
                    {Array.from({ length: products[index]?.rating }, (_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                </h2>
                <p className="text-gray-500 max-w-[150px]">
                  {products[index]?.description}{" "}
                </p>
                <div className="font-bold">${products[index]?.price}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommended;
