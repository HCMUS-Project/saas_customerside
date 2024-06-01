export const bookingEndpoints = {
  searchBookings: (domain: string) =>
    `api/booking/services/search?domain=${domain}`,
  searchBookingsName: (name: string) =>
    `api/booking/services/search?name=${name}`,
  findById: (domain: string, id: string) =>
    `api/booking/services/search/?domain=${domain}&id=${id}`,
  createBookings: "api/booking/bookings/create",
  slotBookings: (date: string, serviceId: string) =>
    `/api/booking/bookings/search?date=${date}&service=${serviceId}`,
};
