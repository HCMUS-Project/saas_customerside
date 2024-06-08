import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface Booking {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
}

interface AllBookingProps {
  bookings?: Booking[];
}

const AllBooking = ({ bookings = [] }: AllBookingProps) => {
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleViewAllClick = () => {
    router.push("/all-bookings");
  };

  const extendedBookings =
    bookings.length > 0 ? [...bookings, ...bookings, ...bookings] : [];

  return (
    <div className="container pt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-2xl">All Bookings</h2>
        <Button
          variant="link"
          onClick={handleViewAllClick}
          className="text-blue-500"
        >
          View All
        </Button>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="flex">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-2">
                    <Card className="h-full">
                      <div className="w-full h-[200px] relative">
                        <Skeleton className="w-full h-full" />
                      </div>
                      <CardContent className="space-y-2 py-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              : extendedBookings.map((booking, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-2">
                    <Card className="h-full">
                      <Link href={`/bookings/services/${booking.id}`}>
                        <div className="w-full h-[200px] relative">
                          <Image
                            className="object-contain"
                            src={booking.images[0]}
                            alt={booking.name}
                            fill
                          />
                        </div>

                        <CardContent className="space-y-2 py-2">
                          <h2 className="text-accent font-medium uppercase">
                            {booking.name}
                            <div className="flex items-center">
                              {Array.from(
                                { length: booking.rating },
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 text-yellow-400"
                                  />
                                )
                              )}
                            </div>
                          </h2>
                          <p className="text-gray-500 max-w-[150px]">
                            {booking.description}
                          </p>
                          <div className="font-bold">{booking.price}VND</div>
                        </CardContent>
                      </Link>
                    </Card>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 cursor-pointer" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 cursor-pointer" />
        </Carousel>
      </div>
    </div>
  );
};

export default AllBooking;
