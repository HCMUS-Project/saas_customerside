"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AXIOS } from "@/constants/network/axios";
import { ShoppingCart, Star } from "lucide-react";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { useAuthStore } from "@/hooks/store/auth.store";
import { getDomain } from "@/util/get-domain";
import LoadingPage from "@/app/loading";

interface CartItem {
  id: string;
  images: string | string[];
  name: string;
  price: number;
  quantity: number;
}

interface ServiceData {
  id: string;
  images: string[];
  name: string;
  price: number;
  rating: string;
  description: string;
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

  const [bookingData, setBookingData] = useState<ServiceData>({
    id: "",
    images: [],
    name: "",
    price: 0,
    rating: "",
    description: "",
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Default to true to show loader initially
  const [imageLoading, setImageLoading] = useState(true); // State to manage image loading
  const authStore = useAuthStore();

  const fetchData = async (serviceId: string) => {
    try {
      const domain = getDomain();
      const res = await AXIOS.GET({
        uri: bookingEndpoints.findById("30shine.com", serviceId),
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

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative w-1/3 h-48 lg:h-64">
          {" "}
          {/* Adjust the height as needed */}
          {bookingData.images.length > 0 && (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingPage />
                </div>
              )}

              <Image
                src={bookingData.images[selectedImageIndex]}
                alt={bookingData.name}
                layout="fill"
                objectFit="cover" // Adjusted to 'contain' to fit the image inside the container
                className={`cursor-pointer ${
                  selectedImageIndex ? "opacity-100" : "opacity-50"
                }`}
                onLoadingComplete={() => setImageLoading(false)}
              />
            </>
          )}
        </div>
        <div>
          <h1 className="text-3xl lg:text-5xl font-bold">{bookingData.name}</h1>
          <div className="flex items-center">
            {Array.from({ length: Number(bookingData.rating) }, (_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
            ))}
          </div>
          <div className="mt-4">{bookingData.price}VND</div>
          <p>{bookingData.description}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleOrderNow}>
              Book now
            </Button>
          </div>
        </div>
      </div>
      <div className="flex mt-4 space-x-2 overflow-x-auto">
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
                layout="fill"
                objectFit="cover"
                className={`cursor-pointer ${
                  index === selectedImageIndex ? "opacity-100" : "opacity-50"
                }`}
                onLoadingComplete={() => setImageLoading(false)}
              />
            </div>
          ))}
      </div>
      {/* Uncomment the following lines if you want to add comments and recommendations */}
      {/* <CommentForm /> */}
      {/* <Recommended products={bookingsData.services} /> */}
    </div>
  );
}
