import React, { useRef, useEffect, useCallback, useState } from "react";
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

interface Product {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
}

interface RecommendedProps {
  products?: Product[];
}

const Recommended = ({ products = [] }: RecommendedProps) => {
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
    router.push("/all-products");
  };

  const extendedProducts =
    products.length > 0 ? [...products, ...products, ...products] : [];

  return (
    <div className="container pt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-2xl">Recommended</h2>
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
              ? Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4 p-2"
                  >
                    <Card className="h-full border border-gray-200">
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
              : extendedProducts.map((product, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4 p-2"
                  >
                    <Card className="h-full border border-gray-200 shadow-md rounded-md mb-10">
                      <Link href={`/product/${product.id}`}>
                        <div className="w-full h-[200px] relative">
                          <Image
                            className="object-contain"
                            src={product.images[0]}
                            alt={product.name}
                            fill
                          />
                        </div>

                        <CardContent className="space-y-2 py-2">
                          <h4 className="font-medium uppercase text-sm">
                            {product.name}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < product.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="font-bold text-sm">
                            {product.price} VND
                          </div>
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

export default Recommended;
