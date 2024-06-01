"use client";
import { Input } from "@/components/ui/input";
import { ComboBoxResponsiveDestination } from "@/app/product/combobox-destination";
import { AlignJustify } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Recommended from "./recommend-product";
import { ComboBoxResponsiveCoupon } from "./combobox-coupon";
import BestSeller from "./best-seller";
import AllProduct from "./all-products";
import { useEffect, useState } from "react";
import { AXIOS } from "@/constants/network/axios";

import { useDebounce } from "use-debounce";
import Search from "@/app/product/search";
import { productEndpoints } from "@/constants/api/product.api";
import { getJwt } from "@/util/auth.util";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item)),
});

export default function Product() {
  const [productsData, setProductsData] = useState<{ products: any[] }>({
    products: [],
  });
  const [searchProduct, setSearchProduct] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoints.findAll("30shine.com"),
        });
        setProductsData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, []);

  const items = [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ] as const;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  console.log(productsData);
  return (
    <div className=" py-2">
      <div className="container sm:flex justify-between items-center space-x-2">
        <div>
          <ComboBoxResponsiveDestination />
        </div>
        <div>
          <ComboBoxResponsiveCoupon />
        </div>
        <div className="w-full sm:w-[300px] md:w-[70%] relative">
          <Search />
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <AlignJustify />
            </PopoverTrigger>
            <PopoverContent className="size-20 w-full h-full">
              <div className="border-b font-bold ">filter</div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                      <FormItem className="pt-2">
                        {items.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="items"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="container">
          <div className="flex w-fit gap-10 mx-auto font-medium py-4 tex-blackish">
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>

            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
          </div>
          <div className="flex w-fit gap-10 mx-auto font-medium py-4 tex-blackish">
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Link href="#">Product</Link>
            </div>
          </div>
        </div>
      </div>
      <Recommended products={productsData?.products} />
      <BestSeller products={productsData?.products} />
      <AllProduct products={productsData?.products} />
    </div>
  );
}
