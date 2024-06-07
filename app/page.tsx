"use client";

import { ItemCard } from "@/components/cards/item-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { configEnpoints } from "@/constants/api/config.api";
import { mockProducts } from "@/constants/mock-data/mock-product";
import { BannerProp } from "@/constants/models/interface";
import { AXIOS } from "@/constants/network/axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Array<BannerProp>>([]);
  const [imagesWidth, setImagesWidth] = useState<Array<number>>([]);
  const [bestProducts, setBestProducts] = useState<Array<any>>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Array<any>>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const apiToFetch = [
          AXIOS.GET({
            uri: configEnpoints.findBanner,
            params: {
              domain: "30shine.com",
            },
          }),
          AXIOS.GET({
            uri: ecommerceEndpoints.findBestProducts,
            params: {
              domain: "30shine.com",
            },
          }),
          AXIOS.GET({
            uri: ecommerceEndpoints.findRecommendedProducts,
            params: {
              domain: "30shine.com",
            },
          }),
        ];

        const res = await Promise.all(apiToFetch);

        console.log(res[2].data);

        setBanners(res[0].data.banners);
        setImagesWidth(new Array(res[0].data.banners.length).fill(0));
        setBestProducts(res[1].data.products);
        setRecommendedProducts(res[2].data.products);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(imagesWidth);
  }, [imagesWidth]);

  return (
    <main className="flex min-h-screen flex-col items-center pt-10">
      {banners.length > 0 && (
        <Carousel className="w-[65%]">
          <CarouselContent>
            {banners.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative mt-4 flex justify-center items-center">
                  <Image
                    height={window.innerHeight / 2}
                    width={window.innerWidth / 2}
                    src={item.image}
                    className=" w-auto h-auto rounded-lg"
                    alt="Banner"
                    onLoad={(e) => {
                      const width = (e.target as HTMLImageElement).offsetWidth;

                      setImagesWidth((prevImagesWidth) => {
                        const newImgWidthArr = Array.from(prevImagesWidth);
                        newImgWidthArr[index] = width;
                        return newImgWidthArr;
                      });
                    }}
                  />

                  <div
                    className="absolute top-0 right-0 h-full w-[50%] max-h-full bg-slate-900 
                      bg-opacity-30 flex flex-col justify-center items-center px-4 overflow-y-auto rounded-tr-lg rounded-br-lg"
                    style={
                      imagesWidth[index] > 0
                        ? { width: imagesWidth[index] * 0.5 }
                        : {}
                    }
                  >
                    <h3
                      className={`text-2xl font-bold`}
                      style={{
                        color: item.textColor,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`break-words text-center w-full`}
                      style={{
                        color: item.textColor,
                      }}
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
      )}

      {bestProducts.length > 0 && (
        <div className="flex flex-col justify-start w-full m-4">
          <h3>Best Products</h3>

          <Carousel>
            <CarouselContent>
              {bestProducts.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardHeader>
                      <div className="w-full">
                        {product.name.length > 20 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <h4>{product.name.slice(0, 20)}...</h4>
                              </TooltipTrigger>

                              <TooltipContent>
                                <h4>{product.name}</h4>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <h4>{product.name}</h4>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      {product.images.length > 0 && (
                        <Carousel>
                          <CarouselContent className="flex justify-center">
                            {product.images.map(
                              (image: string, _index: number) => (
                                <CarouselItem key={_index}>
                                  <Image
                                    src={image}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                  />
                                </CarouselItem>
                              )
                            )}
                          </CarouselContent>
                        </Carousel>
                      )}

                      {product.description.length > 20 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p>{product.description.slice(0, 20)}...</p>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>{product.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p>{product.description}</p>
                      )}
                    </CardContent>

                    <CardFooter>
                      <div className="w-full flex justify-between">
                        <div>{product.price}</div>

                        <div className="flex items-center">
                          <button>Add to cart</button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {recommendedProducts.length > 0 && (
        <div className="flex flex-col justify-start w-full m-4">
          <h3>Recommended Products</h3>

          <Carousel>
            <CarouselContent>
              {recommendedProducts.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardHeader>
                      <div className="w-full">
                        {product.name.length > 20 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <h4>{product.name.slice(0, 20)}...</h4>
                              </TooltipTrigger>

                              <TooltipContent>
                                <h4>{product.name}</h4>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <h4>{product.name}</h4>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      {product.images.length > 0 && (
                        <Carousel>
                          <CarouselContent className="flex justify-center">
                            {product.images.map(
                              (image: string, _index: number) => (
                                <CarouselItem key={_index}>
                                  <Image
                                    src={image}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                  />
                                </CarouselItem>
                              )
                            )}
                          </CarouselContent>
                        </Carousel>
                      )}

                      {product.description.length > 20 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p>{product.description.slice(0, 20)}...</p>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>{product.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p>{product.description}</p>
                      )}
                    </CardContent>

                    <CardFooter>
                      <div className="w-full flex justify-between">
                        <div>{product.price}</div>

                        <div className="flex items-center">
                          <button>Add to cart</button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </main>
  );
}
