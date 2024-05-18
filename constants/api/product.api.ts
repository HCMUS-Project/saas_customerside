export const productEndpoints = {
  create: "api/ecommerce/product/create",
  findAll: "api/ecommerce/product/find/all",
  findById: (id: string) => `api/ecommerce/product/find/${id}`,
  update: "api/ecommerce/product/update",
  searchProduct: "api/ecommerce/product/search",
  deleteById: (id: string) => `api/ecommerce/product/delete/${id}`,
};
