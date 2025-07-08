import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function generateProductId(): string {
  return `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validateProductId(id: string): boolean {
  return /^PROD-\d+-[a-z0-9]{9}$/.test(id);
}

export async function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // Mock implementation - in production, use a real geocoding service
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}