import { useState, useEffect } from 'react';
import { CURRENCIES } from '@/utils/currencies';

const STORAGE_KEY = 'galaxy_wheel_currency';

export function CurrencyDropdown({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [selected, setSelected] = useState(value || 'USD');

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelected(code);
    localStorage.setItem(STORAGE_KEY, code);
    onChange(code);
  };

  return (
    <select
      className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors shadow"
      value={selected}
      onChange={handleChange}
      style={{ minWidth: 120 }}
    >
      {CURRENCIES.map((cur) => (
        <option key={cur.code} value={cur.code}>
          {cur.symbol} {cur.code} — {cur.name}
        </option>
      ))}
    </select>
  );
} 