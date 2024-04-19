"use client";
import React, { useState } from "react";
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

const UserInfo = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Huy Ha",
    email: "huyha@example.com",
    phoneNumber: "1234567890",
    address: "123 Street, City",
    dob: "01/01/1990",
  });
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  // Hàm xử lý sự kiện khi nhấn vào nút "save"
  const handleSaveProfile = () => {
    // Gửi dữ liệu đã chỉnh sửa lên máy chủ ở đây

    // Sau khi gửi thành công, cập nhật trạng thái chỉnh sửa
    setIsEditing(false);
  };
  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };
  const handleSavePassword = () => {
    // Gửi yêu cầu thay đổi mật khẩu lên máy chủ ở đây

    // Sau khi gửi thành công, cập nhật trạng thái chỉnh sửa
    setIsChangingPassword(false);
  };
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
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h1>Profile</h1>
                <p className="text-xs">
                  basic info for faster booking experience
                </p>
              </div>
              {/* Hiển thị nút "edit profile" nếu không đang chỉnh sửa */}
              {!isEditing && (
                <Button variant="link" onClick={handleEditProfile}>
                  edit profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-x-0 py-2">
              <div>Name</div>
              {/* Hiển thị input field nếu đang chỉnh sửa, ngược lại hiển thị dữ liệu */}
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              ) : (
                <div>{userData.name}</div>
              )}
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-x-0 py-2">
              <div>Email</div>
              {/* Hiển thị input field nếu đang chỉnh sửa, ngược lại hiển thị dữ liệu */}
              {isEditing ? (
                <input
                  type="text"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              ) : (
                <div>{userData.email}</div>
              )}
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-x-0 py-2">
              <div>PhoneNumber</div>
              {/* Hiển thị input field nếu đang chỉnh sửa, ngược lại hiển thị dữ liệu */}
              {isEditing ? (
                <input
                  type="text"
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                />
              ) : (
                <div>{userData.phoneNumber}</div>
              )}
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-x-0 py-2">
              <div>Address</div>
              {/* Hiển thị input field nếu đang chỉnh sửa, ngược lại hiển thị dữ liệu */}
              {isEditing ? (
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                />
              ) : (
                <div>{userData.address}</div>
              )}
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-x-0 py-2">
              <div>Dob</div>
              {/* Hiển thị input field nếu đang chỉnh sửa, ngược lại hiển thị dữ liệu */}
              {isEditing ? (
                <input
                  type="text"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                />
              ) : (
                <div>{userData.dob}</div>
              )}
            </div>
            <div className="flex justify-center">
              {isEditing && (
                <Button variant="destructive" onClick={handleSaveProfile}>
                  Save
                </Button>
              )}
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
            <div className="grid grid-cols-3 py-2">
              <div>Email ID</div>
              <div>Huy Ha</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2 items-center">
              <div>Password</div>
              {/* Hiển thị input field nếu đang thay đổi mật khẩu, ngược lại hiển thị dữ liệu */}
              {isChangingPassword ? (
                <input type="password" /> // Input field cho mật khẩu mới
              ) : (
                <div>Huy Ha</div> // Hiển thị mật khẩu cũ
              )}

              {/* Hiển thị nút "change password" nếu không đang thay đổi mật khẩu */}
              {!isChangingPassword && (
                <Button variant="link" onClick={handleChangePassword}>
                  change password
                </Button>
              )}

              {/* Hiển thị nút "save password" nếu đang thay đổi mật khẩu */}
              <div className="flex justify-center">
                {isChangingPassword && (
                  <Button variant="destructive" onClick={handleSavePassword}>
                    Save
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInfo;
