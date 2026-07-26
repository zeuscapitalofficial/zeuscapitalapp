"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface AreaChartProps {
  data: ChartDataPoint[];
  height?: number | string;
  strokeColor?: string;
  valueType?: "currency" | "number" | "hashrate";
}

export function DashboardAreaChart({
  data,
  height = 240,
  strokeColor = "#8B7CFF", // Indigo Accent
  valueType = "currency",
}: AreaChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatValue = (val: number) => {
    if (valueType === "hashrate") {
      return `${val.toFixed(1)} TH/s`;
    }
    if (valueType === "number") {
      return val.toLocaleString();
    }
    return `$${val.toLocaleString()}`;
  };

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] animate-pulse"
      >
        <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
          Loading charts...
        </span>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full font-sans select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.12} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="rgba(255,255,255,0.03)"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.48)", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.48)", fontSize: 11 }}
            tickFormatter={formatValue}
            width={75}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#17171B] border border-[rgba(255,255,255,0.06)] p-[12px] rounded-[14px] shadow-lg backdrop-blur-md">
                    <p className="text-[10px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider mb-[4px]">
                      {payload[0].payload.label}
                    </p>
                    <p className="text-[15px] font-semibold text-white tracking-tight">
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
            fill="url(#dashboardGradient)"
            activeDot={{
              r: 4,
              stroke: "#09090B",
              strokeWidth: 2,
              fill: strokeColor,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Custom Styled Allocation Pie Chart
export interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

export function DashboardPieChart({
  data,
  height = 200,
}: {
  data: PieDataPoint[];
  height?: number | string;
}) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] animate-pulse"
      >
        <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
          Loading allocation...
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ height }}
      className="w-full flex items-center justify-center font-sans select-none"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(9,9,11,0.8)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#17171B] border border-[rgba(255,255,255,0.06)] p-[10px] rounded-[12px] shadow-md">
                    <p className="text-[11px] font-semibold text-[rgba(255,255,255,0.48)] mb-[2px]">
                      {payload[0].name}
                    </p>
                    <p className="text-[14px] font-semibold text-white">
                      {payload[0].value}% Allocation
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
