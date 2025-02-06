import type React from "react"
import { cn } from "@/lib/utils"

/**
 * Skeleton component that renders a div with a pulsing animation.
 * 
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the div element.
 * @param {string} props.className - Additional class names to apply to the div element.
 * 
 * @returns {JSX.Element} A div element with a pulsing animation and rounded corners.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

export { Skeleton }

