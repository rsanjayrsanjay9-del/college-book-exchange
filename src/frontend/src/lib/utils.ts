import type { User } from "@/backend";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function isAdmin(user: User | null | undefined): boolean {
  return user?.isAdmin ?? false;
}
