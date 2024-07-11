"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Swal from "sweetalert2";
import { AXIOS } from "@/constants/network/axios";
import { voucherEnpoint } from "@/constants/api/voucher.api";
import { orderEndpoints } from "@/constants/api/order.api";
import { authEndpoint } from "@/constants/api/auth.api";
import { cartEndpoints } from "@/constants/api/cart.api";
import { productEndpoints } from "@/constants/api/product.api";
import { paymentEndpoints } from "@/constants/api/payment.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/hooks/store/profile.store";
import eventBus from "@/hooks/evenBus";
import { useLanguage } from "@/hooks/use-language";

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  isDefault?: boolean;
}

interface Product {
  productId: string;
  images: string;
  quantity: number;
  description: string;
  name: string;
  price: number;
}

interface PaymentMethod {
  id: string;
  type: string;
  label: string;
}

interface Voucher {
  id: string;
  voucherCode: string;
  voucherName: string;
  discountPercent: number;
  maxDiscount: number;
  minAppValue: number;
  expireAt: string;
}

export default function CheckoutPage() {
  const profileStore = useProfileStore();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherData, setVoucherData] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [appliedVouchers, setAppliedVouchers] = useState<string[]>([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    id: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    isDefault: false,
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = useLanguage();

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (
      params.get("message") === "success" &&
      params.get("status") === "success"
    ) {
      const newUrl = `${url.origin}${url.pathname}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    const storedCheckoutProducts = localStorage.getItem("checkoutProducts");
    if (storedCheckoutProducts) {
      setCartProducts(JSON.parse(storedCheckoutProducts));
    }

    const fetchProfile = async () => {
      try {
        const res = await AXIOS.GET({
          uri: authEndpoint.getProfile,
        });

        if (res.statusCode >= 200 && res.statusCode <= 300) {
          const profile = res.data;
          setSelectedAddress({
            id: "profile-address",
            fullName: profile.name || "",
            addressLine1: profile.address || "",
            addressLine2: "",
            city: "",
            postalCode: "",
            phoneNumber: `${profile.phone}`,
            isDefault: true,
          });
          setAddresses(profile.addresses || []);
        } else {
          Swal.fire(
            `${lang.curLangPack.noti?.["error"]}`,
            `${lang.curLangPack.noti?.["profileFetch"]}`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        Swal.fire(
          `${lang.curLangPack.noti?.["error"]}`,
          `${lang.curLangPack.noti?.["profileFetch"]}`,
          "error"
        );
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const res = await AXIOS.GET({
          uri: paymentEndpoints.PaymentMethod,
        });

        if (res.statusCode >= 200 && res.statusCode <= 300) {
          const methods = res.data.paymentMethods.map((method: any) => ({
            id: method.id,
            type: method.type,
            label: method.type.charAt(0).toUpperCase() + method.type.slice(1),
          }));
          setPaymentMethods(methods);
        } else {
          Swal.fire("Error", "Failed to fetch payment methods.", "error");
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        Swal.fire("Error", "Failed to fetch payment methods.", "error");
      }
    };

    Promise.all([fetchProfile(), fetchPaymentMethods()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const calculateTotalAmount = () => {
    const total = cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    return total;
  };

  const fetchVoucher = useCallback(
    async (code: string) => {
      // if (appliedVouchers.includes(code)) {
      //   Swal.fire("Error", "Voucher already applied.", "error");
      //   return;
      // }

      try {
        const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN;

        const res = await AXIOS.GET({
          uri: voucherEnpoint.findVoucher(domain ?? "", code),
        });

        const voucher = res.data.voucher;

        if (!voucher) {
          throw new Error("Voucher not found in the response");
        }

        const totalAmountNum = calculateTotalAmount();
        const minAppValueNum = Number(voucher.minAppValue);

        if (totalAmountNum < minAppValueNum) {
          Swal.fire(
            `${lang.curLangPack.noti?.["error"]}`,
            `${lang.curLangPack.noti?.["VoucherFail"]}`,
            "error"
          );
          return;
        }

        setVoucherData(voucher);
        setVoucherApplied(true);
        setAppliedVouchers([...appliedVouchers, code]);

        const discount = Math.min(
          parseFloat(voucher.maxDiscount),
          voucher.discountPercent * totalAmountNum
        );

        setDiscountAmount(discount);
        Swal.fire(
          `${lang.curLangPack.noti?.["success"]}`,
          `${lang.curLangPack.noti?.["voucherApplied"]}`,
          "success"
        );
      } catch (error) {
        console.error("Error fetching voucher data:", error);
      }
    },
    [appliedVouchers, cartProducts]
  );

  const handleApplyVoucher = () => {
    fetchVoucher(voucherCode);
  };

  const handleVoucherSelect = (code: string) => {
    setVoucherCode(code);
    fetchVoucher(code);
    closeVoucherDialog();
  };

  const handlePlaceOrder = async () => {
    try {
      const productIds = cartProducts.map((product) => product.productId);
      const quantities = cartProducts.map((product) => product.quantity);

      const phone = selectedAddress?.phoneNumber?.replace(/[^\d]/g, "") || "";
      const formattedPhone = phone.startsWith("84")
        ? `+${phone}`
        : `+84${phone}`;

      const orderData = {
        productsId: productIds,
        quantities: quantities,
        phone: formattedPhone,
        address: `${selectedAddress?.addressLine1}, ${selectedAddress?.addressLine2}, ${selectedAddress?.city}`,
        voucherId: voucherData ? voucherData.id : null,
        paymentMethod: selectedPaymentMethod,
        paymentCallbackUrl: `http://nvukhoi.id.vn/api/payment/url/return?domain=${
          process.env.NEXT_PUBLIC_ENVIRONMENT == "DEV"
            ? process.env.NEXT_PUBLIC_LOCAL_REDIRECT_URL
            : process.env.NEXT_PUBLIC_REDIRECT_URL
        }/payment/payment-success`,
      };

      const res = await AXIOS.POST({
        uri: orderEndpoints.createOrder,
        params: orderData,
      });

      if (res.statusCode >= 200 && res.statusCode <= 300) {
        const paymentUrl = res.data.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          Swal.fire(
            `${lang.curLangPack.noti?.["success"]}`,
            `${lang.curLangPack.noti?.["ordered"]}`,
            "success"
          ).then(async () => {
            await fetchCartData();
            eventBus.dispatch("cartUpdated", []); // Dispatch event to clear cart
            router.push("/product");
          });
        }
      } else {
        Swal.fire(
          `${lang.curLangPack.noti?.["error"]}`,
          `${lang.curLangPack.noti?.["orderFetch"]}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire(
        `${lang.curLangPack.noti?.["error"]}`,
        `${lang.curLangPack.noti?.["orderFetch"]}`,
        "error"
      );
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await AXIOS.GET({ uri: cartEndpoints.findall });
      if (response.data) {
        const result = await fetchDataCartFromID(
          response.data.carts[0].cartItems
        );
        if (result) setCartProducts(result);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const fetchDataCartFromID = async (cartItemsTemp: any) => {
    let temp: Array<Product> = [];
    try {
      for (const item of cartItemsTemp) {
        const res = await AXIOS.GET({
          uri: productEndpoints.findById(
            process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? "",
            item.productId
          ),
        });

        if (res.data) {
          const updatedItem = {
            ...item,
            images: res.data.images[0],
            price: res.data.price,
            name: res.data.name,
          };

          temp = [...temp, updatedItem];
        }
      }

      return temp;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const totalAmount = calculateTotalAmount();
  const shippingFee = 17000;
  const finalAmountWithoutSip = totalAmount - discountAmount;
  const finalAmount = totalAmount + shippingFee - discountAmount;

  const openAddressDialog = () => setIsAddressDialogOpen(true);
  const closeAddressDialog = () => setIsAddressDialogOpen(false);

  const openVoucherDialog = () => setIsVoucherDialogOpen(true);
  const closeVoucherDialog = () => setIsVoucherDialogOpen(false);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    closeAddressDialog();
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      let formattedValue = value.replace(/\D/g, "");
      if (formattedValue.startsWith("84")) {
        formattedValue = `+${formattedValue}`;
      } else if (!formattedValue.startsWith("+84")) {
        formattedValue = `+84${formattedValue}`;
      }
      setNewAddress({ ...newAddress, [name]: formattedValue });
    } else if (name === "isDefault") {
      setNewAddress({ ...newAddress, isDefault: e.target.checked });
    } else {
      setNewAddress({ ...newAddress, [name]: value });
    }
  };

  const handleNewAddressSubmit = () => {
    const newId = `address-${addresses.length + 1}`;
    const newAddressWithId = { ...newAddress, id: newId };
    setAddresses([...addresses, newAddressWithId]);
    setSelectedAddress(newAddressWithId);
    setNewAddress({
      id: "",
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      isDefault: false,
    });
    closeAddressDialog();
  };

  const fetchVouchers = async () => {
    try {
      const domain = process.env.NEXT_PUBLIC_TENANT_DOMAIN;
      const res = await AXIOS.GET({
        uri: voucherEnpoint.findAllVoucher(domain ?? ""),
      });

      if (res.statusCode >= 200 && res.statusCode <= 300) {
        setVouchers(res.data.vouchers || []);
      } else {
        Swal.fire(
          `${lang.curLangPack.noti?.["error"]}`,
          `${lang.curLangPack.noti?.["VoucherFail"]}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      Swal.fire(
        `${lang.curLangPack.noti?.["error"]}`,
        `${lang.curLangPack.noti?.["VoucherFail"]}`,
        "error"
      );
    }
  };

  useEffect(() => {
    if (isVoucherDialogOpen) {
      fetchVouchers();
    }
  }, [isVoucherDialogOpen]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">
        {lang.curLangPack.payment?.["checkOut"]}
      </h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg">
            <div className="border-b border-dashed border-gray-300 pb-2 mb-4">
              <h2 className="text-lg font-semibold">
                {lang.curLangPack.payment?.["shipping"]}
              </h2>
            </div>
            {selectedAddress && (
              <div className="mb-2 flex justify-between items-center">
                <div>
                  <strong>{selectedAddress.fullName}</strong>{" "}
                  {selectedAddress.phoneNumber}, {selectedAddress.addressLine1},{" "}
                  {selectedAddress.addressLine2}, {selectedAddress.city},{" "}
                  {selectedAddress.postalCode}
                  <div className="bg-white border border-red-500 text-red-500 px-2 py-1 rounded-md inline-block ml-2">
                    {lang.curLangPack.payment?.["default"]}
                  </div>
                </div>
                <Button
                  onClick={openAddressDialog}
                  className="bg-white border border-blue-500 text-blue-500 px-2 py-1 rounded-md"
                >
                  {lang.curLangPack.payment?.["change"]}
                </Button>
              </div>
            )}
          </div>

          <div className="mb-8 p-4 border rounded-lg">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
                <div className="col-span-6">
                  {lang.curLangPack.payment?.["product"]}
                </div>
                <div className="col-span-2 text-center">
                  {lang.curLangPack.payment?.["price"]}
                </div>
                <div className="col-span-2 text-center">
                  {lang.curLangPack.payment?.["quantity"]}
                </div>
                <div className="col-span-2 text-center">
                  {lang.curLangPack.payment?.["total"]}
                </div>
              </div>
              {cartProducts.map((product) => (
                <div
                  key={product.productId}
                  className="grid grid-cols-12 gap-4 items-center border-b pb-4"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="h-20 w-20 relative">
                      <Image
                        src={product.images}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-black font-semibold">
                      {product.price.toLocaleString("Vi-VN")} VND
                    </p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-black font-semibold">
                      {product.quantity}
                    </p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-black font-semibold">
                      {(product.price * product.quantity).toLocaleString(
                        "Vi-VN"
                      )}{" "}
                      VND
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-red-500 flex items-center">
                <span
                  onClick={openVoucherDialog}
                  className="border border-red-500 text-red-500 px-2 py-1 rounded-md cursor-pointer"
                >
                  {lang.curLangPack.payment?.["shopVoucher"]}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-600">
                  {lang.curLangPack.payment?.["total"]} ({cartProducts.length}{" "}
                  {lang.curLangPack.payment?.["product"]}):
                </span>
                <span className="text-red-500 font-semibold ml-2">
                  {totalAmount.toLocaleString("Vi-VN")} VND
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              {lang.curLangPack.payment?.["voucher"]}
            </h2>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder={lang.curLangPack.payment?.["enterVoucher"]}
                value={voucherCode}
                onChange={handleVoucherCodeChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <Button
                onClick={handleApplyVoucher}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                {lang.curLangPack.payment?.["apply"]}
              </Button>
            </div>
            {voucherApplied && (
              <div className="mt-2">
                <p className="text-green-500">
                  {lang.curLangPack.payment?.["voucherAppSuccess"]}
                </p>
                <p className="text-gray-500">
                  {lang.curLangPack.payment?.["discount"]}:{" "}
                  <span className="font-semibold text-black">
                    {discountAmount.toLocaleString("Vi-VN")} VND
                  </span>
                </p>
                <p className="text-gray-500">
                  {lang.curLangPack.payment?.["totalAfterDis"]}:{" "}
                  <span className="font-semibold text-black">
                    {finalAmountWithoutSip.toLocaleString("Vi-VN")} VND
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              {lang.curLangPack.payment?.["payment"]}
            </h2>
            <div className="flex space-x-4 mb-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`px-4 py-2 rounded-md ${
                    selectedPaymentMethod === method.id
                      ? "border border-red-500 text-red-500"
                      : "border border-gray-300 text-gray-500"
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{lang.curLangPack.payment?.["totalProdpucts"]}</span>
                <span>{totalAmount.toLocaleString("Vi-VN")} VND</span>
              </div>
              <div className="flex justify-between">
                <span>{lang.curLangPack.payment?.["shippingFee"]}</span>
                <span>{shippingFee.toLocaleString("Vi-VN")} VND</span>
              </div>
              {voucherApplied && (
                <div className="flex justify-between">
                  <span>{lang.curLangPack.payment?.["discount"]}</span>
                  <span>-{discountAmount.toLocaleString("Vi-VN")} VND </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang.curLangPack.payment?.["totalPayment"]}</span>
                <span className="text-red-500 font-semibold">
                  {finalAmount.toLocaleString("Vi-VN")} VND
                </span>
              </div>
            </div>
            <Button
              style={{
                backgroundColor: profileStore.buttonColor,
                color: profileStore.buttonTextColor,
              }}
              onClick={handlePlaceOrder}
              variant="secondary"
              className="mt-4 w-full py-2 rounded-md "
            >
              {lang.curLangPack.payment?.["place"]}
            </Button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {lang.curLangPack.payment?.["term"]}
              <Link href="/legal/term" className="text-blue-500">
                {lang.curLangPack.payment?.["condition"]}
              </Link>
            </p>
          </div>

          <Dialog
            open={isAddressDialogOpen}
            onOpenChange={setIsAddressDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {lang.curLangPack.payment?.["myAddress"]}
                </DialogTitle>
                <DialogDescription>
                  {lang.curLangPack.payment?.["selectAddress"]}
                </DialogDescription>
              </DialogHeader>
              {addresses.length > 0 &&
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className="mb-4 p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>{address.fullName}</strong>
                      </p>
                      <p>{address.phoneNumber}</p>
                      <p>
                        {address.addressLine1}, {address.addressLine2},{" "}
                        {address.city}, {address.postalCode}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleAddressSelect(address)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      {lang.curLangPack.payment?.["select"]}
                    </Button>
                  </div>
                ))}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  {lang.curLangPack.payment?.["newAddress"]}
                </h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    name={lang.curLangPack.payment?.["fullName"]}
                    value={newAddress.fullName}
                    onChange={handleNewAddressChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={lang.curLangPack.payment?.["phone"]}
                    onChange={handleNewAddressChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <Input
                    type="text"
                    placeholder={lang.curLangPack.payment?.["city"]}
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <Input
                    type="text"
                    placeholder={lang.curLangPack.payment?.["specific"]}
                    name="addressLine1"
                    value={newAddress.addressLine1}
                    onChange={handleNewAddressChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleNewAddressChange}
                      className="form-checkbox h-4 w-4 text-red-500"
                    />
                    <span>{lang.curLangPack.payment?.["setDefault"]}</span>
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleNewAddressSubmit}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      {lang.curLangPack.payment?.["complete"]}
                    </Button>
                    <Button
                      onClick={closeAddressDialog}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      {lang.curLangPack.payment?.["back"]}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isVoucherDialogOpen}
            onOpenChange={setIsVoucherDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {lang.curLangPack.payment?.["voucherList"]}
                </DialogTitle>
                <DialogDescription>
                  {lang.curLangPack.payment?.["selectVoucher"]}
                </DialogDescription>
              </DialogHeader>
              {vouchers.length > 0 &&
                vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="mb-4 p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>
                          {lang.curLangPack.payment?.["code"]}:{" "}
                          {voucher.voucherCode}
                        </strong>
                      </p>
                      <p>
                        {lang.curLangPack.payment?.["discount"]}:{" "}
                        {voucher.discountPercent * 100}%
                      </p>
                      <p>
                        {lang.curLangPack.payment?.["maxDis"]}:{" "}
                        {voucher.maxDiscount.toLocaleString("Vi-VN")} đ
                      </p>
                      <p>
                        {lang.curLangPack.payment?.["minDis"]}:{" "}
                        {voucher.minAppValue.toLocaleString("Vi-VN")} đ
                      </p>
                    </div>
                    <Button
                      onClick={() => handleVoucherSelect(voucher.voucherCode)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      {lang.curLangPack.payment?.["select"]}
                    </Button>
                  </div>
                ))}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
