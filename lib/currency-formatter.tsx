import React from "react";

interface CurrencyFormatterProps {
  /** The numeric value to format */
  value: number | undefined | null;
  /** Optional currency code, defaults to 'USD' */
  currency?: string;
  /** Optional locale, defaults to system/browser locale */
  locale?: string;
}

export const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
  value,
  currency = "USD",
  locale = undefined, // defaults to browser environment locale
}) => {
  // Guard clause for missing values
  if (value === undefined || value === null || isNaN(value)) {
    return <span>—</span>;
  }

  // Set fractional decimals based on value depth
  const decimals = Math.abs(value) < 1 ? 4 : 2;

  // Use native Intl engine optimized for compact notations (K, M, B, T)
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2, // Keeps it tight (e.g., 1.23T instead of 1.2345T)
  });

  return <span className="font-mono">{formatter.format(value)}</span>;
};

export default CurrencyFormatter;
