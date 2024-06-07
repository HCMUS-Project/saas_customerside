export const ecommerceEndpoints = {
  searchOrder: (stage: string) => `/api/ecommerce/order/search/?stage=${stage}`,
  findBestProducts: "/api/ecommerce/product/find/best",
  findRecommendedProducts: "/api/ecommerce/product/find/recommend",
};
