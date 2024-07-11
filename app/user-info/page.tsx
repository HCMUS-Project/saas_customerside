"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AXIOS } from "@/constants/network/axios";
import { authEndpoint } from "@/constants/api/auth.api";
import { Input } from "@/components/ui/input";
import { getJwt } from "@/util/auth.util";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useProfileStore } from "@/hooks/store/profile.store";
import { useLanguage } from "@/hooks/use-language";

const UserInfo = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    address: "",
    name: "",
    gender: "",
    age: 0,
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const profileStore = useProfileStore();
  const lang = useLanguage();
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
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { email, ...updatedUserData } = userData;
      const response = await AXIOS.POST({
        uri: authEndpoint.updateProfile,
        params: { ...updatedUserData, age: parseInt(userData.age.toString()) },
      });

      if (response) {
        setIsEditing(false);
        Swal.fire("Success", "Profile updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Swal.fire("Error", "Failed to save profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!password || !newPassword) {
      setError("Both current password and new password fields are required.");
      Swal.fire(
        "Error",
        "Both current password and new password fields are required.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await AXIOS.POST({
        uri: authEndpoint.changePassword,
        params: { password, newPassword },
      });

      if (response) {
        setIsChangingPassword(false);
        Swal.fire("Success", "Password changed successfully!", "success");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire("Error", "Failed to change password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    value: string | number,
    fieldName: string
  ) => {
    return (
      <div className="grid grid-cols-3 gap-x-0 py-2">
        <div className="font-medium">{label}</div>
        {isEditing ? (
          <Input
            type="text"
            value={value}
            onChange={(e) =>
              setUserData({ ...userData, [fieldName]: e.target.value })
            }
            className="col-span-2"
          />
        ) : (
          <div className="col-span-2">{value}</div>
        )}
      </div>
    );
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="mt-6 flex justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={userData.avatar || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>{userData.name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-6 flex justify-center text-align-center">
        <p className="text-xl font-semibold">{userData.name}</p>
      </div>
      <div className="flex justify-center text-align-center text-sm font-thin">
        <p>{userData.email}</p>
      </div>
      <div className="mt-8 overflow-x-hidden relative  flex justify-center">
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
            {lang.curLangPack.profile?.["account"]}
          </Link>

          <Link
            data-te-ripple-init
            data-te-ripple-color="light"
            href="/user-info/booking"
            className={cn(
              "inline-block rounded-md px-6 pb-3 pt-3.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700",
              ""
            )}
          >
            {lang.curLangPack.profile?.["booking"]}
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
            {lang.curLangPack.profile?.["order"]}
          </Link>
        </div>
      </div>
      <div className="py-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold">
                  {lang.curLangPack.profile?.["profile"]}
                </h1>
                <p className="text-sm text-gray-500">
                  {lang.curLangPack.profile?.["your"]}
                </p>
              </div>
              {!isEditing && (
                <Button variant="link" onClick={handleEditProfile}>
                  {lang.curLangPack.profile?.["edit"]}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {renderField(
              `${lang.curLangPack.profile?.["name"]}`,
              userData.name,
              "name"
            )}
            <hr />
            {/* {renderField(
              `${lang.curLangPack.profile?.["username"]}`,
              userData.username,
              "username"
            )}
            <hr /> */}
            {renderField(
              `${lang.curLangPack.profile?.["phone"]}`,
              userData.phone,
              "phone"
            )}
            <hr />
            {renderField(
              `${lang.curLangPack.profile?.["address"]}`,
              userData.address,
              "address"
            )}
            <hr />

            {renderField(
              `${lang.curLangPack.profile?.["gender"]}`,
              userData.gender,
              "gender"
            )}
            <hr />
            {renderField(
              `${lang.curLangPack.profile?.["age"]}`,
              userData.age,
              "age"
            )}
            <hr />
            <div className="pt-2 flex justify-center">
              {isEditing && (
                <Button variant="destructive" onClick={handleSaveProfile}>
                  {loading
                    ? `${lang.curLangPack.profile?.["saving"]}`
                    : `${lang.curLangPack.profile?.["save"]}`}
                </Button>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <h1 className="text-xl font-semibold">
              {lang.curLangPack.profile?.["login"]}
            </h1>
            <p className="text-sm text-gray-500">
              {lang.curLangPack.profile?.["manage"]}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 py-2">
              <div className="font-medium">
                {lang.curLangPack.profile?.["mobile"]}
              </div>
              <div className="col-span-2">{userData.phone}</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2">
              <div className="font-medium">
                {lang.curLangPack.profile?.["email"]}
              </div>
              <div className="col-span-2">{userData.email}</div>
            </div>
            <hr />
            <div className="grid grid-cols-3 py-2 items-center">
              <div className="font-medium">
                {lang.curLangPack.profile?.["password"]}
              </div>
              {isChangingPassword ? (
                <>
                  <div className="col-span-2 relative mt-2 w-full">
                    <div className=" flex pb-2">
                      {" "}
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={lang.curLangPack.profile?.["currentPass"]}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 "
                      />
                      <Button
                        variant="link"
                        className="  pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>

                    <div className="flex">
                      {" "}
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={lang.curLangPack.profile?.["newPass"]}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="link"
                        className=" pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    <div className="flex justify-start gap-2 mt-4">
                      {isChangingPassword && (
                        <>
                          <Button
                            variant="destructive"
                            onClick={handleSavePassword}
                          >
                            {loading
                              ? `${lang.curLangPack.profile?.["saving"]}`
                              : `${lang.curLangPack.profile?.["save"]}`}
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => setIsChangingPassword(false)}
                          >
                            {lang.curLangPack.profile?.["cancel"]}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 relative mt-2"></div>
                </>
              ) : (
                <div className="flex-1 pt-2 justify-start pr-10 ">********</div>
              )}
              <div className="">
                {" "}
                {!isChangingPassword && (
                  <Button
                    className="flex-1   "
                    variant="link"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    {lang.curLangPack.profile?.["change"]}
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
