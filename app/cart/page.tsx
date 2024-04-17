import { Button } from "@/components/ui/button";
import CartEntry from "./cart-entry";

export default function CartPage() {
  return (
    <div>
      <h1 className="mb-6 font-bold text-3xl">Shopping Cart</h1>
      <CartEntry />
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">Total: $1000</p>
        <Button className="btn btn-primary sm:w-[200px]">Checkout</Button>
      </div>
    </div>
  );
}
