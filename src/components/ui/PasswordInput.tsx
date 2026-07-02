"use client";
import { useState, forwardRef } from "react";
import { Input } from "./Input";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<typeof Input>;

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={show ? "text" : "password"}
        rightIcon={
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-neutral-400 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
