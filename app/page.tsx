"use client";

import { ItemCard } from "@/components/cards/item-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { mockProducts } from "@/constants/mock-data/mock-product";
import { ToggleThemeButton } from "@/constants/toggle-theme-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-10">
      <ToggleThemeButton />

      <Carousel
        opts={{
          align: "start",
          duration: 500,
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from(mockProducts).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
              <div className="p-1 ">
                <ItemCard
                  imgSrc={mockProducts[index].imgSrc}
                  name={mockProducts[index].name}
                  price={mockProducts[index].price}
                  type={mockProducts[index].type}
                  operation={() => {}}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
