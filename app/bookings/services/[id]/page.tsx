"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AXIOS } from "@/constants/network/axios";
import { ShoppingCart, Star } from "lucide-react";
import { productEndpoints } from "@/constants/api/product.api";
import { getJwt } from "@/util/auth.util";
import { authEndpoint } from "@/constants/api/auth.api";
import { cartEndpoints } from "@/constants/api/cart.api";
import { access } from "fs";
import { error } from "console";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { useAuthStore } from "@/hooks/store/auth.store";

interface CartItem {
  id: string;
  images: string | string[];
  name: string;
  price: number;
  quantity: number;
}

export default function ServicePageProps({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingsData, setBookingsData] = useState<{ services: any[] }>({
    services: [],
  });
  const servicesId = params.id;

  const [bookingData, setBookingData] = useState<{
    id: string;
    images: string[];
    name: string;
    price: number;
    rating: string;
    description: string;
  }>({
    id: "",
    images: [],
    name: "",
    price: 0,
    rating: "",
    description: "",
  });

  const [count, setCount] = useState(0);
  const [cart, setCart] = useState(null);
  const authStore: any = useAuthStore();

  const fetchData = useCallback(async (serviceId: string) => {
    try {
      const domain = "30shine.com";
      const res = await AXIOS.GET({
        uri: bookingEndpoints.findById(domain, serviceId), // Use the ID to create the URI of the service
      });
      const booking = res.data;
      setBookingData(booking);
      console.log(booking);
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(servicesId);
  }, []);

  const handleOrderNow = () => {
    if (authStore.isAuthorized == false) {
      router.push("/auth/login");
      return;
    }

    const serviceData = {
      id: servicesId,
      name: bookingData.name,
      image: bookingData.images[0],
    };

    localStorage.setItem("ServiceID", JSON.stringify(serviceData)); // Store the service data in local storage
    router.push("/bookings/services/form"); // Redirect to the booking form page
  };

  return (
    <div className="mt-4 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <Image
          src={bookingData?.images[0]}
          width={500}
          height={500}
          alt={bookingData?.name}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-5xl font-bold">{bookingData?.name}</h1>
          <div className="flex items-center">
            {Array.from({ length: Number(bookingData.rating) }, (_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
            ))}
          </div>
          <div className="mt-4">${bookingData?.price}</div>
          <p>{bookingData?.description}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleOrderNow}>
              Book now
            </Button>
          </div>
        </div>
      </div>
      {/* <CommentForm /> */}
      {/* <Recommended products={bookingsData.products} /> */}
    </div>
  );
}
