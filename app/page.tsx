"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AXIOS } from "@/constants/network/axios";
import { configEnpoints } from "@/constants/api/config.api";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import { bookingEndpoints } from "@/constants/api/bookings.api";

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
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/hooks/store/profile.store";
import { Loader } from "../components/loader/loading";
import { Star } from "lucide-react";
import Router from "next/router";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";

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
  rating: number;
  id: string;
}

interface Service {
  images: string[];
  name: string;
  price: number;
  description: string;
  rating: number;
  id: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<BannerProp[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const profileStore = useProfileStore();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const router = useRouter();
  const lang = useLanguage();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const apiToFetch = [
          AXIOS.GET({
            uri: configEnpoints.findBanner,
            params: { domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN },
          }),
          AXIOS.GET({
            uri: ecommerceEndpoints.findBestProducts,
            params: { domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN },
          }),
          AXIOS.GET({
            uri: ecommerceEndpoints.findRecommendedProducts,
            params: { domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN },
          }),
          AXIOS.GET({
            uri: bookingEndpoints.findBestServices,
            params: { domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? "" },
          }),
          AXIOS.GET({
            uri: bookingEndpoints.searchBookings,
            params: {
              domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
              rating: selectedRating,
            },
          }),
        ];

        const res = await Promise.all(apiToFetch);

        setBanners(res[0].data.banners);
        setBestProducts(res[1].data.products);
        setRecommendedProducts(res[2].data.products);
        if (res[3].data.services === 0) {
          setServices(res[4].data.services);
        } else setServices(res[3].data.services);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const truncateText = (text: string, length: number) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  const handleBookingClick = (bookingId: string) => {
    router.push(`/bookings/services/${bookingId}`);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const renderRating = (rating: number) => (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-[100vh]">
      {loading ? (
        <Loader className="h-full flex-grow" />
      ) : (
        <>
          {banners.length > 0 && (
            <section className="w-full py-8 md:py-16 lg:py-20 bg-cover bg-center mx-auto">
              <div className="container px-4 md:px-6 space-y-4">
                <Carousel className="w-full">
                  <CarouselContent className="relative w-full h-[500px]">
                    {banners.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
                          index === currentBannerIndex
                            ? "transform translate-x-0"
                            : "transform -translate-x-full"
                        }`}
                      >
                        <div className="relative flex justify-center items-center w-full h-full bg-opacity-30 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt="Banner"
                            layout="fill"
                            objectFit="cover"
                            className="banner-image"
                            priority={true}
                          />
                          <div
                            className="absolute top-0 left-0 h-full w-[50%] bg-slate-900 
                           bg-opacity-30 flex flex-col justify-center items-start px-4 overflow-y-auto rounded-lg"
                          >
                            <div className="flex flex-col items-start pl-4">
                              <h1
                                className="text-6xl  font-bold"
                                style={{ color: item.textColor }}
                              >
                                {item.title}
                              </h1>
                              <p
                                className="break-words text-left w-full text-xl pl-1"
                                style={{ color: item.textColor }}
                              >
                                {truncateText(item.description, 100)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </section>
          )}

          <section className="w-auto py-8 md:py-16 lg:py-20 bg-muted">
            <div className="container px-4 md:px-6 space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {lang.curLangPack.rootPage?.["featured"]}
                </h2>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {lang.curLangPack.rootPage?.["Check"]}
                </p>
              </div>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                  bestProducts.length < 4
                    ? "lg:grid-cols-3 justify-center"
                    : "lg:grid-cols-4"
                }`}
              >
                {bestProducts.length > 0
                  ? bestProducts.slice(0, 4).map((product, index) => (
                      <Card
                        onClick={() => handleProductClick(product.id)}
                        key={index}
                        className="card rounded-lg hover:shadow-lg cursor-pointer transition-shadow shadow-lg overflow-hidden"
                      >
                        <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
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
                          <h3 className="text-base font-semibold text-left">
                            {truncateText(product.name, 20)}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {renderRating(product.rating)}
                          </div>
                          <p className="text-sm text-gray-500 text-left">
                            {Number(product.price).toLocaleString("Vi-VN")} VND
                          </p>
                        </CardContent>
                        <CardFooter className="p-4">
                          <Link
                            href={`/product/${product.id}`}
                            className="w-full"
                          >
                            <Button
                              style={{
                                backgroundColor: profileStore.buttonColor,
                                color: profileStore.buttonTextColor,
                              }}
                              className="w-full text-sm"
                            >
                              {lang.curLangPack.rootPage?.["learn"]}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  : Array.from({ length: 4 }).map((_, index) => (
                      <Card
                        key={index}
                        className="card rounded-lg shadow-lg overflow-hidden"
                      >
                        <Skeleton className="w-full h-48 rounded-t-lg" />
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
          </section>

          <section className="w-auto md:py-10 pb-20  bg-muted">
            <div className="container px-4 md:px-6 space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {lang.curLangPack.rootPage?.["services"]}
                </h2>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {lang.curLangPack.rootPage?.["discover"]}
                </p>
              </div>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2  gap-6 lg:${(() => {
                  if (services.length == 1) return "grid-cols-1";
                  if (services.length == 2) return "grid-cols-2";
                  if (services.length == 3) return "grid-cols-3";
                  if (services.length >= 4) return "grid-cols-4";
                  return "";
                })()}`}
              >
                {services.length > 0
                  ? services.slice(0, 4).map((service, index) => (
                      <Card
                        onClick={() => handleBookingClick(service.id)}
                        key={index}
                        className="card rounded-lg cursor-pointer shadow-lg overflow-hidden"
                      >
                        <div className="relative h-48 rounded-t-lg overflow-hidden">
                          {service.images.length > 0 && (
                            <Image
                              src={service.images[0]}
                              alt={service.name}
                              layout="fill"
                              objectFit="cover"
                              priority={index === 0}
                            />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-base font-semibold text-left">
                            {truncateText(service.name, 20)}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {renderRating(service.rating)}
                          </div>
                          <p className="text-sm text-gray-500 text-left">
                            {Number(service.price).toLocaleString("Vi-VN")} VND
                          </p>
                        </CardContent>
                        <CardFooter className="p-4">
                          <Link
                            href={`/bookings/services/${service.id}`}
                            className="w-full"
                          >
                            <Button
                              style={{
                                backgroundColor: profileStore.buttonColor,
                                color: profileStore.buttonTextColor,
                              }}
                              className="w-full text-sm"
                            >
                              {lang.curLangPack.rootPage?.["learn"]}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  : Array.from({ length: 4 }).map((_, index) => (
                      <Card
                        key={index}
                        className="card rounded-lg shadow-lg overflow-hidden"
                      >
                        <Skeleton className="w-full h-48 rounded-t-lg" />
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
          </section>
          <section className="w-full py-8 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6 space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {lang.curLangPack.rootPage?.["about"]}
                </h2>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {profileStore.description}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
