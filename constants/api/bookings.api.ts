export const bookingEndpoints = {
  searchBookings: "api/booking/services/search",
  findById: (id: string) => `api/booking/services/find/${id}`,
  createBookings: "api/booking/bookings/create",
};
