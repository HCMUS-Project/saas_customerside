export const reviewEndpoint = {
  ecommerceReviewCreate: "api/ecommerce/review/create",
  ecommerceReviewFind: (domain: string, productId: string) =>
    `api/ecommerce/review/find/?productId=${productId}&domain=${domain}`,
  ecommerceReviewUpdate: "api/ecommerce/review/update",
  ecommerceReviewDelete: (id: string) => `api/ecommerce/review/delete/${id}`,
};
