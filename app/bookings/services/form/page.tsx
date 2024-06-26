"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { AXIOS } from "@/constants/network/axios";
import { employeeEndpoints } from "@/constants/api/employee.api";
import { bookingEndpoints } from "@/constants/api/bookings.api";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoadingPage from "@/app/loading"; // Import loader component

interface Service {
  id: string;
  images: Array<string>;
  name: string;
  price: number;
  rating: number;
  description: string;
}

interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  workDays: string[];
  workShift: string[];
  image?: string;
}

interface Slot {
  startTime: string;
  endTime: string;
  employees: Employee[];
}

const FormSchema = z.object({
  bookingDate: z.date({
    required_error: "Booking date is required.",
  }),
  bookingTime: z.string({
    required_error: "Booking time is required.",
  }),
});

export default function BookingForm() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false); // State for employee loading
  const router = useRouter();

  useEffect(() => {
    const storedService = localStorage.getItem("selectedService");
    if (storedService) {
      setSelectedService(JSON.parse(storedService));
    }
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchAvailableDates();
    }
  }, [selectedService]);

  const fetchAvailableDates = async () => {
    const storedService = localStorage.getItem("selectedService");

    if (!storedService) {
      console.error("Service data not found in localStorage");
      return;
    }

    try {
      const domain = "30shine.com";
      const response = await AXIOS.GET({
        uri: employeeEndpoints.searchEmployee(domain),
        params: {
          services: [JSON.parse(storedService).id],
        },
      });

      const employees = response.data.employees;
      const workDays = employees.reduce((acc: Set<string>, employee: any) => {
        employee.workDays.forEach((day: string) => acc.add(day));
        return acc;
      }, new Set<string>());

      const dates: Date[] = [];
      for (let i = 0; i < 30; i++) {
        const date = addDays(new Date(), i);
        const dayName = format(date, "EEEE").toUpperCase();
        if (workDays.has(dayName)) {
          dates.push(date);
        }
      }

      setAvailableDates(dates);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const handleTimeClick = (time: string) => {
    if (selectedTime === time) {
      setSelectedTime(null);
      setEmployees([]);
    } else {
      setSelectedTime(time);
      setLoadingEmployees(true); // Start loading employees
      const slot = availableSlots.find((slot) => slot.startTime === time);
      if (slot) {
        setEmployees(slot.employees);
        setLoadingEmployees(false); // Stop loading employees
      } else {
        setEmployees([]);
        setLoadingEmployees(false); // Stop loading employees
      }
    }
  };

  const fetchBookedSlots = async (selectedDate: Date) => {
    const storedService = localStorage.getItem("selectedService");
    const serviceId = storedService ? JSON.parse(storedService).id : null;

    if (!serviceId) {
      console.error("Service ID not found in localStorage");
      return;
    }

    try {
      const response = await AXIOS.GET({
        uri: bookingEndpoints.slotBookings(
          format(selectedDate, "yyyy-MM-dd"),
          serviceId
        ),
      });

      if (response.data && Array.isArray(response.data.slotBookings)) {
        const slots = response.data.slotBookings.map((slot: any) => ({
          startTime: new Date(slot.startTime).toISOString().slice(11, 16),
          endTime: new Date(slot.endTime).toISOString().slice(11, 16),
          employees: slot.employees,
        }));
        setAvailableSlots(slots);
        setBookedSlots(slots);
      } else {
        console.error("Unexpected response format", response.data);
        setAvailableSlots([]);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error("Failed to fetch booked slots", error);
      setAvailableSlots([]);
      setBookedSlots([]);
    }
  };

  const handleBookingDateSelect = async (date: Date) => {
    setSelectedDate(date);
    const employees = await fetchEmployees(date);
    setEmployees(employees);

    if (employees.length > 0) {
      await fetchBookedSlots(date);
    } else {
      setAvailableSlots([]);
    }
  };

  const fetchEmployees = async (selectedDate: Date) => {
    const storedService = localStorage.getItem("selectedService");

    if (!storedService) {
      console.error("Service data not found in localStorage");
      return [];
    }

    const formattedDate = format(selectedDate, "EEEE").toUpperCase();

    try {
      const domain = "30shine.com";
      const response = await AXIOS.GET({
        uri: employeeEndpoints.searchEmployee(domain),
        params: {
          services: [JSON.parse(storedService).id],
        },
      });

      const filteredEmployees = response.data.employees.filter(
        (employee: Employee) => employee?.workDays.includes(formattedDate)
      );

      return filteredEmployees;
    } catch (error) {
      console.error("Failed to fetch employees", error);
      return [];
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleClearService = () => {
    setSelectedService(null);
    localStorage.removeItem("selectedService");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission

    if (
      !selectedDate ||
      !selectedTime ||
      !selectedService ||
      !selectedEmployee
    ) {
      console.error("Date, time, service, or employee not selected");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a date, time, service, and employee.",
      });
      return;
    }

    const serviceId = selectedService.id;

    const bookingDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);

    // Set the time based on the local timezone
    bookingDateTime.setHours(hours);
    bookingDateTime.setMinutes(minutes);
    bookingDateTime.setSeconds(0);

    // Convert the local date and time to UTC
    const utcDateTime = new Date(
      bookingDateTime.getTime() - bookingDateTime.getTimezoneOffset() * 60000
    );

    console.log("Selected Date and Time:", selectedDate, selectedTime);
    console.log("UTC Date and Time:", utcDateTime.toISOString());

    const bookingData = {
      date: utcDateTime.toISOString().split("T")[0], // Use the UTC date part
      note: "đặt chỗ",
      service: serviceId, // Pass the service ID directly
      startTime: utcDateTime.toISOString(),
      employee: selectedEmployee,
    };
    console.log(bookingData);

    try {
      const response = await AXIOS.POST({
        uri: bookingEndpoints.createBookings,
        params: bookingData,
      });

      console.log("Booking response:", response.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Booking created successfully!",
      });

      // Clear local storage and refresh booked slots
      localStorage.removeItem("selectedService");
      setSelectedTime(null);
      setSelectedDate(null);
      setAvailableSlots([]);
      setBookedSlots([]);
      setSelectedEmployee(null);
      await fetchAvailableDates(); // Fetch available dates again
      router.push("/bookings");

      console.log("Booking successful:", bookingData);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create booking. Please try again.",
      });
    }
  };

  const totalAmount = selectedService ? selectedService.price : 0;

  return (
    <div className="container mx-auto mt-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>BOOKING</CardTitle>
          <CardDescription>Choose time to...</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-1.5 pt-2"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="service">Chọn dịch vụ</Label>
                <div className="border p-2 rounded">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {selectedService ? (
                        <span className="ml-2">Đã chọn 1 dịch vụ</span>
                      ) : (
                        <span className="ml-2">No service selected</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      className="ml-auto "
                      variant="link"
                      onClick={() =>
                        router.push("/bookings/services/form/step1")
                      }
                    >
                      {selectedService ? "Change Service" : "Select Service"}
                    </Button>
                    {selectedService && (
                      <Button
                        variant="link"
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={handleClearService}
                      >
                        <XIcon className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedService ? (
                      <span className="bg-gray-200 px-2 py-1 rounded">
                        {selectedService.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        No service selected
                      </span>
                    )}
                  </div>
                  {selectedService && (
                    <div className="mt-2 text-green-500">
                      Tổng số tiền bạn cần thanh toán:{" "}
                      {totalAmount.toLocaleString()} VND
                    </div>
                  )}
                </div>
              </div>

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
                            type="button"
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
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date) {
                              setSelectedDate(date);
                              handleBookingDateSelect(date);
                            }
                          }}
                          disabled={(date) =>
                            !availableDates.some(
                              (d) =>
                                d.getDate() === date.getDate() &&
                                d.getMonth() === date.getMonth() &&
                                d.getFullYear() === date.getFullYear()
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {availableSlots.length > 0 && (
                <FormItem className="flex flex-col">
                  <FormLabel>Chọn giờ</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.startTime}
                        type="button"
                        onClick={() => handleTimeClick(slot.startTime)}
                        className={`py-2 px-4 rounded-md ${
                          selectedTime === slot.startTime
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        disabled={slot.employees.length === 0}
                      >
                        {slot.startTime}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
              {selectedTime && (
                <>
                  {loadingEmployees ? (
                    <div className="flex justify-center items-center h-32">
                      <LoadingPage />
                    </div>
                  ) : (
                    employees.length > 0 && (
                      <div className="space-y-2">
                        <Label>Nhân viên làm việc</Label>
                        <div className="flex space-x-2 overflow-x-auto pb-4">
                          {employees.map((employee) => (
                            <div
                              key={employee.id}
                              className={`border p-2 rounded-lg cursor-pointer ${
                                selectedEmployee === employee.id
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                              onClick={() => setSelectedEmployee(employee.id)}
                            >
                              <Avatar className="justify-self-center">
                                <AvatarImage
                                  alt={`${employee.firstName} ${employee.lastName}`}
                                  src={
                                    employee.image ||
                                    "https://github.com/shadcn.png"
                                  }
                                />
                              </Avatar>
                              <p className="text-center mt-2">
                                {employee.firstName} {employee.lastName}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
              <Button className="w-full" variant="outline" type="submit">
                Chốt giờ
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
