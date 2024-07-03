"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AXIOS } from "@/constants/network/axios";
import { reviewEndpoint } from "@/constants/api/review.api";
import { authEndpoint } from "@/constants/api/auth.api";
import { Star, Edit3, Trash2, Cross, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  user: string;
  userId: string;
  review: string;
  rating: number;
}

interface CommentFormProps {
  productId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editReview, setEditReview] = useState<string>("");
  const [editRating, setEditRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfileAndComments = useCallback(async () => {
    try {
      // Fetch comments
      const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN;
      const commentsResponse = await AXIOS.GET({
        uri: reviewEndpoint.ecommerceReviewFind(domain ?? "", productId),
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

      // Fetch user profile
      try {
        const profileResponse = await AXIOS.GET({
          uri: authEndpoint.getProfile,
        });
        const userEmail = profileResponse.data.email;
        const userId = profileResponse.data.id;
        setUserEmail(userEmail);
        setUserId(userId);
        console.log("Fetched user profile:", userEmail, userId);
      } catch (profileError) {
        console.log("User not logged in:", profileError);
        setUserEmail(null);
        // setUserId(null);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProfileAndComments();
  }, [fetchProfileAndComments]);

  const handleDelete = async (commentId: string) => {
    try {
      await AXIOS.DELETE({
        uri: reviewEndpoint.ecommerceReviewDelete(commentId),
      });
      setComments(comments.filter((c) => c.id !== commentId));
      fetchProfileAndComments(); // Refetch comments after deletion
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
      fetchProfileAndComments(); // Refetch comments after editing
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
        userId: "something",
      };
      handleEdit(editedComment);
    }
  };

  const ratingLabels = ["Quá tệ", "Tệ", "Bình thường", "Hài lòng", "Tuyệt vời"];

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h3>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-md">
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[100%] h-[15px] mt-2 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-md">
                  {editMode === comment.id ? (
                    <div>
                      <Textarea
                        value={editReview}
                        onChange={(e) => setEditReview(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                      <div className="flex items-center mb-4 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 cursor-pointer ${
                              editRating >= i + 1
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                            onClick={() => setEditRating(i + 1)}
                          />
                        ))}
                        <span className="ml-2 text-yellow-500">
                          {ratingLabels[editRating - 1]}
                        </span>
                      </div>
                      <div className="p-2">
                        <Button
                          onClick={handleSaveEdit}
                          className=" px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          <Check />
                        </Button>
                        <Button
                          onClick={() => setEditMode(null)}
                          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          <X />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{comment.user}</p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  comment.rating >= i + 1
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-gray-600">
                              {comment.rating}/5
                            </span>
                          </div>
                        </div>
                        {userEmail === comment.user && (
                          <div className="flex gap-2">
                            <Edit3
                              className="w-5 h-5 text-green-500 cursor-pointer"
                              onClick={() => {
                                setEditMode(comment.id);
                                setEditReview(comment.review);
                                setEditRating(comment.rating);
                              }}
                            />
                            <Trash2
                              className="w-5 h-5 cursor-pointer text-red-500"
                              onClick={() => handleDelete(comment.id)}
                            />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 font-light">{comment.review}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentForm;
