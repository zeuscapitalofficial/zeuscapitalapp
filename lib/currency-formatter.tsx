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

  const decimals = Math.abs(value) < 1 ? 4 : 2;

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

    return <span className="font-mono">{formatter.format(value)}</span>;
  } catch (error) {
    return <span className="font-mono">${Number(value).toFixed(2)}</span>;
  }
};

export default CurrencyFormatter;
