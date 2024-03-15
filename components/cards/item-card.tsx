"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface ItemCardProps {
  imgSrc: string;
  name: string;
  linkTo?: string;
  price: number;
  type: string;
  operation: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  imgSrc,
  name,
  linkTo,
  price,
  type,
  operation,
}) => {
  const redirect = () => {
    if (linkTo) {
      window.location.href = linkTo;
    }
  };

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      console.log("test: ",window.innerWidth);
    }
  }, []);

  return (
    <Card
      onClick={() => {
        redirect();
      }}
      className="w-[70vw] h-[70vw] md:w-[25vw] md:h-[25vw] p-4"
    >
      <CardHeader>
        <div className="w-full">
          <h3>{name}</h3>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center w-full">
          <Image
            src={imgSrc}
            alt={name}
            width={screenWidth > 768 ? screenWidth * 0.7 : screenWidth * 0.3}
            height={200}
          />
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center w-full px-4">
          <div>
            <span>{price}</span>
            {type === "service" && <span> / shift</span>}
          </div>

          <Button onClick={operation}>
            {type === "product" ? "Add to cart" : "Book now"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
