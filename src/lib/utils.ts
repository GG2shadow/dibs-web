import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function extractStoragePath(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').slice(3).join('/');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters
    .replace(/[\s_-]+/g, '-') // collapse whitespace/dashes
    .replace(/^-+|-+$/g, ''); // trim starting/ending dashes
}
