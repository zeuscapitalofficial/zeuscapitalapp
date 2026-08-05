"use client";

import React, { useEffect, useState } from "react";

interface CurrencyFormatterProps {
  value: number | undefined | null;
  currency?: string;
  locale?: string;
}

export const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
  value,
  currency = "USD",
  locale = "en-US",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (value === undefined || value === null || isNaN(value)) {
    return <span>—</span>;
  }

  // --- THE FIX: DETECT AND SCALE PRE-DIVIDED BILLIONS ---
  // If your value is 1234.56 but represents trillions, it means the API sent it divided by 1 Billion.
  // We inflate it back to its true representation so Intl handles 'T' correctly.
  let normalizedValue = value;
  if (value >= 1000 && value < 1000000) {
    // Assumptions: A value like 1234.56 means 1.23T, so we scale it by 1 Billion (1e9)
    normalizedValue = value * 1e9;
  }

  // Set fractional decimals based on true value depth
  const decimals = Math.abs(normalizedValue) < 1 ? 4 : 2;
  const maxDecimals = Math.max(decimals, 2);

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: decimals,
      maximumFractionDigits: maxDecimals,
    });

    if (!isMounted) {
      return <span className="font-mono">...</span>;
    }

    return <span className="font-mono">{formatter.format(normalizedValue)}</span>;
  } catch (error) {
    return <span className="font-mono">${Number(normalizedValue).toFixed(2)}</span>;
  }
};

export default CurrencyFormatter;
