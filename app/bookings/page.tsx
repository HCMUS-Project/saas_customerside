"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AXIOS } from "@/constants/network/axios";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { SearchIcon, Star } from "lucide-react";
import { useProfileStore } from "@/hooks/store/profile.store";

interface FiltersProps {
  selectedCategory: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPriceRange: number[];
  setSelectedPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRating: number | null;
  setSelectedRating: React.Dispatch<React.SetStateAction<number | null>>;
  resetFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedRating,
  setSelectedRating,
  resetFilters,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN; // Change this to your actual domain
  const profileStore = useProfileStore();

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       setLoadingCategories(true);
  //       const res = await AXIOS.GET({
  //         uri: bookingEndpoints.findCategories(domain),
  //       });
  //       // Extract the category names from the response
  //       const categoryNames = res.data.categories.map(
  //         (category: { name: string }) => category.name
  //       );
  //       setCategories(categoryNames);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     } finally {
  //       setLoadingCategories(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  return (
    <div className="p-4 w-64 bg-white rounded-lg shadow-md">
      <h2 className="font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Category</h3>
        <ul>
          {loadingCategories ? (
            <Skeleton className="h-6 w-full mb-2" />
          ) : (
            categories.map((category) => (
              <li key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategory.includes(category)}
                  onChange={() => {
                    if (selectedCategory.includes(category)) {
                      setSelectedCategory(
                        selectedCategory.filter((cat) => cat !== category)
                      );
                    } else {
                      setSelectedCategory([...selectedCategory, category]);
                    }
                  }}
                />
                <span className="ml-2">{category}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price</h3>
        <ul>
          {[
            { label: "0 - 100k", value: [1, 100000] },
            { label: "100k - 500k", value: [100000, 500000] },
            { label: "500k - 1m", value: [500000, 1000000] },
          ].map((range) => (
            <li key={range.label}>
              <input
                type="radio"
                name="price"
                checked={
                  selectedPriceRange[0] === range.value[0] &&
                  selectedPriceRange[1] === range.value[1]
                }
                onChange={(e) => setSelectedPriceRange(range.value)}
              />
              <span className="ml-2">{range.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Rating</h3>
        <ul>
          {[5, 4, 3].map((rating) => (
            <li key={rating}>
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
              />
              <span className="ml-2">{rating} Stars & up</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        style={{
          backgroundColor: profileStore.buttonColor,
          color: profileStore.buttonTextColor,
        }}
        onClick={resetFilters}
        className="mt-4"
      >
        Reset All Filters
      </Button>
    </div>
  );
};

interface Booking {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  images: string[];
}

const BookingList: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  const profileStore = useProfileStore();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <Link
          className=" bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
          href={`/bookings/services/${booking.id}`}
          key={booking.id}
        >
          <div className="relative w-full h-48">
            <Image
              className="object-contain rounded-t-lg"
              src={booking.images?.[0] ?? "/placeholder-image.png"}
              alt={booking.name}
              layout="fill"
            />
          </div>

          <h3 className="font-semibold text-lg truncate">{booking.name}</h3>
          <div className="flex items-center mt-1 ">
            {Array.from({ length: booking.rating }).map((_, index) => (
              <Star key={index} className="text-yellow-400 fill-current"></Star>
            ))}
            {Array.from({ length: 5 - booking.rating }).map((_, index) => (
              <Star key={index} className="text-gray-300"></Star>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1 font-semibold mb-2">
            {Number(booking.price).toLocaleString("vi-VN")} VND
          </p>
          <Button
            className="w-full mt1"
            style={{
              backgroundColor: profileStore.buttonColor,
              color: profileStore.buttonTextColor,
            }}
          >
            Book Now
          </Button>
        </Link>
      ))}
    </div>
  );
};

const AllBookingList: React.FC = () => {
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    1, 1000000,
  ]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const router = useRouter();

  const fetchBookings = async (page = 1, query?: string) => {
    try {
      setLoading(true);

      const res = await AXIOS.GET({
        uri: bookingEndpoints.searchBookings,
        params: {
          domain: process.env.NEXT_PUBLIC_TENANT_DOMAIN,
          priceHigher: selectedPriceRange[0],
          priceLower: selectedPriceRange[1],
          name: query,
        },
      });

      console.log(res);

      setBookingsData(res.data.services);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage, searchQuery || undefined);
  }, [
    selectedCategory,
    selectedPriceRange,
    selectedRating,
    currentPage,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSelectedCategory([]);
    setSelectedPriceRange([0, 1000000]);
    setSelectedRating(null);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/bookings?search=${e.target.value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="relative w-full">
          <Input
            className="border p-2 px-4 rounded-lg w-full"
            type="text"
            placeholder="Search for bookings"
            defaultValue={searchQuery || ""}
            onChange={handleSearch}
          />
          <SearchIcon
            className="absolute top-0 right-0 mr-3 mt-2 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <div className="flex">
        <Filters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          resetFilters={resetFilters}
        />
        <div className="flex-1 ml-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <Skeleton className="h-48 w-full mb-2 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <BookingList bookings={bookingsData} />
          )}
          <Pagination className="mt-8">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }).map((_, page) => (
                <PaginationItem key={page + 1}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(page + 1)}
                    isActive={currentPage === page + 1}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default AllBookingList;
