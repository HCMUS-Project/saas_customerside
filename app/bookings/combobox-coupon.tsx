"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Coupon = {
  value: string;
  label: string;
};

const Coupones: Coupon[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

export function ComboBoxResponsiveCoupon() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCoupon, setSelectedCoupon] = React.useState<Coupon | null>(
    null
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedCoupon ? <>{selectedCoupon.label}</> : <>+ Set Coupon</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <CouponList setOpen={setOpen} setSelectedCoupon={setSelectedCoupon} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedCoupon ? <>{selectedCoupon.label}</> : <>+ Set Coupon</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CouponList setOpen={setOpen} setSelectedCoupon={setSelectedCoupon} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CouponList({
  setOpen,
  setSelectedCoupon,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCoupon: (Coupon: Coupon | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter Coupon..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Coupones.map((Coupon) => (
            <CommandItem
              key={Coupon.value}
              value={Coupon.value}
              onSelect={(value) => {
                setSelectedCoupon(
                  Coupones.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}
            >
              {Coupon.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
