export const authEndpoint = {
  signIn: "api/auth/sign-in",
  signUp: "api/auth/sign-up",
  verifyAccount: "api/auth/verify-account",
  sendMailOTP: "api/auth/send-mail-otp",
  updateProfile: "api/auth/update-profile",
  getProfile: "api/auth/get-profile",
  refeshToken: "api/auth/refesh-token",
  logOut: "api/auth/sign-out",
};

export const productEndpoint = {
  findAllProduct: "api/ecommerce/product/find/all",
  findProductByID: "api/ecommerce/product/find/{id}",
  searchProduct: "api/ecommerce/product/search",
};
