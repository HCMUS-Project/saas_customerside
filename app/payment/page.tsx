"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Swal from "sweetalert2";
import { AXIOS } from "@/constants/network/axios";
import { voucherEnpoint } from "@/constants/api/voucher.api";
import { getJwt } from "@/util/auth.util";
import { orderEndpoints } from "@/constants/api/order.api";
import { authEndpoint } from "@/constants/api/auth.api"; // Import the auth endpoint
import { cartEndpoints } from "@/constants/api/cart.api"; // Import the cart endpoints
import { productEndpoints } from "@/constants/api/product.api";

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}

interface Product {
  productId: string;
  images: string;
  quantity: number;
  description: string;
  name: string;
  price: number;
}

const paymentMethods = [
  { id: "vnpay", label: "VNPay" },
  { id: "cod", label: "Thanh toán khi nhận hàng" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const accessToken = getJwt("AT");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("vnpay");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherData, setVoucherData] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [appliedVouchers, setAppliedVouchers] = useState<string[]>([]);

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
            phoneNumber: `+${profile.phone}`,
          });
        } else {
          Swal.fire("Error", "Failed to fetch profile data.", "error");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        Swal.fire("Error", "Failed to fetch profile data.", "error");
      }
    };

    fetchProfile();
  }, [accessToken]);

  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const fetchVoucher = useCallback(async () => {
    if (appliedVouchers.includes(voucherCode)) {
      Swal.fire("Error", "Voucher already applied.", "error");
      return;
    }

    try {
      const domain = "30shine.com";

      const res = await AXIOS.GET({
        uri: voucherEnpoint.findVoucher(domain, voucherCode),
      });

      console.log("Voucher Response:", res.data); // Log the response to debug

      const voucher = res.data.voucher;

      if (!voucher) {
        throw new Error("Voucher not found in the response");
      }

      if (calculateTotalAmount() < voucher.minAppValue) {
        Swal.fire(
          "Error",
          "Order value is less than the minimum applicable value for this voucher.",
          "error"
        );
        return;
      }

      setVoucherData(voucher);
      setVoucherApplied(true);
      setAppliedVouchers([...appliedVouchers, voucherCode]);

      const discount = Math.min(
        voucher.maxDiscount,
        (voucher.discountPercent || 0) * calculateTotalAmount()
      );

      console.log("Discount Amount:", discount); // Log the discount amount to debug

      setDiscountAmount(discount);
      Swal.fire("Success", "Voucher applied successfully!", "success");
    } catch (error) {
      console.error("Error fetching voucher data:", error);
    }
  }, [voucherCode, appliedVouchers]);

  const handleApplyVoucher = () => {
    fetchVoucher();
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
      };

      const res = await AXIOS.POST({
        uri: orderEndpoints.createOrder,
        params: orderData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.statusCode >= 200 && res.statusCode <= 300) {
        Swal.fire("Success", "Order placed successfully!", "success").then(
          async () => {
            await fetchCartData(); // Fetch updated cart data
            router.push("/product");
          }
        );
      } else {
        Swal.fire(
          "Error",
          "Failed to place the order. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire(
        "Error",
        "Failed to place the order. Please try again.",
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
          uri: productEndpoints.findById("30shine.com", item.productId),
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

  const calculateTotalAmount = () => {
    const total = cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    console.log("Total Amount:", total); // Log the total amount to debug
    return total;
  };

  const totalAmount = calculateTotalAmount();
  const shippingFee = 17000;
  const finalAmountWithoutSip = totalAmount - discountAmount;
  const finalAmount = totalAmount + shippingFee - discountAmount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Checkout</h1>

      {/* Address Section */}
      <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg">
        <div className="border-b border-dashed border-gray-300 pb-2 mb-4">
          <h2 className="text-lg font-semibold">Địa Chỉ Nhận Hàng</h2>
        </div>
        {selectedAddress && (
          <div className="mb-2 flex justify-between items-center">
            <div>
              <strong>{selectedAddress.fullName}</strong>{" "}
              {selectedAddress.phoneNumber}, {selectedAddress.addressLine1},{" "}
              {selectedAddress.addressLine2}, {selectedAddress.city},{" "}
              {selectedAddress.postalCode}
              <div className="bg-white border border-red-500 text-red-500 px-2 py-1 rounded-md inline-block ml-2">
                Mặc Định
              </div>
            </div>
            <Button className="bg-white border border-blue-500 text-blue-500 px-2 py-1 rounded-md">
              Thay Đổi
            </Button>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
            <div className="col-span-6">Sản phẩm</div>
            <div className="col-span-2 text-center">Đơn giá</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-2 text-center">Thành tiền</div>
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
                  <p className="text-sm text-gray-500 mt-1">Loại: new gray</p>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-black font-semibold">
                  {product.price.toFixed(3)}
                </p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-black font-semibold">{product.quantity}</p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-black font-semibold">
                  {(product.price * product.quantity).toFixed(3)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-red-500 flex items-center">
            <span className="border border-red-500 text-red-500 px-2 py-1 rounded-md">
              Voucher của Shop
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-600">
              Tổng số tiền ({cartProducts.length} sản phẩm):
            </span>
            <span className="text-red-500 font-semibold ml-2">
              {totalAmount.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Voucher Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Voucher</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Enter voucher code"
            value={voucherCode}
            onChange={handleVoucherCodeChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <Button
            onClick={handleApplyVoucher}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Apply
          </Button>
        </div>
        {voucherApplied && (
          <div className="mt-2">
            <p className="text-green-500">Voucher applied successfully!</p>
            <p className="text-gray-500">
              Discount:{" "}
              <span className="font-semibold text-black">
                {discountAmount.toFixed(3)}
              </span>
            </p>
            <p className="text-gray-500">
              Total after discount:{" "}
              <span className="font-semibold text-black">
                {finalAmountWithoutSip.toFixed(3)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Payment Method Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Phương thức thanh toán</h2>
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
        {selectedPaymentMethod === "vnpay" && (
          <div className="p-4 border rounded-lg mb-4">
            <div className="flex items-center space-x-4 mb-4">
              <Input type="radio" name="paymentOption" className="form-radio" />
              <span>VNPay - Ví VNPay</span>
            </div>
            <div className="flex items-center space-x-4">
              <Input type="radio" name="paymentOption" className="form-radio" />
              <span>VietinBank</span>
            </div>
          </div>
        )}
        {selectedPaymentMethod === "cod" && (
          <div className="p-4 border rounded-lg mb-4">
            <span>Thanh toán khi nhận hàng</span>
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="p-4 border rounded-lg">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Tổng tiền hàng</span>
            <span>{totalAmount.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toFixed(3)}</span>
          </div>
          {voucherApplied && (
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>-{discountAmount.toFixed(3)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tổng thanh toán</span>
            <span className="text-red-500 font-semibold">
              {finalAmount.toFixed(3)}
            </span>
          </div>
        </div>
        <Button
          onClick={handlePlaceOrder}
          variant="secondary"
          className="mt-4 w-full text-white py-2 rounded-md "
        >
          Đặt hàng
        </Button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Nhấn {"Đặt hàng"} đồng nghĩa với việc bạn đồng ý tuân theo{" "}
          <Link href="#" className="text-blue-500">
            Điều khoản của chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}
