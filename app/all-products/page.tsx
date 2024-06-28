"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AXIOS } from "@/constants/network/axios";
import { productEndpoints } from "@/constants/api/product.api";
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
import { SearchIcon } from "lucide-react";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
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
  const domain = "30shine.com"; // Change this to your actual domain
  const profileStore = useProfileStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await AXIOS.GET({
          uri: ecommerceEndpoints.findCategories(domain),
        });
        // Extract the category names from the response
        const categoryNames = res.data.categories.map(
          (category: { name: string }) => category.name
        );
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
            { label: "0 - 100k", value: [0, 100000] },
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
                onChange={() => setSelectedPriceRange(range.value)}
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
      <Button onClick={resetFilters} className="mt-4">
        Reset All Filters
      </Button>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  images: string[];
}

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <Card className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-48">
              <Image
                className="object-contain rounded-t-lg"
                src={product.images?.[0] ?? "/placeholder-image.png"}
                alt={product.name}
                layout="fill"
              />
            </div>
            <CardContent>
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.price} VND</p>
              <div className="flex items-center mt-2">
                {Array.from({ length: product.rating }).map((_, index) => (
                  <span key={index} className="text-yellow-400">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - product.rating }).map((_, index) => (
                  <span key={index} className="text-gray-300">
                    ★
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

const AllProductList: React.FC = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    0, 1000000,
  ]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const router = useRouter();

  const fetchProducts = async (page = 1, query?: string) => {
    try {
      setLoading(true);
      const queryParams = [
        `category=${selectedCategory.join(",")}`,
        `minPrice=${selectedPriceRange[0] || ""}`,
        `maxPrice=${selectedPriceRange[1] || ""}`,
        `rating=${selectedRating || ""}`,
        query ? `name=${query}` : "",
      ]
        .filter(Boolean)
        .join("&");

      const res = await AXIOS.GET({
        uri: productEndpoints.searchProduct("30shine.com", queryParams),
      });

      setProductsData(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery || undefined);
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
    router.push(`/all-products?search=${e.target.value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="relative w-full">
          <Input
            className="border p-2 px-4 rounded-lg w-full"
            type="text"
            placeholder="Search for products"
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
            <ProductList products={productsData} />
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

export default AllProductList;
