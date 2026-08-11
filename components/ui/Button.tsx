import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const defaultClassName = "bg-emerald-600 text-white hover:bg-emerald-700";

const baseClassName =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60";

export default function Button({
  children,
  type = "submit",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`${baseClassName} ${className ?? defaultClassName}`}
    >
      {children}
    </button>
  );
}
