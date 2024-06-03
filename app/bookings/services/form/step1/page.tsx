"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { AXIOS } from "@/constants/network/axios";

interface Service {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
}

const fetchServices = async (): Promise<Service[]> => {
  try {
    const domain = "30shine.com";
    const response = await AXIOS.GET({
      uri: bookingEndpoints.searchBookings(domain),
    });
    if (response.data && Array.isArray(response.data.services)) {
      return response.data.services;
    } else {
      console.error("Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export default function ServiceCards() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const servicesData = await fetchServices();
      setServices(servicesData);
    };

    getData();
  }, []);

  const form = useForm({});

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    console.log(service);
  };

  const onSubmit = () => {
    if (selectedService) {
      localStorage.setItem("selectedService", JSON.stringify(selectedService));
      localStorage.removeItem("ServiceID");
      router.push("/bookings/services/form");
    }
  };

  return (
    <div className="container mx-auto mt-8 pb-40">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="w-full text-center">
              <h1 className="text-3xl font-bold mb-4">
                Dịch vụ được yêu thích nhất
              </h1>
            </div>
            {services.length > 0 ? (
              services.map((service) => (
                <Card
                  key={service.id}
                  className={`w-full sm:w-1/2 lg:w-1/2 xl:w-1/3 border border-gray-200 rounded-xl overflow-hidden shadow-md ${
                    selectedService?.id === service.id ? "border-blue-500" : ""
                  }`}
                >
                  <div className="w-full h-[200px] relative">
                    <Image
                      className="object-cover"
                      src={service.images[0]}
                      alt={service.name}
                      layout="fill"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 font-bold">
                      {service.price.toLocaleString()} VND
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => handleSelectService(service)}
                    >
                      {selectedService?.id === service.id
                        ? "Đã chọn"
                        : "Chọn dịch vụ"}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No services available.</p>
            )}
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 z-50">
            <div className="flex justify-between items-center">
              <div>
                {selectedService && (
                  <div className="flex justify-between items-center mb-2">
                    <p>
                      {selectedService.name}{" "}
                      {selectedService.price.toLocaleString()} VND
                    </p>
                    {""}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedService(null)}
                    >
                      X
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-700 font-bold mb-2">
                  Tổng thanh toán:{" "}
                  {selectedService ? selectedService.price.toLocaleString() : 0}{" "}
                  VND
                </p>
                <Button type="submit" disabled={!selectedService}>
                  Xong
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <div className="h-24"></div>
    </div>
  );
}
