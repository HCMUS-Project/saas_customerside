"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AXIOS } from "@/constants/network/axios";
import { configEnpoints } from "@/constants/api/config.api";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/hooks/store/profile.store";
import Loader from "./loading";

interface BannerProp {
  image: string;
  title: string;
  description: string;
  textColor: string;
}

interface Product {
  images: string[];
  name: string;
  price: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<BannerProp[]>([]);
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const profileStore = useProfileStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const apiToFetch = [
          AXIOS.GET({
            uri: configEnpoints.findBanner,
            params: { domain: "30shine.com" },
          }),
          AXIOS.GET({
            uri: ecommerceEndpoints.findBestProducts,
            params: { domain: "30shine.com" },
          }),
          AXIOS.GET({
            uri: ecommerceEndpoints.findRecommendedProducts,
            params: { domain: "30shine.com" },
          }),
        ];

        const res = await Promise.all(apiToFetch);

        setBanners(res[0].data.banners);
        setBestProducts(res[1].data.products);
        setRecommendedProducts(res[2].data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="main pb-10">
      {loading && <Loader />}
      {!loading && (
        <>
          {banners.length > 0 && (
            <div className="flex justify-center w-full">
              <Carousel className="w-full max-w-5xl">
                <CarouselContent>
                  {banners.map((item, index) => (
                    <CarouselItem key={index} className="carousel-item">
                      <div className="relative mt-4 flex justify-center items-center w-full h-[400px]">
                        <Image
                          src={item.image}
                          alt="Banner"
                          layout="fill"
                          objectFit="cover"
                          className="banner-image rounded-lg"
                          priority={true}
                        />
                        <div
                          className="absolute top-0 right-0 h-full w-[50%] bg-slate-900 
                          bg-opacity-30 flex flex-col justify-center items-center px-4 overflow-y-auto"
                        >
                          <h3
                            className="text-4xl font-bold"
                            style={{ color: item.textColor }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="break-words text-center w-full text-xl"
                            style={{ color: item.textColor }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          <div className="flex flex-col items-center w-full mt-6 px-4">
            <h3 className="section-title text-lg font-bold mb-4">
              DỊCH VỤ TÓC
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
              {bestProducts.length > 0
                ? bestProducts.map((product, index) => (
                    <Card
                      key={index}
                      className="card rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="relative w-full h-48">
                        {product.images.length > 0 && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            layout="fill"
                            objectFit="contain"
                            priority={index === 0}
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-base font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{product.price}</p>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button
                          style={{
                            backgroundColor: profileStore.buttonColor,
                            color: profileStore.headerTextColor,
                          }}
                          className="w-full text-sm"
                        >
                          Tìm hiểu thêm
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <Card
                      key={index}
                      className="card rounded-lg shadow-lg overflow-hidden"
                    >
                      <Skeleton className="w-full h-48" />
                      <CardContent className="p-4">
                        <Skeleton className="w-1/2 h-6 mb-2" />
                        <Skeleton className="w-1/4 h-4" />
                      </CardContent>
                      <CardFooter className="p-4">
                        <Skeleton className="w-full h-8" />
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </div>

          <div className="flex flex-col items-center w-full mt-6 px-4">
            <h3 className="section-title text-lg font-bold mb-4">
              SPA & RELAX
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
              {recommendedProducts.length > 0
                ? recommendedProducts.map((product, index) => (
                    <Card
                      key={index}
                      className="card rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="relative w-full h-48">
                        {product.images.length > 0 && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            layout="fill"
                            objectFit="contain"
                            priority={index === 0}
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-base font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{product.price}</p>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button
                          style={{
                            backgroundColor: profileStore.buttonColor,
                            color: profileStore.headerTextColor,
                          }}
                          className="w-full text-sm"
                        >
                          Tìm hiểu thêm
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <Card
                      key={index}
                      className="card rounded-lg shadow-lg overflow-hidden"
                    >
                      <Skeleton className="w-full h-48" />
                      <CardContent className="p-4">
                        <Skeleton className="w-1/2 h-6 mb-2" />
                        <Skeleton className="w-1/4 h-4" />
                      </CardContent>
                      <CardFooter className="p-4">
                        <Skeleton className="w-full h-8" />
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
