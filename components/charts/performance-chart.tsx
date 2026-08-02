"use client";

import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDate } from "@/components/formatter";
import { useEffect, useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

/** One row per day: ISO `date`, `btc` / `eth` = crypto performance values ($). */
type CryptoChartRow = {
  date: string;
  btc: number;
  eth: number;
};

const chartConfig = {
  btc: {
    label: "Bitcoin",
    color: "var(--chart-2)",
  },
  eth: {
    label: "Ethereum",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function parseChartDay(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

function rowTotal(row: CryptoChartRow) {
  return row.btc + row.eth;
}

const animationConfig = {
  glowWidth: 520,
};

function highlightXFromChartMouseEvent(e: unknown): number | null {
  const ex = e as {
    activeCoordinate?: { x?: number; y?: number };
    chartX?: number;
  };
  const fromActive = ex.activeCoordinate?.x;
  if (typeof fromActive === "number" && Number.isFinite(fromActive)) {
    return fromActive;
  }
  const legacy = ex.chartX;
  if (typeof legacy === "number" && Number.isFinite(legacy)) {
    return legacy;
  }
  return null;
}

export function PerformanceChart() {
  const chartUid = useId().replace(/:/g, "");

  const idMaskGrad = `sales-chart-mask-grad-${chartUid}`;
  const idMask = `sales-chart-highlight-mask-${chartUid}`;

  const [chartData, setChartData] = useState<CryptoChartRow[]>([]);
  const [xAxis, setXAxis] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/crypto");

        if (!res.ok) {
          throw new Error("Failed to fetch crypto data");
        }

        const data: CryptoChartRow[] = await res.json();
        setChartData(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  const chartRows = chartData;

  const growthPctNum = useMemo(() => {
    const first = chartRows[0];
    if (!first) {
      return 0;
    }
    const last = chartRows.at(-1);
    if (!last) {
      return 0;
    }
    const a = rowTotal(first);
    const b = rowTotal(last);
    if (!a) {
      return 0;
    }
    return ((b - a) / a) * 100;
  }, [chartRows]);

  const xAxisMinTickGap = 32;

  const idGradBTC = `sales-chart-grad-online-${chartUid}`;
  const idGradETH = `sales-chart-grad-retail-${chartUid}`;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="">Crypto Prices</CardTitle>
              <Delta value={growthPctNum} variant="badge">
                <DeltaIcon variant="trend" />
                <DeltaValue />
              </Delta>
            </div>
            <CardDescription>
              Bitcoin and Ethereum performance over the last 30 days.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-21/9 min-h-48 w-full p-0"
          config={chartConfig}
        >
          <AreaChart
            // accessibilityLayer
            data={chartRows}
            margin={{
              left: 4,
              right: 12,
              top: 8,
            }}
            onMouseLeave={() => setXAxis(null)}
            onMouseMove={(e) => setXAxis(highlightXFromChartMouseEvent(e))}
          >
            <CartesianGrid
              className="stroke-border"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="date"
              interval="preserveStartEnd"
              minTickGap={xAxisMinTickGap}
              tickFormatter={(value) => formatDate(String(value), "day-month")}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />

            <defs>
              <linearGradient id={idMaskGrad} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="28%" stopColor="white" stopOpacity={0.55} />
                <stop offset="50%" stopColor="white" />
                <stop offset="72%" stopColor="white" stopOpacity={0.55} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id={idGradBTC} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-btc)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-btc)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id={idGradETH} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-eth)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-eth)"
                  stopOpacity={0}
                />
              </linearGradient>
              {typeof xAxis === "number" && Number.isFinite(xAxis) ? (
                <mask id={idMask}>
                  <rect
                    fill={`url(#${idMaskGrad})`}
                    height="100%"
                    width={animationConfig.glowWidth}
                    x={xAxis - animationConfig.glowWidth / 2}
                    y={0}
                  />
                </mask>
              ) : null}
            </defs>
            <Area
              dataKey="btc"
              fill={`url(#${idGradBTC})`}
              fillOpacity={0.4}
              mask={`url(#${idMask})`}
              stroke="var(--color-btc)"
              strokeWidth={0.8}
              type="linear"
            />
            <Area
              dataKey="eth"
              fill={`url(#${idGradETH})`}
              fillOpacity={0.4}
              mask={`url(#${idMask})`}
              stroke="var(--color-eth)"
              strokeWidth={0.8}
              type="linear"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
