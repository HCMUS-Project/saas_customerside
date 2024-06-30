import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface Product {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
}

interface AllProductProps {
  products?: Product[];
}

const AllProduct = ({ products = [] }: AllProductProps) => {
  const [loading, setLoading] = useState(true); // State to manage loading
  const [displayedProducts, setDisplayedProducts] = useState(4); // State to manage displayed products

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  const handleViewMoreClick = () => {
    setDisplayedProducts((prev) => prev + 4); // Load 4 more products
  };

  const displayed = products.slice(0, displayedProducts);

  return (
    <div className="container pt-16 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-2xl">All Products</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="h-full">
                <div className="w-full h-[200px] relative">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardContent className="space-y-2 py-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))
          : displayed.map((product, index) => (
              <Card
                key={index}
                className="h-full border border-gray-200 shadow-md rounded-md mb-10"
              >
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
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium uppercase text-sm">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4  ${
                              i < product.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="font-bold text-sm">{product.price} VND</div>
                  </CardContent>
                </Link>
              </Card>
            ))}
      </div>
      {displayedProducts < products.length && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={handleViewMoreClick}>
            View More
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllProduct;
