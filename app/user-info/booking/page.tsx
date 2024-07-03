"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { BookingDataTable } from "./booking-data-table";
import { getBookingColumns, Booking, Service } from "./booking-columns";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { Loader } from "@/components/loader/loading";
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
import { authEndpoint } from "@/constants/api/auth.api";
import { Star, StarHalf } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfileStore } from "@/hooks/store/profile.store";

interface Comment {
  id: string;
  user: string;
  userId: string;
  review: string;
  rating: number;
}

interface ServiceDetails extends Service {
  id: string;
  images?: string[];
  rating?: number;
}

interface ReviewState {
  [serviceId: string]: string;
}

interface RatingState {
  [serviceId: string]: number;
}

interface CommentsState {
  [serviceId: string]: Comment[];
}

interface HasUserCommentedState {
  [serviceId: string]: boolean;
}

async function fetchServiceDetails(
  serviceId: string
): Promise<ServiceDetails | null> {
  const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN; // Replace with your valid domain
  try {
    const res = await AXIOS.GET({
      uri: bookingEndpoints.findById(domain ?? "", serviceId),
    });
    const serviceDetails = res.data;
    const imgSrc = serviceDetails.images?.[0] || "";
    const name = serviceDetails.name || "Unknown Service";
    return { id: serviceId, imgSrc, name, images: serviceDetails.images };
  } catch (error) {
    console.error("Failed to fetch service details:", error);
    return null;
  }
}

async function fetchBookings(
  status: string,
  page: number,
  limit: number
): Promise<{ bookings: Booking[]; total: number }> {
  try {
    const res = await AXIOS.GET({
      uri: bookingEndpoints.findBookings(status),
    });

    const bookings = res.data.bookings;

    if (!bookings || !Array.isArray(bookings)) {
      console.error("Unexpected bookings format:", bookings);
      return { bookings: [], total: 0 };
    }

    const fetchServicePromises = bookings.map(async (booking: Booking) => {
      const service = booking.service;
      const serviceDetails = await fetchServiceDetails(service.id);
      if (serviceDetails) {
        service.imgSrc = serviceDetails.imgSrc;
        service.name = serviceDetails.name;
      }
      return booking;
    });

    const fetchedBookings = await Promise.all(fetchServicePromises);
    return {
      bookings: fetchedBookings,
      total: res.data.total || bookings.length,
    };
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return { bookings: [], total: 0 };
  }
}

const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [selectedServices, setSelectedServices] = useState<
    ServiceDetails[] | null
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
  const profileStore = useProfileStore();

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

  const fetchProfileAndComments = useCallback(async (serviceId: string) => {
    try {
      const profileResponse = await AXIOS.GET({
        uri: authEndpoint.getProfile,
      });
      const userEmail = profileResponse.data.email;
      const userId = profileResponse.data.id;
      setUserEmail(userEmail);
      setUserId(userId);
      console.log("Fetched user profile:", userEmail, userId);

      const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN;
      const commentsResponse = await AXIOS.GET({
        uri: bookingEndpoints.findBookingReview(domain ?? "", serviceId),
      });
      if (
        commentsResponse.data &&
        Array.isArray(commentsResponse.data.reviews)
      ) {
        setComments((prevComments) => ({
          ...prevComments,
          [serviceId]: commentsResponse.data.reviews,
        }));
        console.log("Fetched comments:", commentsResponse.data.reviews);
        const userComment = commentsResponse.data.reviews.find(
          (comment: Comment) => comment.userId === userId
        );
        setHasUserCommented((prev) => ({
          ...prev,
          [serviceId]: !!userComment,
        }));
      } else {
        console.error("Unexpected response format:", commentsResponse.data);
        setComments((prevComments) => ({
          ...prevComments,
          [serviceId]: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  const fetchAndSetBookings = useCallback(
    async (status: string, page: number, limit: number) => {
      setLoading(true);
      const { bookings, total } = await fetchBookings(status, page, limit);
      setBookings(bookings as Booking[]);
      setTotalBookings(total);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchAndSetBookings(status, page, limit);
  }, [fetchAndSetBookings, status, page]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when status changes
    await fetchAndSetBookings(newStatus, 1, limit);
  };

  const handlePreviousPage = async () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      await fetchAndSetBookings(status, newPage, limit);
    }
  };

  const handleNextPage = async () => {
    if (page * limit < totalBookings) {
      const newPage = page + 1;
      setPage(newPage);
      await fetchAndSetBookings(status, newPage, limit);
    }
  };

  const handleRatingClick = async (service: Service) => {
    setSelectedServices([service]);
    await fetchProfileAndComments(service.id);
  };

  const handleSubmit = async (
    serviceId: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (hasUserCommented[serviceId]) {
      alert("You can only comment once on this service.");
      return;
    }
    const newComment = {
      review: review[serviceId],
      rating: rating[serviceId],
      serviceId: serviceId,
      userId: userId,
    };
    try {
      const response = await AXIOS.POST({
        uri: bookingEndpoints.createBookingReview,
        params: newComment,
      });
      if (response.statusCode >= 200 && response.statusCode < 300) {
        const createdComment = {
          ...response.data.review,
          user: userEmail,
        };
        setComments((prevComments) => ({
          ...prevComments,
          [serviceId]: [...prevComments[serviceId], createdComment],
        }));
        setHasUserCommented((prev) => ({
          ...prev,
          [serviceId]: true,
        }));
        setSuccessMessage("Review submitted successfully!");
      } else {
        console.error("Unexpected response format:", response.data);
      }
      setReview((prev) => ({
        ...prev,
        [serviceId]: "",
      }));
      setRating((prev) => ({
        ...prev,
        [serviceId]: 0,
      }));
    } catch (error) {
      console.error("Error creating comment", error);
    }
  };

  return (
    <div className="py-6 h-full flex-grow">
      <div className="mt-6 flex justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-6 flex justify-center text-align-center">
        <p>Booking Page</p>
      </div>
      <div className="flex justify-center text-align-center font-thin">
        <p>{userEmail}</p>
      </div>
      <div className="mt-8 ml-12 pl-4 overflow-x-hidden relative space-x-6">
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
              "border-b-[3px] border-blue-300"
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
              ""
            )}
          >
            Order
          </Link>
        </div>
      </div>
      <div className="py-6">
        <div className="container mx-auto py-10">
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              style={{
                backgroundColor:
                  status === "PENDING" ? profileStore.buttonColor : "",
                color: status === "PENDING" ? profileStore.buttonTextColor : "",
              }}
              variant="ghost"
              onClick={() => handleStatusChange("PENDING")}
              className={status === "PENDING" ? "bg-blue-500 text-white" : ""}
            >
              Pending
            </Button>
            <Button
              style={{
                backgroundColor:
                  status === "SUCCESS" ? profileStore.buttonColor : "",
                color: status === "SUCCESS" ? profileStore.headerTextColor : "",
              }}
              variant="ghost"
              onClick={() => handleStatusChange("SUCCESS")}
              className={status === "SUCCESS" ? "bg-blue-500 text-white" : ""}
            >
              Success
            </Button>

            <Button
              style={{
                backgroundColor:
                  status === "CANCEL" ? profileStore.buttonColor : "",
                color: status === "CANCEL" ? profileStore.headerTextColor : "",
              }}
              variant="ghost"
              onClick={() => handleStatusChange("CANCEL")}
              className={status === "CANCEL" ? "bg-blue-500 text-white" : ""}
            >
              Cancelled
            </Button>
          </div>
          {loading ? (
            <div className="h-full flex-grow justify-center">
              <Loader />
            </div>
          ) : bookings.length > 0 ? (
            <BookingDataTable
              columns={getBookingColumns(status, (service) =>
                handleRatingClick(service)
              )}
              data={bookings}
            />
          ) : (
            <p className=" h-full flex-growtext-center text-gray-500">
              No bookings found.
            </p>
          )}
        </div>
      </div>

      <Dialog
        open={!!selectedServices}
        onOpenChange={() => setSelectedServices(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh Giá Dịch Vụ</DialogTitle>
            <DialogDescription>
              Để lại đánh giá của bạn về dịch vụ này.
            </DialogDescription>
          </DialogHeader>
          {selectedServices && selectedServices.length > 0 && (
            <div className="overflow-y-auto max-h-96">
              {selectedServices.map((service) => (
                <div key={service.id} className="mb-6">
                  <div className="flex items-center">
                    <Image
                      src={service.imgSrc}
                      alt={service.name}
                      width={100}
                      height={100}
                    />
                    <div className="ml-4">
                      <h3>{service.name}</h3>
                      <p>Chất lượng dịch vụ: {service.rating || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {hasUserCommented[service.id] ? (
                      <div className="text-green-500">
                        Bạn đã đánh giá dịch vụ này. Cảm ơn bạn!
                      </div>
                    ) : (
                      <Form {...form}>
                        <form
                          onSubmit={(e) => handleSubmit(service.id, e)}
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
                                      [service.id]: i + 0.5,
                                    }));
                                  } else {
                                    setRating((prev) => ({
                                      ...prev,
                                      [service.id]: i + 1,
                                    }));
                                  }
                                }}
                              >
                                <Star
                                  className={`w-8 h-8 cursor-pointer ${
                                    rating[service.id] >= i + 1
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                                {rating[service.id] < i + 1 && (
                                  <StarHalf
                                    className={`absolute left-0 w-8 h-8 cursor-pointer ${
                                      rating[service.id] >= i + 0.5
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                            <span className="ml-2 text-yellow-500 text-xl">
                              {ratingLabels[Math.ceil(rating[service.id]) - 1]}
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
                              value={review[service.id] || ""}
                              onChange={(e) =>
                                setReview((prev) => ({
                                  ...prev,
                                  [service.id]: e.target.value,
                                }))
                              }
                              placeholder="Hãy chia sẻ những điều bạn thích về dịch vụ này với những người khác nhé."
                              required
                              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                          </div>

                          <Button
                            style={{
                              backgroundColor: profileStore.buttonColor,
                              color: profileStore.buttonTextColor,
                            }}
                            type="submit"
                            className="px-4 py-2   rounded-md "
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

export default BookingPage;
