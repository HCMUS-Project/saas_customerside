"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/constants/mock-data/mock-product";
import Image from "next/image";
import { useState } from "react";

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    fullName: "John Doe",
    addressLine1: "123 Main St",
    addressLine2: "Apt 1",
    city: "New York",
    postalCode: "10001",
  },
  {
    id: "2",
    fullName: "Jane Smith",
    addressLine1: "456 Elm St",
    city: "Los Angeles",
    postalCode: "90001",
  },
  {
    id: "3",
    fullName: "Bob Johnson",
    addressLine1: "789 Oak St",
    addressLine2: "Suite 100",
    city: "Chicago",
    postalCode: "60601",
  },
];

export default function CheckoutPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [paypalAccount, setPaypalAccount] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleCreditCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreditCardNumber(e.target.value);
  };

  const handlePaypalAccountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaypalAccount(e.target.value);
  };

  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleApplyVoucher = () => {
    // Simulate applying voucher by checking if the voucher code matches a predefined value
    if (voucherCode === "SHOPEE10") {
      setVoucherApplied(true);
    } else {
      alert("Invalid voucher code. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          {/* Address */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockAddresses.map((address) => (
                <div key={address.id}>
                  <div
                    className={`bg-white border border-gray-300 p-4 rounded-md cursor-pointer ${
                      selectedAddress?.id === address.id ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <h3 className="text-lg font-semibold">
                      {address.fullName}
                    </h3>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.postalCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Payment method */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
            <div className="space-y-4">
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="paymentMethod"
                    value="creditCard"
                    onChange={() => handlePaymentMethodChange("creditCard")}
                  />
                  <span className="ml-2">Credit Card</span>
                </label>
                {selectedPaymentMethod === "creditCard" && (
                  <div className="mt-4">
                    <Input
                      type="text"
                      placeholder="Enter your credit card number"
                      value={creditCardNumber}
                      onChange={handleCreditCardNumberChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="paymentMethod"
                    value="paypal"
                    onChange={() => handlePaymentMethodChange("paypal")}
                  />
                  <span className="ml-2">PayPal</span>
                </label>
                {selectedPaymentMethod === "paypal" && (
                  <div className="mt-4">
                    <Input
                      type="text"
                      placeholder="Enter your PayPal account"
                      value={paypalAccount}
                      onChange={handlePaypalAccountChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Voucher */}
          <div>
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
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          {/* Order summary */}
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {/* Mockup products */}
          <div className="space-y-4">
            {/* Product item */}
            <div className="space-y-4">
              {/* Product item */}
              <div className="grid lg:grid-cols-1 gap-4">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 border rounded-md p-4"
                  >
                    <div className="h-20 w-20 relative">
                      <Image
                        src={product.imgSrc}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-500">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Repeat for other products */}
            </div>
            {/* Repeat for other products */}
          </div>
          {/* Total */}
          <div className="mt-6">
            <p className="text-lg font-semibold">Total: $200.00</p>
          </div>
          {/* Checkout button */}
          <div className="mt-6">
            <Button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
