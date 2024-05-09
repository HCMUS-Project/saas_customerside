"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { AXIOS } from "@/constants/network/axios";
import { productEndpoint } from "@/constants/api/auth.api";
import { useAccessToken } from "../AccessTokenContext";
interface Product {
  id: string;
  name: string;
  // Other properties
}
const Search = () => {
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [query] = useDebounce(text, 500);
  const { accessToken } = useAccessToken();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!query) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        const res = await AXIOS.GET({
          uri: `${productEndpoint.searchProduct}?name=${query}`, // Adjust the endpoint based on your API
          token: accessToken, // Replace 'your-access-token' with the actual access token
        });
        setSearchResults(res.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, accessToken]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="relative">
      <Input
        className="border p-2 px-4 rounded-lg w-full "
        type="text"
        placeholder="Enter any product"
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
          {searchResults.map((product) => (
            <li
              key={product.id}
              className="px-3 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleProductClick(product.id)}
            >
              {product.name}
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
