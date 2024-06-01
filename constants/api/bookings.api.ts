export const bookingEndpoints = {
  searchBookings: "api/booking/services/search",
  searchBookingsName: (name: string) =>
    `api/booking/services/search?name=${name}`,
  findById: (id: string) => `api/booking/services/find/${id}`,
  createBookings: "api/booking/bookings/create",
  slotBookings: (date: string, serviceId: string) =>
    `/api/booking/bookings/search?date=${date}&service=${serviceId}`,
};
