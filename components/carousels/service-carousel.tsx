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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      console.log("test: ", window.innerWidth);
    }
  }, []);

  return (
    <Carousel
      opts={{
        align: "start",
        duration: 500,
        loop: true,
      }}
      className="w-full"
      orientation="horizontal"
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
                  className="absolute top-0 right-0 w-[50%] h-full
                  bg-white bg-opacity-30 p-2 justify-center items-center flex flex-col gap-8 px-4"
                >
                  <p className="text-6xl text-secondary">{serviceList[index].name}</p>
                  <p className="w-[90%] text-xl text-secondary-focus">{`"${serviceList[index].description}"`}</p>
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
