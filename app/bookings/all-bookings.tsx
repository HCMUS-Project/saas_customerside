import React from "react";

import Image from "next/image";
import Link from "next/link";

interface Booking {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
  // Add other properties if necessary
}

const AllBooking = ({ bookings }: { bookings: Booking[] }) => {
  console.log(bookings);
  return (
    <div className="container pt-16">
      <h2 className="font-medium text-2xl pb-4">All Bookings</h2>

      <div className="grid grid-cols-4 gap-2">
        {bookings?.map((_: any, index) => (
          <div
            key={index}
            className="px-4 border border-gray-200 rounded-xl max-w-[400px]"
          >
            <Link href={`bookings/services/${bookings[index].id}`}>
              <div className="w-full h-[200px] relative">
                <Image
                  className="object-fill"
                  src={bookings?.[index]?.images?.[0]}
                  alt={bookings?.[index].name}
                  fill
                />
              </div>
              <div className="space-y-2 py-2">
                <h2 className="text-accent font-medium uppercase">
                  {bookings[index]?.name}
                </h2>
                <p className="text-gray-500 max-w-[150px]">
                  Lorem ipsum dolor sit amet
                </p>
                <div className="font-bold">${bookings[index]?.price}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBooking;
