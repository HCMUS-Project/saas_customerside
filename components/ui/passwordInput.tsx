import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface passwordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordIput = React.forwardRef<HTMLInputElement, passwordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <Input
        type={showPassword ? "text" : "password"}
        suffix={
          showPassword ? (
            <EyeIcon
              className="select-none"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeOffIcon
              className="select-none"
              onClick={() => setShowPassword(true)}
            />
          )
        }
        className={className}
        {...props}
        ref={ref}
      />
    );
  }
);
PasswordIput.displayName = "PasswordIput";

export { PasswordIput };
