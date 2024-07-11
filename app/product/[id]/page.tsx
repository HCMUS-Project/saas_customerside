"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/store/auth.store";
import Recommended from "../recommend-product";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import CommentForm from "./comment";
import { AXIOS } from "@/constants/network/axios";
import { productEndpoints } from "@/constants/api/product.api";
import { cartEndpoints } from "@/constants/api/cart.api";
import Swal from "sweetalert2";
import { useCart } from "@/constants/use-cart";
import { useProfileStore } from "@/hooks/store/profile.store";
import eventBus from "@/hooks/evenBus";
import { useLanguage } from "@/hooks/use-language";

interface CartItem {
  id: string;
  images: string | string[];
  name: string;
  price: number;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id: string;
  images: string[];
  name: string;
  price: number;
  rating: number;
  description: string;
  categories: Category[];
  quantity: number; // Add the quantity field here
}

export default function ProductPageProps({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const [productsData, setProductsData] = useState<{ products: any[] }>({
    products: [],
  });
  const productId = params.id;
  const [productData, setProductData] = useState<ProductData>({
    id: "",
    images: [],
    name: "",
    price: 0,
    rating: 0,
    description: "",
    categories: [],
    quantity: 0, // Initialize the quantity
  });
  const router = useRouter();
  const [count, setCount] = useState(1); // Default count to 1
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Default to true to show loader initially
  const [imageLoading, setImageLoading] = useState(true); // State to manage image loading
  const authStore: any = useAuthStore();
  const { addToCart } = useCart(); // Use addToCart from the custom hook
  const profileStore = useProfileStore();
  const lang = useLanguage();

  const fetchData = async (productId: string) => {
    const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN;
    try {
      setLoading(true);

      const res = await AXIOS.GET({
        uri: productEndpoints.findById(domain ?? "", params.id),
      });

      const product = res.data;
      setProductData(product);
      console.log(product);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(productId);
  }, [productId]);

  const increment = () => {
    if (count < productData.quantity) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoints.findAll(
            process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? ""
          ),
        });
        setProductsData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async () => {
    if (!Number.isInteger(count) || count <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid quantity greater than 0.",
      });
      return;
    }
    if (!authStore.isAuthorized) {
      router.push("/auth/login");
      return;
    } else
      try {
        const createCartResponse = await AXIOS.POST({
          uri: cartEndpoints.addItemToCart,
          params: {
            userId: "someID",
            cartItem: {
              productId: productData.id,
              quantity: count,
            },
          },
        });

        console.log("Create Cart Response:", createCartResponse);

        if (
          createCartResponse.statusCode >= 200 &&
          createCartResponse.statusCode < 300
        ) {
          console.log("Product added to cart successfully.");
          addToCart({
            // Call addToCart from the custom hook
            productId: productData.id,
            images: productData.images,
            name: productData.name,
            price: productData.price,
            quantity: count,
          });
          const updatedCartItems = JSON.parse(
            localStorage.getItem("cartItems") || "[]"
          );
          updatedCartItems.push({
            productId: productData.id,
            images: productData.images,
            name: productData.name,
            price: productData.price,
            quantity: count,
          });
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          eventBus.dispatch("cartUpdated", updatedCartItems);
          Swal.fire({
            icon: "success",
            title: `${lang.curLangPack.noti?.["success"]}`,
            text: `${lang.curLangPack.noti?.["added"]}`,
          });
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${lang.curLangPack.noti?.["somethingWrong"]}`,
        });
      }
  };

  const handleOrderNow = async () => {
    if (!Number.isInteger(count) || count <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid quantity greater than 0.",
      });
      return;
    }
    if (!authStore.isAuthorized) {
      router.push("/auth/login");
      return;
    } else
      try {
        await handleAddToCart(); // Add the product to the cart
        localStorage.setItem("selectedProductId", productData.id); // Store the product ID in localStorage
        router.push("/cart"); // Redirect to the cart page
      } catch (error) {
        console.error("Error adding product to cart:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again.",
        });
      }
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
            <div className="flex flex-wrap mt-2 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full text-sm"
                ></span>
              ))}
            </div>
            <div className="mt-4 h-8 bg-gray-300"></div>
            <div className="flex items-center mt-4 gap-3">
              <div className="w-8 h-8 bg-gray-300"></div>
              <span className="text-lg bg-gray-300 h-8 w-8"></span>
              <div className="w-8 h-8 bg-gray-300"></div>
            </div>
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
          <CommentForm productId={productData.id} />
        </div>
        <div className="mt-8">
          <Recommended products={productsData.products} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 mb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <div className="relative w-full h-96 mb-4">
            {productData.images.length > 0 && (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <Image
                  src={productData.images[selectedImageIndex]}
                  alt={productData.name}
                  fill
                  className="object-contain"
                  onLoadingComplete={() => setImageLoading(false)}
                />
              </>
            )}
          </div>
          <div className="flex mt-2 space-x-2 overflow-x-auto">
            {Array.isArray(productData.images) &&
              productData.images.map((image, index) => (
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
          <h1 className="text-3xl lg:text-5xl font-bold">{productData.name}</h1>
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4  ${
                  i < productData.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">{productData.rating}/5</span>
          </div>
          <div className="flex flex-wrap mt-2 gap-2">
            {productData.categories.map((category) => (
              <span
                key={category.id}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
          <div className="mt-4 text-2xl font-bold ">
            {productData.price.toLocaleString("Vi")} VND
          </div>
          <div className="flex items-center mt-4 gap-3">
            <Button
              style={{
                backgroundColor: profileStore.buttonColor,
                color: profileStore.buttonTextColor,
              }}
              onClick={decrement}
              className="flex items-center justify-center w-8 h-8 p-0"
            >
              -
            </Button>
            <span className="text-lg">{count}</span>
            <Button
              style={{
                backgroundColor: profileStore.buttonColor,
                color: profileStore.buttonTextColor,
              }}
              onClick={increment}
              className="flex items-center justify-center w-8 h-8 p-0"
            >
              +
            </Button>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleOrderNow}
              disabled={productData.quantity === 0}
            >
              {productData.quantity === 0
                ? `${lang.curLangPack.products?.["soldOut"]}`
                : `${lang.curLangPack.products?.["orderNow"]}`}
            </Button>
            <Button
              style={{
                backgroundColor: profileStore.buttonColor,
                color: profileStore.buttonTextColor,
              }}
              onClick={handleAddToCart}
              className="btn btn-primary"
              disabled={productData.quantity === 0}
            >
              {productData.quantity === 0
                ? `${lang.curLangPack.products?.["soldOut"]}`
                : `${lang.curLangPack.products?.["add"]}`}
              <ShoppingCart className="ml-2" />
            </Button>
          </div>
          <div className="mt-8 pt-2 border-t-2 ">
            <h2 className="text-2xl font-bold">
              {lang.curLangPack.products?.["description"]}
            </h2>
            <p className="mt-2">{productData.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CommentForm productId={productData.id} />
      </div>
      <div className="mt-8">
        <Recommended products={productsData.products} />
      </div>
    </div>
  );
}
