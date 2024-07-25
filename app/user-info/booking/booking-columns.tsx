import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";

interface CancelBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [note, setNote] = useState("");
  const lang = useLanguage();
  const handleConfirm = () => {
    onConfirm(note);
    setNote(""); // Clear the note after confirmation
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lang.curLangPack.profile?.["cancelBooking"]}
          </DialogTitle>
          <DialogDescription>
            {lang.curLangPack.profile?.["note"]}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={lang.curLangPack.profile?.["noteDes"]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            {lang.curLangPack.profile?.["cancel"]}
          </Button>
          <Button onClick={handleConfirm} className="bg-red-500 text-white">
            {lang.curLangPack.profile?.["confirm"]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingDialog;

// Define and export the type for your service data
export interface Service {
  id: string;
  images: string[];
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

// Function to handle booking cancellation
export const handleCancelBooking = async (
  bookingId: string,
  note: string,
  refreshBookings: () => void
) => {
  try {
    const response = await AXIOS.DELETE({
      uri: "api/booking/bookings/delete",
      body: {
        id: bookingId,
        note: note,
      },
    });

    if (response.data.result === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Booking canceled successfully!",
      });
      // Refresh the booking list here
      refreshBookings();
    }
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while canceling the booking.",
    });
  }
};

const lang = useLanguage.getState();

// Define a function to get the columns based on the status
export const getBookingColumns = (
  status: string,
  handleRatingClick: (service: Service) => void,
  handleCancelBooking: (
    bookingId: string,
    note: string,
    refreshBookings: () => void
  ) => void,
  refreshBookings: () => void
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
              {service.images && service.images.length > 0 ? (
                <Image
                  src={service.images[0]}
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
      header: `${lang.curLangPack.profile?.["serName"]}`,
      cell: ({ row }) => <div>{row.original.service.name}</div>,
    },
    {
      accessorKey: "totalPrice",
      header: `${lang.curLangPack.profile?.["total"]}`,
    },
    {
      accessorKey: "date",
      header: `${lang.curLangPack.profile?.["bookTime"]}`,
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        const formatted = date.toLocaleDateString("vi-VN");
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: `${lang.curLangPack.profile?.["status"]}`,
    },
  ];

  if (status === "SUCCESS") {
    baseColumns.push({
      accessorKey: "rating",
      header: `${lang.curLangPack.profile?.["rating"]}`,
      cell: ({ row }) => (
        <Button
          className="bg-yellow-400"
          onClick={() => handleRatingClick(row.original.service)}
        >
          {lang.curLangPack.profile?.["rate"]}
        </Button>
      ),
    });
  } else if (status === "PENDING") {
    baseColumns.push({
      accessorKey: "cancel",
      header: "Cancel Booking",
      cell: ({ row }) => (
        <CancelBookingCell
          bookingId={row.original.id}
          handleCancelBooking={handleCancelBooking}
          refreshBookings={refreshBookings}
        />
      ),
    });
  }

  return baseColumns;
};

interface CancelBookingCellProps {
  bookingId: string;
  handleCancelBooking: (
    bookingId: string,
    note: string,
    refreshBookings: () => void
  ) => void;
  refreshBookings: () => void;
}

const CancelBookingCell: React.FC<CancelBookingCellProps> = ({
  bookingId,
  handleCancelBooking,
  refreshBookings,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const lang = useLanguage();

  const handleDialogConfirm = (note: string) => {
    handleCancelBooking(bookingId, note, refreshBookings);
    setDialogOpen(false);
  };

  return (
    <>
      <Button className="bg-red-500" onClick={() => setDialogOpen(true)}>
        {lang.curLangPack.profile?.["cancel"]}
      </Button>
      <CancelBookingDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
};
