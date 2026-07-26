"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface PerformanceChartProps {
  data: ChartDataPoint[];
  height?: number | string;
  strokeColor?: string;
  fillColor?: string;
  valueType?: "currency" | "btc";
}

export function PerformanceChart({
  data,
  height = 350,
  strokeColor = "#000000",
  fillColor = "rgba(0, 0, 0, 0.03)",
  valueType = "currency",
}: PerformanceChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  const formatValue = (val: number) => {
    if (valueType === "btc") {
      return `${val.toLocaleString()} BTC`;
    }
    return `$${val.toLocaleString()}`;
  };

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.06)] rounded-card-custom animate-pulse"
      >
        <span className="text-[13px] text-[rgba(0,0,0,0.4)] font-medium">
          Loading analytics...
        </span>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full font-sans select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.08} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="rgba(0,0,0,0.04)"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 11 }}
            tickFormatter={formatValue}
            width={70}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-[rgba(0,0,0,0.08)] p-[13px] rounded-input-custom shadow-md backdrop-blur-md">
                    <p className="text-[11px] font-semibold text-[rgba(0,0,0,0.4)] uppercase tracking-wider mb-[3px]">
                      {payload[0].payload.label}
                    </p>
                    <p className="text-[16px] font-bold text-[#000000] tracking-tight">
                      {formatValue(payload[0].value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill="url(#chartGradient)"
            activeDot={{
              r: 5,
              stroke: "#FFFFFF",
              strokeWidth: 2,
              fill: strokeColor,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
