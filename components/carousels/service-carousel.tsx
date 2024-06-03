"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Service {
  imgSrc: string;
  name: string;
  description: string;
  id: string;
}

interface ServiceCarouselProps {
  serviceList: Service[];
}

export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  serviceList,
}) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
    }
  }, []);

  return (
    <Carousel
      opts={{
        align: "start",
        duration: 500,
        loop: true,
      }}
      className="w-full h-[30%] my-10"
    >
      <CarouselContent>
        {Array.from(serviceList).map((_, index) => {
          return (
            <CarouselItem key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={serviceList[index].imgSrc}
                  alt="Service Image"
                  width={screenWidth}
                  height={200}
                  className="rounded-sm"
                />
                <div
                  className={`absolute top-0 right-0 w-[50%] 
                  h-full bg-slate-400  00 bg-opacity-30 p-2 justify-center items-center flex flex-col px-4 overflow-y-auto ${
                    isDesktop ? "gap-8" : "gap-2" 
                  }`}
                >
                  <p
                    className={`${
                      isDesktop ? "text-6xl" : "text-md"
                    } text-secondary`}
                  >
                    {serviceList[index].name}
                  </p>
                  <p
                    className={`w-[90%] ${
                      isDesktop ? "text-xl" : "text-smF"
                    } text-secondary-focus`}
                  >
                    {`"${serviceList[index].description.substring(
                      0,
                      isDesktop ? 100 : 40
                    )}"`}{" "}
                    <Link href="">...View more</Link>
                  </p>
                  <Button>Book Now</Button>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
