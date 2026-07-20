import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataSourceFieldProps {
  /** True when value came from Numiz API; false when mock/fallback is shown. */
  fromApi: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Integration marker for fields that are (or will be) backed by the API.
 * Blue outline = live server data; red outline = mock / missing API value.
 */
export function DataSourceField({ fromApi, className, children }: DataSourceFieldProps) {
  return (
    <div
      className={cn(
        "rounded-2xl ring-1",
        fromApi ? "ring-sky-500/80" : "ring-red-500/80",
        className,
      )}
      data-from-api={fromApi ? "true" : "false"}
      title={fromApi ? "Data from API" : "Mock data — not from API"}
    >
      {children}
    </div>
  );
}
