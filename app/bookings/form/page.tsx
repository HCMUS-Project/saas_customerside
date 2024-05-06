"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import * as React from "react";
import { useState } from "react";

const bookedTimes = [8, 10, 12, 14, 16, 18];

const FormSchema = z.object({
  bookingDate: z.date({
    required_error: "Booking date is required.",
  }),
  employee: z.string({
    required_error: "Employee is required.",
  }),
  bookingTime: z.string({
    required_error: "Booking time is required.",
  }),
});
function onSubmit(data: z.infer<typeof FormSchema>) {
  console.log(
    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function BookingForm() {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const handleTimeClick = (time: number) => {
    if (!bookedTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  const handleEmployeeSelect = (employee: string) => {
    setSelectedEmployee(employee);
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <div className="flex pt-6 sm:flex justify-center items-center ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>BOOKING</CardTitle>
          <CardDescription>Choose time to...</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Chon dia diem</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Chon dich vu</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
          <Form {...form}>
            <form
              className="space-y-1.5 pt-2 "
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Booking date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>

            <div className="flex flex-col pt-2 space-y-1.5">
              <label htmlFor="employee">Chọn nhân viên</label>
              <Select
                onValueChange={(value) => handleEmployeeSelect(value)}
                defaultValue={selectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Nhân viên A</SelectItem>
                  <SelectItem value="B">Nhân viên B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <div className="flex flex-col pt-2 space-y-1.5">
                <h2>Select a Time:</h2>
                <div>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <button
                      key={hour}
                      onClick={() => handleTimeClick(hour)}
                      disabled={bookedTimes.includes(hour)}
                      className={`py-2 px-4 rounded-md mr-2 mt-2 ${
                        selectedTime === hour
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {hour}:00
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center w-full">
          <Button className="w-full" variant="outline" type="submit">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
