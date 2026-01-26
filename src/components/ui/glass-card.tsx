import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "strong" | "subtle";
  glow?: "primary" | "accent" | "success" | "none";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", children, ...props }, ref) => {
    const variantClasses = {
      default: "glass",
      strong: "glass-strong",
      subtle: "glass-subtle",
    };

    const glowClasses = {
      primary: "glow-primary",
      accent: "glow-accent",
      success: "glow-success",
      none: "",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          variantClasses[variant],
          glowClasses[glow],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
