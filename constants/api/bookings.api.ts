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
  findAllVoucher: "api/booking/voucher/find/all",
  findVoucher: (id: string) => `api/booking/voucher/find/${id}`,
  reviewBooking: (domain: string) =>
    `api/booking/review/find/?domain=${domain}`,
  bookingReviewUpdate: "api/booking/review/update",
  bookingReviewDelete: (id: string) => `api/booking/review/delete/${id}`,
};
