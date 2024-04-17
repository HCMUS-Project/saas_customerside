"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <Button className="btn btn-primary" onClick={() => {}}>
        Add to Cart
        <ShoppingCart />
      </Button>
    </div>
  );
}
