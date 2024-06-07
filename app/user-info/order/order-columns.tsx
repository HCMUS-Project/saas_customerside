"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Define the type for your order data
export type Order = {
  orderId: string;
  products: { productId: string; quantity: number; imgSrc: string }[];
  totalPrice: number;
  address: string;
  orderTime: string;
  stage: string;
  rating?: number; // Optional rating field
};

// Define a function to get the columns based on the stage
export const getOrderColumns = (
  stage: string,
  handleRatingClick: (order: Order) => void
): ColumnDef<Order>[] => {
  const baseColumns: ColumnDef<Order>[] = [
    {
      accessorKey: "productImages",
      header: "Product Images",
      cell: ({ row }) => {
        const products = row.original.products as {
          productId: string;
          imgSrc: string;
        }[];
        return (
          <div className="flex space-x-2">
            {products.map((product) => (
              <div
                key={product.productId}
                className="flex flex-col items-center"
              >
                {product.imgSrc ? (
                  <Image
                    src={product.imgSrc}
                    alt={product.productId}
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "productQuantities",
      header: "Product Quantities",
      cell: ({ row }) => {
        const products = row.original.products as {
          productId: string;
          quantity: number;
        }[];
        return (
          <div className="flex space-x-2">
            {products.map((product) => (
              <div
                key={product.productId}
                className="flex flex-col items-center"
              >
                <div>Quantity: {product.quantity}</div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "orderTime",
      header: "Order Time",
      cell: ({ row }) => {
        const date = new Date(row.getValue("orderTime"));
        const formatted = date.toLocaleDateString();
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "stage",
      header: "Stage",
    },
  ];

  if (stage === "completed") {
    baseColumns.push({
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <Button onClick={() => handleRatingClick(row.original)}>Rate</Button>
      ),
    });
  }

  return baseColumns;
};
