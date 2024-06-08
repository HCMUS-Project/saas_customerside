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

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item)),
});

export default function Product() {
  const [productsData, setProductsData] = useState<{ products: any[] }>({
    products: [],
  });
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoints.findBestSeller("30shine.com"),
        });
        setBestSellerProducts(res.data.products);
        console.log("Best sellers fetched:", res.data.products);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoints.findAll("30shine.com"),
        });
        setProductsData(res.data);
        console.log("All products fetched:", res.data);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const res = await AXIOS.GET({
          uri: productEndpoints.findRecommend("30shine.com"),
        });
        setRecommendedProducts(res.data.products);
        console.log("Recommended products fetched:", res.data.products);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    Promise.all([
      fetchBestSellers(),
      fetchProducts(),
      fetchRecommendedProducts(),
    ]).finally(() => {
      setLoading(false); // Set loading to false after data is fetched
    });
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

  return (
    <div className="py-2">
      <div className="container sm:flex justify-between items-center space-x-2">
        <div className="flex flex-grow min-w-0 relative">
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

      <Recommended products={recommendedProducts} />
      <BestSeller products={bestSellerProducts} />
      <AllProduct products={productsData?.products} />
    </div>
  );
}
