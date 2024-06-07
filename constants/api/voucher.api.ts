export const voucherEnpoint = {
  findVoucher: (domain: string, code: string) =>
    `/api/ecommerce/voucher/find?domain=${domain}&code=${code}`,
  findAllVoucher: (domain: string) =>
    `/api/ecommerce/voucher/find?domain=${domain}`,
};
