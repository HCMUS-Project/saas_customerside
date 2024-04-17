import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const userInfo = () => {
  return (
    <div className="py-6">
      <div className="mt-6 flex justify-center  ">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-6 flex justify-center text-align-center">
        <p>Lorem isum</p>
      </div>
      <div className="flex justify-center text-align-center font-thin">
        <p>Lorem isum@gmail.com</p>
      </div>
      <div className="mt-8 overflow-x-hidden relative space-x-6">
        <div className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]">
          <Link
            href="/user-info"
            data-te-ripple-init
            data-te-ripple-color="light"
            className={cn(
              "inline-block rounded-md px-6 pb-3 pt-3.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700",
              "border-b-[3px] border-blue-300"
            )}
          >
            Account
          </Link>

          <Link
            data-te-ripple-init
            data-te-ripple-color="light"
            href="user-info/booking"
            className={cn(
              "inline-block rounded-md px-6 pb-3 pt-3.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700",
              ""
            )}
          >
            Booking
          </Link>

          <Link
            href="#"
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
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h1>Profile</h1>
                <p className="text-xs">
                  basic info for faster booking experience
                </p>
              </div>
              <Button variant="link">edit profile</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-x-0 py-2">
              <div>Name</div>
              <div>Huy Ha</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2">
              <div>Email</div>
              <div>Huy Ha</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2">
              <div>Phone Number</div>
              <div> Huy Ha</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2">
              <div>Address</div>
              <div> Huy Ha</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2">
              <div>Date of birth</div>
              <div> Huy Ha</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <h1>Login Details</h1>
            <p className="text-xs">manage your email and password address</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 py-2">
              <div>Mobile Number</div>
              <div>Huy Ha </div>
            </div>

            <hr />
            <div className="grid grid-cols-3 py-2  justify-between items-center">
              <div>Email ID</div>
              <div> Huy Ha</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2  ">
              <div>Password</div>
              <div> Huy Ha</div>

              <Button className="justify-end" variant="link">
                change password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default userInfo;
