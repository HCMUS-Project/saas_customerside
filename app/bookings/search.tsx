"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { AXIOS } from "@/constants/network/axios";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import Image from "next/image";

interface Booking {
  id: string;
  name: string;
  price: number;
  images: string | string[];
  // Add other properties if needed
}

const SearchBooking = () => {
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!query) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        setLoading(true);

        const res = await AXIOS.GET({
          uri: bookingEndpoints.searchBookingsName(query),
        });

        if (res.data && res.data.booking) {
          // Normalize query to lowercase for case-insensitive comparison
          const normalizedQuery = query.toLowerCase();

          // Normalize booking names to lowercase for case-insensitive comparison
          const normalizedBookings = res.data.booking.map(
            (booking: Booking) => ({
              ...booking,
              name: booking.name.toLowerCase(),
            })
          );

          // Filter bookings based on normalized query and booking names
          const filteredBookings = normalizedBookings.filter(
            (booking: Booking) => booking.name.includes(normalizedQuery)
          );

          setSearchResults(filteredBookings);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [query]);

  const handleBookingClick = (bookingId: string) => {
    router.push(`/bookings/search?${bookingId}`);
  };

  return (
    <div className="relative">
      <Input
        className="border p-2 px-4 rounded-lg w-full"
        type="text"
        placeholder="Enter any booking"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <SearchIcon
        className="absolute top-0 right-0 mr-3 mt-2 text-gray-400"
        size={20}
      />
      {loading && (
        <p className="absolute z-10 w-full bg-white rounded-lg shadow-lg mt-2 py-1">
          Loading...
        </p>
      )}
      {!loading && searchResults.length > 0 && (
        <ul className="absolute z-10 w-full bg-white rounded-lg shadow-lg mt-2 py-1">
          {searchResults.map((booking) => (
            <li
              key={booking.id}
              className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleBookingClick(booking.id)}
            >
              <Image
                src={
                  Array.isArray(booking.images)
                    ? booking.images[0]
                    : booking.images
                }
                width={40}
                height={40}
                alt={booking.name}
                className="h-10 w-10 object-cover mr-2"
              />
              <div>
                <p className="font-semibold">{booking.name}</p>
                <p className="text-gray-500">${booking.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && searchResults.length === 0 && query && (
        <p className="absolute z-10 w-full bg-white rounded-lg shadow-lg mt-2 py-1">
          No results found
        </p>
      )}
    </div>
  );
};

export default SearchBooking;
