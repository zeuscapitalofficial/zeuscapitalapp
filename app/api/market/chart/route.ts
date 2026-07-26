import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Fallback data in case of API rate limit errors
const FALLBACK_DATA: Record<
  string,
  Record<string, { label: string; value: number }[]>
> = {
  bitcoin: {
    "1": [
      { label: "12:00 AM", value: 68100 },
      { label: "04:00 AM", value: 68300 },
      { label: "08:00 AM", value: 68050 },
      { label: "12:00 PM", value: 68400 },
      { label: "04:00 PM", value: 68600 },
      { label: "08:00 PM", value: 68520 },
    ],
    "7": [
      { label: "Mon", value: 67200 },
      { label: "Tue", value: 67800 },
      { label: "Wed", value: 68100 },
      { label: "Thu", value: 68450 },
      { label: "Fri", value: 68200 },
      { label: "Sat", value: 68800 },
      { label: "Sun", value: 68520 },
    ],
    "30": [
      { label: "Day 5", value: 65400 },
      { label: "Day 10", value: 66200 },
      { label: "Day 15", value: 67100 },
      { label: "Day 20", value: 66900 },
      { label: "Day 25", value: 67800 },
      { label: "Day 30", value: 68520 },
    ],
    "365": [
      { label: "Q1", value: 48000 },
      { label: "Q2", value: 62000 },
      { label: "Q3", value: 58000 },
      { label: "Q4", value: 68520 },
    ],
  },
  ethereum: {
    "1": [
      { label: "12:00 AM", value: 3410 },
      { label: "04:00 AM", value: 3430 },
      { label: "08:00 AM", value: 3390 },
      { label: "12:00 PM", value: 3450 },
      { label: "04:00 PM", value: 3480 },
      { label: "08:00 PM", value: 3450 },
    ],
    "7": [
      { label: "Mon", value: 3380 },
      { label: "Tue", value: 3410 },
      { label: "Wed", value: 3420 },
      { label: "Thu", value: 3490 },
      { label: "Fri", value: 3440 },
      { label: "Sat", value: 3460 },
      { label: "Sun", value: 3450 },
    ],
    "30": [
      { label: "Day 5", value: 3100 },
      { label: "Day 10", value: 3150 },
      { label: "Day 15", value: 3280 },
      { label: "Day 20", value: 3210 },
      { label: "Day 25", value: 3350 },
      { label: "Day 30", value: 3450 },
    ],
    "365": [
      { label: "Q1", value: 2400 },
      { label: "Q2", value: 3100 },
      { label: "Q3", value: 2900 },
      { label: "Q4", value: 3450 },
    ],
  },
  solana: {
    "1": [
      { label: "12:00 AM", value: 139 },
      { label: "04:00 AM", value: 141 },
      { label: "08:00 AM", value: 138 },
      { label: "12:00 PM", value: 143 },
      { label: "04:00 PM", value: 144 },
      { label: "08:00 PM", value: 142 },
    ],
    "7": [
      { label: "Mon", value: 132 },
      { label: "Tue", value: 135 },
      { label: "Wed", value: 139 },
      { label: "Thu", value: 144 },
      { label: "Fri", value: 141 },
      { label: "Sat", value: 143 },
      { label: "Sun", value: 142 },
    ],
    "30": [
      { label: "Day 5", value: 122 },
      { label: "Day 10", value: 128 },
      { label: "Day 15", value: 134 },
      { label: "Day 20", value: 131 },
      { label: "Day 25", value: 139 },
      { label: "Day 30", value: 142 },
    ],
    "365": [
      { label: "Q1", value: 85 },
      { label: "Q2", value: 120 },
      { label: "Q3", value: 110 },
      { label: "Q4", value: 142 },
    ],
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coinId = searchParams.get("coinId") || "bitcoin";
    const days = searchParams.get("days") || "30";

    const apiKey = process.env.COINGECKO_API_KEY;
    let chartData: { label: string; value: number }[] = [];

    if (!apiKey) {
      console.warn(
        "COINGECKO_API_KEY missing in server env, using fallback data.",
      );
      chartData = getFallbackData(coinId, days);
    } else {
      const url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
      const headers: Record<string, string> = {
        Accept: "application/json",
        "x-cg-demo-api-key": apiKey,
      };

      const res = await fetch(url, { headers, next: { revalidate: 300 } });

      if (!res.ok) {
        console.error(
          `CoinGecko API returned status ${res.status}. Loading fallback mock metrics.`,
        );
        chartData = getFallbackData(coinId, days);
      } else {
        const data = await res.json();
        if (!data.prices || !Array.isArray(data.prices)) {
          throw new Error("Invalid response format from CoinGecko");
        }

        const formattedData = data.prices.map(
          ([timestamp, value]: [number, number]) => {
            const date = new Date(timestamp);
            let label = "";

            if (days === "1") {
              label = date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              });
            } else if (days === "7" || days === "30") {
              label = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            } else {
              label = date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              });
            }

            return { label, value: Number(value.toFixed(2)) };
          },
        );

        chartData = sampleData(formattedData, 20);
      }
    }

    // Check if price override is active for this coin
    const override = await prisma.priceOverride.findUnique({
      where: { coinId },
    });

    if (override && override.isEnabled && chartData.length > 0) {
      // Modify the latest data point to match the manual price override
      chartData[chartData.length - 1].value = override.priceUsd;
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error in market chart API handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}

function getFallbackData(coinId: string, days: string) {
  const coinKey = coinId.toLowerCase();
  const daysKey = days;
  const coinSet = FALLBACK_DATA[coinKey] || FALLBACK_DATA.bitcoin;
  return coinSet[daysKey] || coinSet["30"];
}

function sampleData(
  data: { label: string; value: number }[],
  maxPoints: number,
) {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  const result = [];
  for (let i = 0; i < data.length; i += step) {
    result.push(data[i]);
  }
  if (result[result.length - 1] !== data[data.length - 1]) {
    result.push(data[data.length - 1]);
  }
  return result;
}
