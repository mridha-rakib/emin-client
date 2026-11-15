"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PrimaryButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PrimaryButton = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: PrimaryButtonProps) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-xs shadow-primary/25 border border-primary/20",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80",
    outline: "border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 bg-transparent",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg",
    md: "px-5 py-2.5 text-sm font-semibold rounded-xl",
    lg: "px-7 py-3.5 text-base font-bold rounded-xl",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer font-medium select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
