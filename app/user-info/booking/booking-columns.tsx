import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Define and export the type for your service data
export interface Service {
  id: string;
  imgSrc: string;
  name: string;
}

// Define the type for your booking data
export type Booking = {
  id: string;
  service: Service;
  totalPrice: number;
  address: string;
  date: string;
  status: string;
  rating?: number; // Optional rating field
};

// Define a function to get the columns based on the status
export const getBookingColumns = (
  status: string,
  handleRatingClick: (service: Service) => void
): ColumnDef<Booking>[] => {
  const baseColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "service",
      header: "Service Image",
      cell: ({ row }) => {
        const service = row.original.service;
        return (
          <div className="flex space-x-2">
            <div className="flex flex-col items-center">
              {service.imgSrc ? (
                <Image
                  src={service.imgSrc}
                  alt={service.name}
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "service.name",
      header: "Service Name",
      cell: ({ row }) => <div>{row.original.service.name}</div>,
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },

    {
      accessorKey: "date",
      header: "Booking Time",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        const formatted = date.toLocaleDateString("vi-VN");
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  if (status === "SUCCESS") {
    baseColumns.push({
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <Button onClick={() => handleRatingClick(row.original.service)}>
          Rate
        </Button>
      ),
    });
  }

  return baseColumns;
};
