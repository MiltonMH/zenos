import { cn } from "@/lib/utils";

interface ChargerIconProps {
  className?: string;
}

export function ChargerIcon({ className }: ChargerIconProps) {
  return (
    <svg 
      viewBox="0 0 31 47" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-7 h-7", className)}
    >
      <rect 
        x="2.63727" 
        y="0.719298" 
        width="25.4152" 
        height="41.7193" 
        rx="4.37098" 
        stroke="currentColor" 
        strokeWidth="1.4386"
      />
      <path 
        d="M15.3438 29.8259C17.2475 29.8262 18.7549 31.3203 18.7549 33.1208C18.7549 34.9214 17.2475 36.4165 15.3438 36.4167C13.4398 36.4167 11.9316 34.9216 11.9316 33.1208C11.9317 31.3202 13.4398 29.8259 15.3438 29.8259Z" 
        stroke="currentColor" 
        strokeWidth="1.4386"
      />
      <path 
        d="M16.3589 5.01904L16.4817 5.09314L15.4386 9.19128L18.4451 9.76898L13.782 16.0594L14.8864 11.3095L12.248 10.6676L16.3589 5.01904Z" 
        fill="currentColor"
      />
    </svg>
  );
}
