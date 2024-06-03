"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

// Define the type for your order data
export type Order = {
  orderId: string;
  products: { productId: string; quantity: number; imgSrc: string }[];
  totalPrice: number;
  address: string;
  orderTime: string;
  stage: string;
};

// Define the columns for the data table
export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as {
        productId: string;
        quantity: number;
        imgSrc: string;
      }[];
      return (
        <div className="flex space-x-2">
          {products.map((product) => (
            <div key={product.productId} className="flex flex-col items-center">
              <Image
                src={product.imgSrc}
                alt={product.productId}
                width={50}
                height={50}
              />
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
