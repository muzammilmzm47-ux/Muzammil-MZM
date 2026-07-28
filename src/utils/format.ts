import { CurrencyConfig } from '../types';

export function formatPrice(amountInUSD: number, currency: CurrencyConfig): string {
  const converted = amountInUSD * currency.rate;
  
  if (currency.code === 'JPY') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }
  
  if (currency.code === 'INR') {
    return `${currency.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }

  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateOrderId(): string {
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EV-${randomHex}`;
}

export function generateTrackingNumber(): string {
  return `ARM-${Math.floor(100000 + Math.random() * 900000)}-EV`;
}
