export const bookingEndpoints = {
  searchBookings: `api/booking/services/search`,
  searchBookingsName: (name: string) =>
    `api/booking/services/search?name=${name}`,
  findById: (domain: string, id: string) =>
    `api/booking/services/search/?domain=${domain}&id=${id}`,
  createBookings: "api/booking/bookings/create",
  slotBookings: (date: string, serviceId: string) =>
    `/api/booking/bookings/search?date=${date}&service=${serviceId}`,
  findAllVoucher: (service: string) =>
    `api/booking/voucher/find/all/?service=${service}`,
  findVoucher: (id: string) => `api/booking/voucher/find/${id}`,
  createBookingReview: "api/booking/review/create",
  reviewBooking: (domain: string) =>
    `api/booking/review/find/?domain=${domain}`,
  bookingReviewUpdate: "api/booking/review/update",
  bookingReviewDelete: (id: string) => `api/booking/review/delete/${id}`,
  findBookings: (status: string) =>
    `api/booking/bookings/find/all?status=${status}`,
  findBookingReview: (domain: string, serviceId: string) =>
    `api/booking/review/find?serviceId=${serviceId}&domain=${domain} `,
  findRecommended: (domain: string) =>
    `api/booking/services/find/recommend?domain=${domain}`,
  findBestServices: `api/booking/services/find/best`,
  deleteBooking: "api/booking/bookings/delete",
};
