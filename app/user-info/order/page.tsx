"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { OrderDataTable } from "./order-data-table";
import { getOrderColumns, Order, Product } from "./order-columns"; // Import Product type here
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import { productEndpoints } from "@/constants/api/product.api";
import Loader from "@/app/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { reviewEndpoint } from "@/constants/api/review.api";
import { authEndpoint } from "@/constants/api/auth.api";
import { CameraIcon, Star, StarHalf, StarHalfIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Comment {
  id: string;
  user: string;
  userId: string;
  review: string;
  rating: number;
}

interface ProductDetails extends Product {
  rating?: number;
}

interface ReviewState {
  [productId: string]: string;
}

interface RatingState {
  [productId: string]: number;
}

interface CommentsState {
  [productId: string]: Comment[];
}

interface HasUserCommentedState {
  [productId: string]: boolean;
}

async function fetchProductDetails(
  productId: string
): Promise<ProductDetails | null> {
  const domain = "30shine.com"; // Replace with your valid domain
  try {
    const res = await AXIOS.GET({
      uri: productEndpoints.findById(domain, productId),
    });
    const productDetails = res.data;
    const imgSrc = productDetails.images?.[0] || "";
    const name = productDetails.name || "Unknown Product"; // Assuming product name is in `productDetails.name`
    return { productId, imgSrc, name, quantity: 1 }; // Adding a default quantity
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return null;
  }
}

async function fetchOrders(
  stage: string,
  page: number,
  limit: number
): Promise<{ orders: Order[]; total: number }> {
  try {
    const res = await AXIOS.GET({
      uri: ecommerceEndpoints.searchOrder(stage),
    });
    const orders = res.data.orders;

    const fetchProductPromises = orders.map(async (order: Order) => {
      const productDetailsPromises = order.products.map(async (product) => {
        const productDetails = await fetchProductDetails(product.productId);
        if (productDetails) {
          product.imgSrc = productDetails.imgSrc;
          product.name = productDetails.name;
        }
        return product;
      });
      order.products = await Promise.all(productDetailsPromises);
      return order;
    });

    const fetchedOrders = await Promise.all(fetchProductPromises);
    return { orders: fetchedOrders, total: res.data.total };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { orders: [], total: 0 };
  }
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<
    ProductDetails[] | null
  >(null);
  const [comments, setComments] = useState<CommentsState>({});
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [review, setReview] = useState<ReviewState>({});
  const [rating, setRating] = useState<RatingState>({});
  const [hasUserCommented, setHasUserCommented] =
    useState<HasUserCommentedState>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const limit = 10;

  const formSchema = z.object({
    review: z.string().min(2, {
      message: "Review must be at least 2 characters.",
    }),
    rating: z.number().min(0).max(5, {
      message: "Rating must be between 0 and 5.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review: "",
      rating: 0,
    },
  });

  const ratingLabels = ["Quá tệ", "Tệ", "Bình thường", "Hài lòng", "Tuyệt vời"];

  const fetchProfileAndComments = useCallback(async (productId: string) => {
    try {
      // Fetch user profile
      const profileResponse = await AXIOS.GET({
        uri: authEndpoint.getProfile,
      });
      const userEmail = profileResponse.data.email;
      const userId = profileResponse.data.id;
      setUserEmail(userEmail);
      setUserId(userId);
      console.log("Fetched user profile:", userEmail, userId);

      // Fetch comments
      const domain = "30shine.com";
      const commentsResponse = await AXIOS.GET({
        uri: reviewEndpoint.ecommerceReviewFind(domain, productId),
      });
      if (
        commentsResponse.data &&
        Array.isArray(commentsResponse.data.reviews)
      ) {
        setComments((prevComments) => ({
          ...prevComments,
          [productId]: commentsResponse.data.reviews,
        }));
        console.log("Fetched comments:", commentsResponse.data.reviews);
        const userComment = commentsResponse.data.reviews.find(
          (comment: Comment) => comment.userId === userId
        );
        setHasUserCommented((prev) => ({
          ...prev,
          [productId]: !!userComment,
        }));
      } else {
        console.error("Unexpected response format:", commentsResponse.data);
        setComments((prevComments) => ({
          ...prevComments,
          [productId]: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  const fetchAndSetOrders = useCallback(
    async (stage: string, page: number, limit: number) => {
      setLoading(true);
      const { orders, total } = await fetchOrders(stage, page, limit);
      setOrders(orders);
      setTotalOrders(total);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchAndSetOrders(stage, page, limit);
  }, [fetchAndSetOrders, stage, page]);

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    setPage(1); // Reset to first page when stage changes
    fetchAndSetOrders(newStage, 1, limit);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchAndSetOrders(stage, newPage, limit);
    }
  };

  const handleNextPage = () => {
    if (page * limit < totalOrders) {
      const newPage = page + 1;
      setPage(newPage);
      fetchAndSetOrders(stage, newPage, limit);
    }
  };

  const handleRatingClick = async (products: ProductDetails[]) => {
    setSelectedProducts(products);
    await Promise.all(
      products.map((product) => fetchProfileAndComments(product.productId))
    );
  };

  const handleDelete = async (productId: string, commentId: string) => {
    try {
      await AXIOS.DELETE({
        uri: reviewEndpoint.ecommerceReviewDelete(commentId),
      });
      setComments((prevComments) => ({
        ...prevComments,
        [productId]: prevComments[productId].filter((c) => c.id !== commentId),
      }));
      setHasUserCommented((prev) => ({
        ...prev,
        [productId]: false,
      }));
      fetchProfileAndComments(productId); // Refetch comments after deletion
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const handleSubmit = async (
    productId: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (hasUserCommented[productId]) {
      alert("You can only comment once on this product.");
      return;
    }
    const newComment = {
      review: review[productId],
      rating: rating[productId],
      productId: productId,
      userId: userId,
    };
    try {
      const response = await AXIOS.POST({
        uri: reviewEndpoint.ecommerceReviewCreate,
        params: newComment,
      });
      console.log("Response data:", response.data);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        const createdComment = {
          ...response.data.review,
          user: userEmail,
        };
        setComments((prevComments) => ({
          ...prevComments,
          [productId]: [...prevComments[productId], createdComment],
        }));
        setHasUserCommented((prev) => ({
          ...prev,
          [productId]: true,
        }));
        setSuccessMessage("Review submitted successfully!");
      } else {
        console.error("Unexpected response format:", response.data);
      }
      setReview((prev) => ({
        ...prev,
        [productId]: "",
      }));
      setRating((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    } catch (error) {
      console.error("Error creating comment", error);
    }
  };

  if (loading) {
    return <Loader />; // Display the Loader component when loading
  }

  return (
    <div className="py-6">
      <div className="mt-6 flex justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-6 flex justify-center text-align-center">
        <p>Order Page</p>
      </div>
      <div className="flex justify-center text-align-center font-thin">
        <p>{userEmail}</p>
      </div>
      <div className="mt-8 overflow-x-hidden relative space-x-6">
        <div className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]">
          <Link
            href="/user-info"
            data-te-ripple-init
            data-te-ripple-color="light"
            className={cn(
              "inline-block rounded-md px-6 pb-3 pt-3.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700",
              ""
            )}
          >
            Account
          </Link>

          <Link
            href="/user-info/booking"
            data-te-ripple-init
            data-te-ripple-color="light"
            className={cn(
              "inline-block rounded-md px-6 pb-3 pt-3.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700",
              ""
            )}
          >
            Booking
          </Link>

          <Link
            href="/user-info/order"
            data-te-ripple-init
            data-te-ripple-color="light"
            className={cn(
              "inline-block rounded-md px-6 pb-3 pt-3.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700",
              "border-b-[3px] border-blue-300"
            )}
          >
            Order
          </Link>
        </div>
      </div>
      <div className="py-6">
        <div className="container mx-auto py-10">
          <div className="flex justify-center space-x-4 mb-4">
            <Button onClick={() => handleStageChange("pending")}>
              Pending
            </Button>
            <Button onClick={() => handleStageChange("shipping")}>
              Shipping
            </Button>
            <Button onClick={() => handleStageChange("completed")}>
              Completed
            </Button>
            <Button onClick={() => handleStageChange("cancelled")}>
              Cancelled
            </Button>
          </div>
          <OrderDataTable
            columns={getOrderColumns(stage, (order) =>
              handleRatingClick(order.products)
            )}
            data={orders}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedProducts}
        onOpenChange={() => setSelectedProducts(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh Giá Sản Phẩm</DialogTitle>
            <DialogDescription>
              Để lại đánh giá của bạn về sản phẩm này.
            </DialogDescription>
          </DialogHeader>
          {selectedProducts && selectedProducts.length > 0 && (
            <div className="overflow-y-auto max-h-96">
              {selectedProducts.map((product) => (
                <div key={product.productId} className="mb-6">
                  <div className="flex items-center">
                    <Image
                      src={product.imgSrc}
                      alt={product.name}
                      width={100}
                      height={100}
                    />
                    <div className="ml-4">
                      <h3>{product.name}</h3>
                      <p>Chất lượng sản phẩm: {product.rating || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {hasUserCommented[product.productId] ? (
                      <div className="text-green-500">
                        Bạn đã đánh giá sản phẩm này. Cảm ơn bạn!
                      </div>
                    ) : (
                      <Form {...form}>
                        <form
                          onSubmit={(e) => handleSubmit(product.productId, e)}
                          className="space-y-4"
                        >
                          <div className="flex items-center mb-4">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className="relative w-8 h-8 flex items-center"
                                onClick={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  if (clickX <= rect.width / 2) {
                                    setRating((prev) => ({
                                      ...prev,
                                      [product.productId]: i + 0.5,
                                    }));
                                  } else {
                                    setRating((prev) => ({
                                      ...prev,
                                      [product.productId]: i + 1,
                                    }));
                                  }
                                }}
                              >
                                <Star
                                  className={`w-8 h-8 cursor-pointer ${
                                    rating[product.productId] >= i + 1
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                                {rating[product.productId] < i + 1 && (
                                  <StarHalf
                                    className={`absolute left-0 w-8 h-8 cursor-pointer ${
                                      rating[product.productId] >= i + 0.5
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                            <span className="ml-2 text-yellow-500 text-xl">
                              {
                                ratingLabels[
                                  Math.ceil(rating[product.productId]) - 1
                                ]
                              }
                            </span>
                          </div>

                          <div className="mb-4">
                            <Label
                              htmlFor="review"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Đúng với mô tả:
                            </Label>
                            <Textarea
                              id="review"
                              value={review[product.productId] || ""}
                              onChange={(e) =>
                                setReview((prev) => ({
                                  ...prev,
                                  [product.productId]: e.target.value,
                                }))
                              }
                              placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                              required
                              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                          </div>

                          <Button
                            type="submit"
                            className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                          >
                            Submit
                          </Button>
                          {successMessage && (
                            <div className="mt-4 text-green-500">
                              {successMessage}
                            </div>
                          )}
                        </form>
                      </Form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage;
