"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";

import { OrderDataTable } from "./order-data-table";
import { orderColumns, Order } from "./order-columns";
import { ecommerceEndpoints } from "@/constants/api/ecommerce";
import { productEndpoints } from "@/constants/api/product.api";

async function fetchProductDetails(productId: string) {
  const domain = "30shine.com"; // Replace with your valid domain
  try {
    const res = await AXIOS.GET({
      uri: productEndpoints.findById(domain, productId),
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return null;
  }
}

// Function to fetch orders based on stage
async function fetchOrders(stage: string): Promise<Order[]> {
  try {
    const res = await AXIOS.GET({
      uri: ecommerceEndpoints.searchOrder(stage),
    });
    const orders = res.data.orders;

    // Fetch product details for each product in each order
    for (const order of orders) {
      for (const product of order.products) {
        const productDetails = await fetchProductDetails(product.productId);
        if (productDetails && productDetails.imgSrc) {
          product.imgSrc = productDetails.imgSrc; // Ensure productDetails contains imgSrc
        } else {
          product.imgSrc = ""; // Fallback in case imgSrc is not available
        }
      }
    }
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState("pending");

  useEffect(() => {
    fetchOrders(stage).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [stage]);

  const handleStageChange = (newStage: string) => {
    setLoading(true);
    setStage(newStage);
  };

  if (loading) {
    return <div>Loading...</div>;
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
          <OrderDataTable columns={orderColumns} data={orders} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
