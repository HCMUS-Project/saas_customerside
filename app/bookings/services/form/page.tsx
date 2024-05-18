"use client";
import { format } from "date-fns";
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

import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useState, useEffect } from "react";
import { AXIOS } from "@/constants/network/axios";
import { employeeEndpoints } from "@/constants/api/employee.api";
import { bookingEndpoints } from "@/constants/api/bookings.api";
interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  workDays: string[];
  workShift: string[]; // Đảm bảo trường workDays tồn tại và có kiểu dữ liệu là một mảng chuỗi
}

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

export default function BookingForm() {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(undefined);
  const [serviceData, setServiceData] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [workDays, setWorkDays] = useState<string[]>(["SUNDAY"]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [employees, setEmployees] = useState<Employee[] | null>([]);
  const getWorkShift = (hour: number): string => {
    if (hour >= 6 && hour < 12) {
      return "MORNING";
    } else if (hour >= 12 && hour < 17) {
      return "AFTERNOON";
    } else if (hour >= 17 && hour < 22) {
      return "EVENING";
    } else {
      return "NIGHT";
    }
  };
  const getShiftTimeRange = (shifts: string[]): [number, number] => {
    let startHour = 0;
    let endHour = 0;

    shifts.forEach((shift) => {
      switch (shift) {
        case "MORNING":
          startHour = 6;
          endHour = 12;
          break;
        case "AFTERNOON":
          startHour = 12;
          endHour = 17;
          break;
        case "EVENING":
          startHour = 17;
          endHour = 22;
          break;
        case "NIGHT":
          startHour = 22;
          endHour = 24;
          break;
        default:
          break;
      }
    });

    return [startHour, endHour];
  };
  useEffect(() => {
    const storedServiceData = localStorage.getItem("ServiceID");
    if (storedServiceData) {
      setServiceData(JSON.parse(storedServiceData));
    }
  }, []);

  const handleTimeClick = (hour: number) => {
    setSelectedTime(hour);
    const shiftTimeRange = getShiftTimeRange(selectedEmployee?.workShift || []);
    console.log("Selected shift time range:", shiftTimeRange);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const selectedEmployee = employees?.find(
      (employee) => employee.id === employeeId
    );
    setSelectedEmployee(selectedEmployee);
  };

  const fetchEmployees = async (selectedDate: Date) => {
    const workShift = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"];
    const storedServiceData = localStorage.getItem("ServiceID");
    const serviceId = storedServiceData
      ? JSON.parse(storedServiceData).id
      : null;

    if (!serviceId) {
      console.error("Service ID not found in localStorage");
      return null; // Trả về null nếu không có serviceId
    }

    const formattedDate = format(selectedDate, "EEEE").toUpperCase();

    try {
      const response = await AXIOS.GET({
        uri: employeeEndpoints.searchEmployee,
        params: {
          firstName: "nguyen",
          lastName: "vu",
          email: "luphihung111@gmail.com",
          workDays: [formattedDate], // Truyền ngày làm việc đã chọn vào params
          workShift: workShift,
          services: [serviceId],
        },
      });

      // Lọc nhân viên theo ngày làm việc
      const filteredEmployees = response.data.employees.filter(
        (employee: Employee) => employee?.workDays.includes(formattedDate)
      );

      return { employees: filteredEmployees };
    } catch (error) {
      console.error("Failed to fetch employees", error);
      return null; // Trả về null nếu có lỗi trong quá trình fetch
    }
  };

  const handleBookingDateSelect = (date: Date) => {
    setWorkDays([format(date, "EEEE").toUpperCase()]); // Cập nhật ngày làm việc đã chọn
    fetchEmployees(date).then((data) => {
      if (data && data.employees) {
        // Kiểm tra nếu có dữ liệu nhân viên
        setEmployees(data.employees);
        console.log(data.employees);
      } else {
        setEmployees([]); // Nếu không có dữ liệu, đặt employees thành một mảng trống
        console.log("No employees found");
      }
    });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!selectedDate || selectedTime === null || !selectedEmployee) {
      console.error("Date, time, or employee not selected");
      return;
    }

    const storedServiceData = localStorage.getItem("ServiceID");
    const serviceId = storedServiceData
      ? JSON.parse(storedServiceData).id
      : null;

    if (!serviceId) {
      console.error("Service ID not found in localStorage");
      return;
    }

    const bookingDateTime = new Date(selectedDate);
    bookingDateTime.setHours(selectedTime);
    bookingDateTime.setMinutes(0);
    bookingDateTime.setSeconds(0);

    const bookingData = {
      date: selectedDate.toISOString(),
      employee: selectedEmployee.id, // Truyền employeeId thay vì selectedEmployee
      note: "đặt chỗ",
      service: serviceId,
      startTime: bookingDateTime.toISOString(),
    };

    try {
      await AXIOS.POST({
        uri: bookingEndpoints.createBookings,
        params: bookingData,
      });
      console.log("Booking successful:", bookingData);
    } catch (error) {
      console.error("Failed to submit booking", error);
    }
  };

  return (
    <div className="flex pt-6 sm:flex justify-center items-center ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>BOOKING</CardTitle>
          <CardDescription>Choose time to...</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-1.5 pt-2 "
            onSubmit={(event) => {
              event.preventDefault(); // Chặn hành động mặc định của form
              form.handleSubmit(handleSubmit)(event); // Gọi hàm handleSubmit với đối tượng sự kiện
            }}
          >
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="service">Chọn dịch vụ</Label>
              <Select defaultValue={serviceData?.id}>
                <SelectTrigger id="service">
                  <SelectValue placeholder={serviceData?.name || "Select"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {serviceData && (
                    <SelectItem value={serviceData.id}>
                      {serviceData.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </form>
          <Form {...form}>
            <form
              className="space-y-1.5 pt-2 "
              onSubmit={(event) => {
                event.preventDefault(); // Chặn hành động mặc định của form
                form.handleSubmit(handleSubmit)(event); // Gọi hàm handleSubmit với đối tượng sự kiện
              }}
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
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date) {
                              setSelectedDate(date);
                              handleBookingDateSelect(date);
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employee"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Chọn nhân viên</FormLabel>

                    <Select
                      onValueChange={(value) => {
                        console.log("Selected employee ID:", value); // Kiểm tra giá trị của employee ID được chọn
                        field.onChange(value);
                        handleEmployeeSelect(value);
                      }}
                      defaultValue={selectedEmployee?.id || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees !== null &&
                          employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.lastName} {employee.firstName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="flex flex-col">
                <FormLabel>Booked Time: </FormLabel>
                <div>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                    const shiftTimeRange = getShiftTimeRange(
                      selectedEmployee?.workShift || []
                    );
                    const [startHour, endHour] = shiftTimeRange;
                    if (hour >= startHour && hour < endHour) {
                      return (
                        <Button
                          key={hour}
                          onClick={() => {
                            handleTimeClick(hour);
                          }}
                          className={`py-2 px-4 rounded-md mr-2 mt-2 ${
                            selectedTime === hour
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                          type="button"
                        >
                          {hour}:00
                        </Button>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
                <FormMessage />
              </FormItem>

              <Button className="w-full" variant="outline" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
