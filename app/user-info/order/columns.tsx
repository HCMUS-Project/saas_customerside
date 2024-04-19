"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
  imgSrc: string;
  product: string;
  price: string;
  quantity: string;
  subtotal: string;
  date: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "imgSrc",
    header: "",

    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("imgSrc")}
          alt="product image"
          width={50}
          height={50}
          className="mx-5"
        />
      );
    },
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
];
