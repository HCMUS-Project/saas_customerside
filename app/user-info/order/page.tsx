"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { OrderDataTable } from "./order-data-table";
import { getOrderColumns, Order } from "./order-columns";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import { productEndpoints } from "@/constants/api/product.api";
import Loader from "@/app/loading"; // Import the Loader component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { reviewEndpoint } from "@/constants/api/review.api";
import { authEndpoint } from "@/constants/api/auth.api";
import { CameraIcon, Star, VideoIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Comment {
  id: string;
  user: string;
  userId: string;
  review: string;
  rating: number;
}

async function fetchProductDetails(productId: string) {
  const domain = "30shine.com"; // Replace with your valid domain
  try {
    const res = await AXIOS.GET({
      uri: productEndpoints.findById(domain, productId),
    });
    const productDetails = res.data;
    const imgSrc = productDetails.images?.[0] || "";
    return { ...productDetails, imgSrc };
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
        product.imgSrc = productDetails?.imgSrc || "";
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editReview, setEditReview] = useState<string>("");
  const [editRating, setEditRating] = useState<number>(0);
  const [hasUserCommented, setHasUserCommented] = useState<boolean>(false);
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
        setComments(commentsResponse.data.reviews);
        console.log("Fetched comments:", commentsResponse.data.reviews);
      } else {
        console.error("Unexpected response format:", commentsResponse.data);
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { orders, total } = await fetchOrders(stage, page, limit);
      setOrders(orders);
      setTotalOrders(total);
      setLoading(false);
    };
    fetchData();
  }, [stage, page]);

  useEffect(() => {
    if (userId && comments.length > 0) {
      const userComment = comments.find(
        (comment: Comment) => comment.userId === userId
      );
      setHasUserCommented(!!userComment);
      console.log("User has commented:", !!userComment);
    }
  }, [userId, comments]);

  const handleStageChange = (newStage: string) => {
    setLoading(true);
    setStage(newStage);
    setPage(1); // Reset to first page when stage changes
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < totalOrders) {
      setPage(page + 1);
    }
  };

  const handleRatingClick = async (order: Order) => {
    setSelectedOrder(order);
    await fetchProfileAndComments(order.orderId);
  };

  const handleDelete = async (commentId: string) => {
    try {
      await AXIOS.DELETE({
        uri: reviewEndpoint.ecommerceReviewDelete(commentId),
      });
      setComments(comments.filter((c) => c.id !== commentId));
      setHasUserCommented(false);
      fetchProfileAndComments(selectedOrder!.orderId); // Refetch comments after deletion
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const handleEdit = async (editedComment: Omit<Comment, "user">) => {
    try {
      await AXIOS.POST({
        uri: reviewEndpoint.ecommerceReviewUpdate,
        params: editedComment,
      });
      setComments(
        comments.map((c) =>
          c.id === editedComment.id ? { ...editedComment, user: c.user } : c
        )
      );
      setEditMode(null);
      fetchProfileAndComments(selectedOrder!.orderId); // Refetch comments after editing
    } catch (error) {
      console.error("Error updating comment", error);
    }
  };

  const handleSaveEdit = () => {
    if (editMode) {
      const editedComment = {
        id: editMode,
        review: editReview,
        rating: editRating,
        userId: userId,
      };
      handleEdit(editedComment);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasUserCommented) {
      alert("You can only comment once on this product.");
      return;
    }
    const newComment = {
      review: review,
      rating: rating,
      productId: selectedOrder!.orderId,
      userId: userId,
    };
    try {
      const response = await AXIOS.POST({
        uri: reviewEndpoint.ecommerceReviewCreate,
        params: newComment,
      });
      console.log("Response data:", response.data);
      if (response.status >= 200 && response.status < 300) {
        const createdComment = {
          ...response.data,
          user: userEmail,
        };
        setComments((prevComments) => [...prevComments, createdComment]);
        setHasUserCommented(true);
        fetchProfileAndComments(selectedOrder!.orderId); // Refetch comments after adding a new one
      } else {
        console.error("Unexpected response format:", response.data);
      }
      setReview("");
      setRating(0);
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
        <p>user@example.com</p>
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
            columns={getOrderColumns(stage, handleRatingClick)}
            data={orders}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh Giá Sản Phẩm</DialogTitle>
            <DialogDescription>
              Để lại đánh giá của bạn về sản phẩm này.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div>
              <div className="flex items-center">
                <Image
                  src={selectedOrder.products[0].imgSrc}
                  alt={selectedOrder.products[0].productId}
                  width={100}
                  height={100}
                />
                <div className="ml-4">
                  <h3>{selectedOrder.products[0].productId}</h3>
                  <p>Chất lượng sản phẩm: {selectedOrder.rating || "N/A"}</p>
                </div>
              </div>
              <div className="mt-4">
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 cursor-pointer ${
                            rating >= i + 1
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          onClick={() => setRating(i + 1)}
                        />
                      ))}
                      <span className="ml-2 text-yellow-500">
                        {ratingLabels[rating - 1]}
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
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="flex items-center px-4 py-2 "
                      >
                        <CameraIcon className="icon-camera mr-2"></CameraIcon>{" "}
                        Thêm Hình ảnh
                      </Button>
                      <Button
                        type="button"
                        className="flex items-center px-4 py-2 "
                      >
                        <VideoIcon className="icon-video mr-2"></VideoIcon> Thêm
                        Video
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage;
