import React from "react";
import { mockProducts } from "@/constants/mock-data/mock-product";

import Image from "next/image";
import Link from "next/link";
const AllBooking = () => {
  return (
    <div className="container pt-16">
      <h2 className="font-medium text-2xl pb-4">All Bookings</h2>

      <Link href="/bookings/form" className="grid grid-cols-4 gap-2">
        {mockProducts.map((item, index) => (
          <div
            key={index}
            className="px-4 border border-gray-200 rounded-xl max-w-[400px]"
          >
            <div>
              <Image
                className="w-full h-auto"
                src={mockProducts[index].imgSrc}
                width={200}
                height={300}
                alt={mockProducts[index].name}
              />
            </div>
            <div className="space-y-2 py-2">
              <h2 className="text-accent font-medium uppercase">
                {mockProducts[index].name}
              </h2>
              <p className="text-gray-500 max-w-[150px]">
                Lorem ipsum dolor sit amet
              </p>
              <div className="font-bold">${mockProducts[index].price}</div>
            </div>
          </div>
        ))}
      </Link>
    </div>
  );
};

export default AllBooking;
