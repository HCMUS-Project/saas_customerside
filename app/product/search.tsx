"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { AXIOS } from "@/constants/network/axios";
import Image from "next/image";
import { productEndpoints } from "@/constants/api/product.api";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string | string[];
  // Add other properties if needed
}

const Search = () => {
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!query) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        const domain = "30shine.com"; // Change this to your actual domain
        const res = await AXIOS.GET({
          uri: productEndpoints.searchProductName(domain, query),
        });

        // Normalize query to lowercase for case-insensitive comparison
        const normalizedQuery = query.toLowerCase();

        // Normalize product names to lowercase for case-insensitive comparison
        const normalizedProducts = res.data.products.map(
          (product: Product) => ({
            ...product,
            name: product.name.toLowerCase(),
          })
        );

        // Filter products based on normalized query and product names
        const filteredProducts = normalizedProducts.filter((product: Product) =>
          product.name.includes(normalizedQuery)
        );

        setSearchResults(filteredProducts);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/all-products?search=${text}`);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        className="border p-2 px-4 rounded-lg w-full"
        type="text"
        placeholder="Enter any product"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
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
          {searchResults.map((product) => (
            <li
              key={product.id}
              className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleProductClick(product.id)}
            >
              <Image
                src={
                  Array.isArray(product.images)
                    ? product.images[0]
                    : product.images
                }
                width={40}
                height={40}
                alt={product.name}
                className="h-10 w-10 object-cover mr-2"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500">${product.price}</p>
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

export default Search;
