"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

interface mockComments {
  id: string;
  username: string;
  payload: string;
  reply_of?: string;
  replies?: mockComments[];
}
const mockComments: mockComments[] = [
  { id: "1", username: "User1", payload: "Payload1", replies: [] },
  { id: "2", username: "User2", payload: "Payload2", replies: [] },
  { id: "3", username: "User3", payload: "Payload3", replies: [] },
];

const CommentForm = () => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<mockComments[]>(mockComments);
  const [replyOf, setReplyOf] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);

  const formSchema = z.object({
    comment: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  // Hàm xử lý xóa comment
  const handleDelete = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
  };

  // Hàm xử lý chỉnh sửa comment
  const handleEdit = (editedComment: mockComments) => {
    const updatedComments = comments.map((c) =>
      c.id === editedComment.id ? editedComment : c
    );
    setComments(updatedComments);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (replyOf) {
      // Xử lý gửi reply
      const replyComment = {
        id: "1", // Tạo ID mới cho phản hồi
        username: "User", // Đổi thành tên người dùng thực tế hoặc lấy từ state/form
        payload: comment, // Sử dụng nội dung comment nhập từ form
        reply_of: replyOf, // Đặt reply_of bằng id của comment mà bạn đang trả lời
      };
      // Tìm comment mà bạn đang trả lời
      const parentComment = comments.find((c) => c.id === replyOf);
      if (parentComment) {
        // Nếu tìm thấy comment mà bạn đang trả lời, thêm phản hồi vào mảng replies của nó
        parentComment.replies = parentComment.replies || []; // Đảm bảo rằng replies là một mảng
        parentComment.replies.push(replyComment);
        setComments([...comments]); // Cập nhật state comments để kích hoạt lại rendering
      }
      setComment(""); // Đặt lại giá trị comment thành rỗng
      setReplyOf(null); // Đặt replyOf thành null để thoát khỏi chế độ trả lời
    } else {
      // Xử lý gửi comment mới
      const newComment = {
        id: "1", // Tạo ID mới cho comment mới
        username: "User", // Đổi thành tên người dùng thực tế hoặc lấy từ state/form
        payload: comment, // Sử dụng nội dung comment nhập từ form
      };
      setComments([...comments, newComment]); // Thêm comment mới vào mảng comments
      setComment(""); // Đặt lại giá trị comment thành rỗng
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleReply = (id: string) => {
    setReplyOf(id);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="mt-2 w-full ">
          <div className="relative mb-4">
            <label htmlFor="comment" className="block mb-2">
              Review:
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none"
            />{" "}
            <Button
              type="submit"
              className="absolute mt-3 top-1/2 right-2 transform -translate-y-1/2 px-4 py-2  "
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex flex-col gap-4 pt-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-md p-4">
            <p className="font-semibold mb-2">{comment.username}</p>
            {editMode === comment.id ? (
              <div className="flex items-center gap-2 justify-between">
                <input
                  className="pb-1 border-b w-full"
                  type="text"
                  value={comment.payload}
                  onChange={(e) =>
                    handleEdit({ ...comment, payload: e.target.value })
                  }
                />
                <Button
                  variant="ghost"
                  className="flex items-right"
                  onClick={() => setEditMode(null)}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center  justify-between">
                <p className="font-light">{comment.payload}</p>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    className="  text-green-500"
                    onClick={() => setEditMode(comment.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className=" text-gray-500"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setReplyOf(comment.id)}
                    className="text-orange-500"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentForm;
