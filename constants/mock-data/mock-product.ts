interface Product {
  id: string;
  imgSrc: string;
  name: string;
  linkTo: string;
  price: number;
  type: string;
  operation: () => void;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    imgSrc:
      "https://img.freepik.com/free-psd/cosmetic-elements-white-background-mock-up-design_1135-79.jpg",
    name: "Cosmetic",
    linkTo: "/product/cosmetic",
    price: 200,
    type: "product",
    operation: () => {},
  },
  {
    id: "2",
    imgSrc:
      "https://img.freepik.com/free-psd/cosmetic-elements-white-background-mock-up-design_1135-79.jpg",
    name: "Cosmetic",
    linkTo: "/product/cosmetic",
    price: 200,
    type: "product",
    operation: () => {},
  },
  {
    id: "3",
    imgSrc:
      "https://img.freepik.com/free-psd/cosmetic-elements-white-background-mock-up-design_1135-79.jpg",
    name: "Cosmetic",
    linkTo: "/product/cosmetic",
    price: 200,
    type: "product",
    operation: () => {},
  },
  {
    id: "4",
    imgSrc:
      "https://img.freepik.com/free-psd/cosmetic-elements-white-background-mock-up-design_1135-79.jpg",
    name: "Cosmetic",
    linkTo: "/product/cosmetic",
    price: 200,
    type: "product",
    operation: () => {},
  },
];
