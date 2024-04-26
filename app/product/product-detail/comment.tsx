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
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

const CommentForm = () => {
  const [comment, setComment] = useState("");
  const formSchema = z.object({
    comment: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Xử lý dữ liệu comment ở đây
    console.log({ comment });
    // Đặt các giá trị trạng thái về mặc định sau khi gửi comment

    setComment("");
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="mt-2 max-w-md ">
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
  );
};

export default CommentForm;
