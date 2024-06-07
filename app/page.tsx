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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Array<BannerProp>>([]);
  const [imagesWidth, setImagesWidth] = useState<Array<number>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiToFetch = [
        AXIOS.GET({
          uri: configEnpoints.findBanner,
          params: {
            domain: "30shine.com",
          },
        }),
      ];

      const res = await Promise.all(apiToFetch);

      setBanners(res[0].data.banners);
      setImagesWidth(new Array(res[0].data.banners.length).fill(0));
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(imagesWidth);
  }, [imagesWidth]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-10">
      {banners.length > 0 && (
        <Carousel className="w-[50%]">
          <CarouselContent>
            {banners.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative mt-4 flex justify-center items-center">
                  <Image
                    height={window.innerHeight / 2}
                    width={window.innerWidth / 2}
                    src={item.image}
                    className=" w-auto h-auto"
                    alt="Banner"
                    onLoad={(e) => {
                      const width = (e.target as HTMLImageElement).offsetWidth;

                      const newImgWidthArr = Array.from(imagesWidth);
                      newImgWidthArr[index] = width;

                      setImagesWidth(newImgWidthArr);
                    }}
                  />

                  <div
                    className="absolute top-0 right-0 h-full  max-h-full bg-slate-900 
                      bg-opacity-30 flex flex-col justify-center items-center px-4 overflow-y-auto"
                    style={{
                      width: imagesWidth[index] / 2,
                    }}
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
    </main>
  );
}
