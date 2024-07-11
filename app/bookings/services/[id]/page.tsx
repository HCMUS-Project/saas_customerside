"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AXIOS } from "@/constants/network/axios";
import { Star } from "lucide-react";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { useAuthStore } from "@/hooks/store/auth.store";
import { Skeleton } from "@/components/ui/skeleton";
import CommentForm from "./comment";
import Recommended from "../../recommend-booking";
import { useLanguage } from "@/hooks/use-language";

interface ServiceData {
  id: string;
  images: string[];
  name: string;
  price: number;
  rating: number;
  description: string;
}

export default function BookingPageProps({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [bookingsData, setBookingsData] = useState<{ services: any[] }>({
    services: [],
  });
  const servicesId = params.id;

  const [bookingData, setBookingData] = useState<ServiceData>({
    id: "",
    images: [],
    name: "",
    price: 0,
    rating: 0,
    description: "",
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Default to true to show loader initially
  const [imageLoading, setImageLoading] = useState(true); // State to manage image loading
  const authStore = useAuthStore();
  const lang = useLanguage();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AXIOS.GET({
          uri: bookingEndpoints.findRecommended(
            process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? ""
          ),
        });
        setBookingsData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, []);
  const fetchData = async (serviceId: string) => {
    try {
      const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN;
      const res = await AXIOS.GET({
        uri: bookingEndpoints.findById(domain ?? "", serviceId),
      });
      const booking = res.data;
      setBookingData(booking);
      console.log(booking);
    } catch (error) {
      console.error("Error fetching service data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(servicesId);
  }, [servicesId]);

  const handleOrderNow = () => {
    if (!authStore.isAuthorized) {
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

  if (loading) {
    return (
      <div className="container mx-auto mt-10 mb-20 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center w-full lg:w-1/2">
            <div className="relative w-full h-96 mb-4 bg-gray-300"></div>
            <div className="flex mt-2 space-x-2 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 flex-shrink-0 border bg-gray-300"
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="h-12 bg-gray-300 mb-4"></div>
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-300 fill-current" />
              ))}
              <span className="ml-2 h-6 w-12 bg-gray-300"></span>
            </div>
            <div className="mt-4 h-8 bg-gray-300"></div>
            <div className="flex gap-3 mt-4">
              <div className="h-10 bg-gray-300 w-32"></div>
              <div className="h-10 bg-gray-300 w-32"></div>
            </div>
            <div className="mt-8 pt-2 border-t-2 border-gray-300">
              <h2 className="h-8 bg-gray-300"></h2>
              <p className="mt-2 h-20 bg-gray-300"></p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <CommentForm serviceId={bookingData.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 mb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <div className="relative w-full h-96 mb-4">
            {bookingData.images.length > 0 && (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <Image
                  src={bookingData.images[selectedImageIndex]}
                  alt={bookingData.name}
                  fill
                  className="object-contain"
                  onLoadingComplete={() => setImageLoading(false)}
                />
              </>
            )}
          </div>
          <div className="flex mt-2 space-x-2 overflow-x-auto">
            {Array.isArray(bookingData.images) &&
              bookingData.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 flex-shrink-0 border ${
                    index === selectedImageIndex
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index}`}
                    fill
                    className={`cursor-pointer ${
                      index === selectedImageIndex
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                    onLoadingComplete={() => setImageLoading(false)}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl lg:text-5xl font-bold">{bookingData.name}</h1>
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4  ${
                  i < bookingData.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">
              {bookingData.rating.toFixed()}/5
            </span>
          </div>
          <div className="mt-4 text-2xl font-bold ">
            {bookingData.price.toLocaleString()} VND
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleOrderNow}>
              {lang.curLangPack.services?.["bookNow"]}
            </Button>
          </div>
          <div className="mt-8 pt-2 border-t-2 ">
            <h2 className="text-2xl font-bold">
              {lang.curLangPack.services?.["description"]}
            </h2>
            <p className="mt-2">{bookingData.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CommentForm serviceId={bookingData.id} />
      </div>
      <div>
        {" "}
        <Recommended bookings={bookingsData.services} />
      </div>
    </div>
  );
}
