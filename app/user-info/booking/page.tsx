"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getJwt } from "@/util/auth.util";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import { DataTable } from "./data-table";
import { columns } from "./columns"; // Import the columns array
import type { Booking } from "./columns";

// Function to fetch data
async function getData(): Promise<Booking[]> {
  try {
    const res = await fetch(
      "https://6577fda6197926adf62f397c.mockapi.io/product"
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
}

export default function Booking() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<{
    username: string;
    phone: string;
    address: string;
    name: string;
    gender: string;
    age: number;
    email: string;
    avatar: string;
  }>({
    username: "",
    phone: "",
    address: "",
    name: "",
    gender: "",
    age: 0,
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const accessToken = getJwt("AT");
    const fetchUserData = async () => {
      try {
        if (accessToken) {
          const response = await AXIOS.GET({
            uri: authEndpoint.getProfile,
          });

          const { username, phone, address, name, gender, age, email, avatar } =
            response.data;

          setUserData({
            username,
            phone,
            address,
            name,
            gender,
            age,
            email,
            avatar,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    getData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-6">
      <div className="mt-6 flex justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={userData.avatar || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>{userData.name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-6 flex justify-center text-align-center">
        <p>{userData.name}</p>
      </div>
      <div className="flex justify-center text-align-center font-thin">
        <p>{userData.email}</p>
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
            data-te-ripple-init
            data-te-ripple-color="light"
            href="/user-info/booking"
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
          <DataTable columns={columns} data={data} userData={userData} />
        </div>
      </div>
    </div>
  );
}
