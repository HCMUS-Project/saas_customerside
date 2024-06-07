export const productEndpoints = {
  create: "api/ecommerce/product/create",
  findAll: (domain: string) => `api/ecommerce/product/find/?domain=${domain}`,
  findById: (domain: string, id: string) =>
    `api/ecommerce/product/find/?domain=${domain}&id=${id}`,
  update: "api/ecommerce/product/update",
  searchProductName: (domain: string, name: string) =>
    `api/ecommerce/product/search/?domain=${domain}&name=${name}`,
  deleteById: (id: string) => `api/ecommerce/product/delete/${id}`,
  findBestSeller: (domain: string) =>
    `api/ecommerce/product/find/best/?domain=${domain}`,
  findRecommend: (domain: string) =>
    `api/ecommerce/product/find/recommend/?domain=${domain}`,
};
