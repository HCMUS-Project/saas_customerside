import { useLanguage } from "@/hooks/use-language";
import { z } from "zod";
const lang = useLanguage.getState();
export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: `${lang.curLangPack.auth?.["notiEmail"]}`,
    }),
    username: z.string().min(1, {
      message: `${lang.curLangPack.auth?.["notiName"]}`,
    }),
    phone: z.string().min(1, {
      message: `${lang.curLangPack.auth?.["notiPhone"]}`,
    }),
    password: z.string().min(6, {
      message: `${lang.curLangPack.auth?.["notiPassword"]}`,
    }),
    confirmPassword: z.string().min(6, {
      message: `${lang.curLangPack.auth?.["notiPassword"]}`,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: `${lang.curLangPack.auth?.["matchPass"]}`,
    path: ["confirm"],
  });
export const LoginSchema = z.object({
  email: z.string().email({
    message: `${lang.curLangPack.auth?.["notiEmail"]}`,
  }),
  password: z.string().min(6, {
    message: `${lang.curLangPack.auth?.["notiPassword"]}`,
  }),
});

export const OTPSchema = z.object({
  email: z.string().email({
    message: `${lang.curLangPack.auth?.["notiEmail"]}`,
  }),
});
export const RegisterOTPFSchema = z.object({
  email: z.string().email({
    message: `${lang.curLangPack.auth?.["notiEmail"]}`,
  }),
  pin: z.string().min(6, {
    message: `${lang.curLangPack.auth?.["OTP"]}`,
  }),
});
