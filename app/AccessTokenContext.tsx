// "use client";
// // Thay vì sử dụng '{}' làm kiểu cho props, hãy sử dụng kiểu có chứa 'children'
// import React, { createContext, useContext, useMemo, useState } from "react";

// interface AccessTokenContextType {
//   accessToken: string;
//   setAccessToken: React.Dispatch<React.SetStateAction<string>>;
// }

// const AccessTokenContext = createContext<AccessTokenContextType | null>(null);

// export const useAccessToken = (): AccessTokenContextType => {
//   const context = useContext(AccessTokenContext);
//   if (!context) {
//     throw new Error("useAccessToken must be used within a AccessTokenProvider");
//   }
//   return context;
// };

// export const AccessTokenProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [accessToken, setAccessToken] = useState<string>("");

//   return (
//     <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
//       {children}
//     </AccessTokenContext.Provider>
//   );
// };
