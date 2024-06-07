"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/store/auth.store";
import Recommended from "../recommend-product";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import StarRating from "./rating";
import CommentForm from "./comment";
import { AXIOS } from "@/constants/network/axios";
import { ShoppingCart, Star } from "lucide-react";
import { productEndpoints } from "@/constants/api/product.api";
import { cartEndpoints } from "@/constants/api/cart.api";
import Swal from "sweetalert2";
import { getDomain } from "@/util/get-domain";
import LoadingPage from "@/app/loading";
import { useCart } from "@/constants/use-cart";

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
  });
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Default to true to show loader initially
  const [imageLoading, setImageLoading] = useState(true); // State to manage image loading
  const authStore: any = useAuthStore();
  const { addToCart } = useCart(); // Use addToCart from the custom hook

  const fetchData = async (productId: string) => {
    const domain = getDomain();
    try {
      setLoading(true);

      const res = await AXIOS.GET({
        uri: productEndpoints.findById(domain, params.id),
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
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoints.findAll("30shine.com"),
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
    if (authStore.isAuthorized == false) {
      router.push("/auth/login");
      return;
    } else
      try {
        const createCartResponse = await AXIOS.POST({
          uri: cartEndpoints.addItemToCart,
          params: {
            userId: "some userId",
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
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product added to cart successfully.",
          });
        }
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
    return <LoadingPage />;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative w-1/2 h-64 lg:h-96">
          {" "}
          {/* Adjust the height as needed */}
          {productData.images.length > 0 && (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingPage />
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
        <div>
          <h1 className="text-5xl font-bold">{productData.name}</h1>
          <div className="flex items-center">
            {Array.from({ length: productData.rating }, (_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
            ))}
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
          <div className="mt-4">{productData.price}VND</div>
          <p>{productData.description}</p>
          <div className="flex font-bold text-center gap-3 mb-2">
            <Button onClick={decrement}>-</Button>
            <h1 className="flex flex-col items-center my-2">{count}</h1>
            <Button onClick={increment}>+</Button>
          </div>
          <div className="flex gap-3">
            <Link href="/cart">
              <Button variant="outline">Order now</Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddToCart} className="btn btn-primary">
                Add to Cart
                <ShoppingCart />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-4 space-x-2 overflow-x-auto">
        {Array.isArray(productData.images) &&
          productData.images.map((image, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 flex-shrink-0 border ${
                // Adjusted thumbnail size
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
      <CommentForm productId={productData.id} />
      <div className="mb-4">
        {" "}
        <Recommended products={productsData.products} />
      </div>
    </div>
  );
}
