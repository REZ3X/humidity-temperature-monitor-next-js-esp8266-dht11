import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string.
 *
 * This function merges class names using `clsx` and `twMerge` to ensure that
 * Tailwind CSS classes are combined correctly and efficiently.
 *
 * @param inputs - An array of class values that can be strings, arrays, or objects.
 * @returns A single string with all the combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}