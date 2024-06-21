"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AXIOS } from "@/constants/network/axios";
import { Star } from "lucide-react";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { useAuthStore } from "@/hooks/store/auth.store";
import { getDomain } from "@/util/get-domain";
import LoadingPage from "@/app/loading";
import CommentForm from "./comment";

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

  const fetchData = async (serviceId: string) => {
    try {
      const domain = getDomain();
      const res = await AXIOS.GET({
        uri: bookingEndpoints.findById(domain, serviceId),
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
    <div className="container mx-auto mt-10 mb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <div className="relative w-full h-96 mb-4">
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
            {Array.from({ length: bookingData.rating }, (_, i) => (
              <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
            ))}
          </div>
          <div className="mt-4 text-2xl ">{bookingData.price} VND</div>
          <p className="mt-2">{bookingData.description}</p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleOrderNow}>
              Book now
            </Button>
          </div>
        </div>
      </div>
      <CommentForm serviceId={bookingData.id} />
    </div>
  );
}
