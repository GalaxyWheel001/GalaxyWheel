export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, updated: '2024-06-01' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, updated: '2024-06-01' },
  { code: 'RUB', symbol: '₽', name: 'Российский рубль', rate: 89.5, updated: '2024-06-01' },
  { code: 'UAH', symbol: '₴', name: 'Украинская гривна', rate: 39.2, updated: '2024-06-01' },
  { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге', rate: 450, updated: '2024-06-01' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.2, updated: '2024-06-01' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat', rate: 1.7, updated: '2024-07-28' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.1, updated: '2024-06-01' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 156, updated: '2024-06-01' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1370, updated: '2024-06-01' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 32.2, updated: '2024-06-01' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5, updated: '2024-06-01' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', rate: 4.0, updated: '2024-06-01' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', rate: 22.8, updated: '2024-06-01' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', rate: 355, updated: '2024-06-01' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', rate: 1.8, updated: '2024-06-01' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', rate: 4.6, updated: '2024-06-01' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 16200, updated: '2024-06-01' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 36.5, updated: '2024-06-01' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 25500, updated: '2024-06-01' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.7, updated: '2024-06-01' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 58.2, updated: '2024-06-01' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', rate: 3.7, updated: '2024-06-01' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 3.75, updated: '2024-06-01' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.5, updated: '2024-06-01' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1480, updated: '2024-06-01' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', rate: 47.5, updated: '2024-06-01' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', rate: 17.2, updated: '2024-06-01' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 10.5, updated: '2024-06-01' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 10.7, updated: '2024-06-01' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', rate: 6.8, updated: '2024-06-01' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.89, updated: '2024-06-01' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, updated: '2024-06-01' }
];

export function getCurrencyRate(code: string): number {
  return CURRENCIES.find(c => c.code === code)?.rate || 1;
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol || '$';
} 