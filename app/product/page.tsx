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
import { SearchIcon, Star, ShoppingCart } from "lucide-react";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useCart } from "@/constants/use-cart";
import Swal from "sweetalert2";
import { cartEndpoints } from "@/constants/api/cart.api";
import { useAuthStore } from "@/hooks/store/auth.store";
import eventBus from "@/hooks/evenBus";
import { useLanguage } from "@/hooks/use-language";

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
  const lang = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await AXIOS.GET({
          uri: ecommerceEndpoints.findCategories(domain ?? ""),
        });
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
  }, [domain]);

  return (
    <div className="p-4 w-64 h-full bg-white rounded-lg shadow-md">
      <h2 className="font-bold mb-4">
        {lang.curLangPack.products?.["filter"]}
      </h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          {lang.curLangPack.products?.["category"]}
        </h3>
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
        <h3 className="font-semibold mb-2">
          {lang.curLangPack.services?.["price"]}
        </h3>
        <ul>
          {[
            { label: "0 - 100k", value: [1, 100000] },
            { label: "100k - 500k", value: [100000, 500000] },
            { label: "500k - 1m", value: [500000, 1000000] },
            { label: "1m - 2m", value: [1000000, 2000000] },
            { label: "2m - 3m", value: [2000000, 3000000] },
            { label: "3m - 4m", value: [3000000, 4000000] },
            { label: "4m - 5m", value: [4000000, 5000000] },
            { label: "5m - 10m", value: [5000000, 10000000] },
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
        <h3 className="font-semibold mb-2">
          {lang.curLangPack.products?.["rating"]}
        </h3>
        <ul>
          {[4, 3, 2, 1].map((rating) => (
            <li key={rating}>
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
              />
              <span className="ml-2">
                {rating} {lang.curLangPack.products?.["starUp"]}
              </span>
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
        {lang.curLangPack.products?.["reset"]}
      </Button>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  rating: number;
  category: string;
  images: string[];
}

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const profileStore = useProfileStore();
  const { addToCart } = useCart();
  const authStore: any = useAuthStore();
  const router = useRouter();
  const lang = useLanguage();

  const handleAddToCart = async (product: Product) => {
    // if (!authStore.userId) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "User is not authenticated. Please log in first.",
    //   });
    //   return;
    // }
    if (!authStore.isAuthorized) {
      router.push("/auth/login");
      return;
    } 
      else try {
      const createCartResponse = await AXIOS.POST({
        uri: cartEndpoints.addItemToCart,
        params: {
          userId: "something",
          cartItem: {
            productId: product.id,
            quantity: 1,
          },
        },
      });

      addToCart({
        productId: product.id,
        images: product.images,
        name: product.name,
        price: product.price,
        quantity: 1,
      });

      const updatedCartItems = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      updatedCartItems.push({
        productId: product.id,
        images: product.images,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      eventBus.dispatch("cartUpdated", updatedCartItems);

      Swal.fire({
        icon: "success",
        title: `${lang.curLangPack.noti?.["success"]}`,
        text: `${lang.curLangPack.noti?.["added"]}`,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${lang.curLangPack.noti?.["somethingWrong"]}`,
      });
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
          key={product.id}
          onClick={() => handleProductClick(product.id)}
        >
          <div className="relative w-full h-48">
            <Image
              className="object-contain rounded-t-lg"
              src={product.images?.[0] ?? "/placeholder-image.png"}
              alt={product.name}
              layout="fill"
            />
          </div>
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < product.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">
              {product.rating.toFixed(1)}/5
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-semibold mb-2">
            {product.price.toLocaleString("vi-VN")} VND
          </p>
          <Button
            className="w-full mt-1"
            style={{
              backgroundColor: profileStore.buttonColor,
              color: profileStore.buttonTextColor,
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click event from bubbling up to the product card
              handleAddToCart(product);
            }}
            disabled={product.quantity === 0}
          >
            {product.quantity === 0
              ? `${lang.curLangPack.products?.["soldOut"]}`
              : `${lang.curLangPack.products?.["add"]}`}
            <ShoppingCart className="ml-2" />
          </Button>
        </div>
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
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const router = useRouter();

  const itemsPerPage = 9;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = [
        `category=${selectedCategory.join(",")}`,
        `minPrice=${selectedPriceRange[0] || ""}`,
        selectedPriceRange[1] !== 1000000
          ? `maxPrice=${selectedPriceRange[1]}`
          : "",
        `rating=${selectedRating || ""}`,
        searchQuery ? `name=${searchQuery}` : "",
      ]
        .filter(Boolean)
        .join("&");

      const res = await AXIOS.GET({
        uri: productEndpoints.searchProduct(
          process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? "",
          queryParams
        ),
      });

      setProductsData(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPriceRange, selectedRating, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/product?search=${e.target.value}`);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = productsData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(productsData.length / itemsPerPage);

  const resetFilters = () => {
    setSelectedCategory([]);
    setSelectedPriceRange([0, 1000000]);
    setSelectedRating(null);
    setCurrentPage(1);
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
            <ProductList products={currentProducts} />
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
