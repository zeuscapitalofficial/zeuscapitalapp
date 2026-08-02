import { NextResponse } from "next/server";

export async function GET() {
  const headers = {
    "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,
  };

  const [btcRes, ethRes] = await Promise.all([
    fetch(
      "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30&interval=daily",
      {
        headers,
        next: { revalidate: 300 },
      }
    ),
    fetch(
      "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily",
      {
        headers,
        next: { revalidate: 300 },
      }
    ),
  ]);

  if (!btcRes.ok || !ethRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch crypto data" },
      { status: 500 }
    );
  }

  const btc = await btcRes.json();
  const eth = await ethRes.json();

  const ethMap = new Map<string, number>();

  for (const [timestamp, price] of eth.prices) {
    const date = new Date(timestamp).toISOString().split("T")[0];
    ethMap.set(date, price);
  }

  const data = btc.prices
    .map(([timestamp, price]: [number, number]) => {
      const date = new Date(timestamp).toISOString().split("T")[0];

      return {
        date,
        btc: price,
        eth: ethMap.get(date),
      };
    })
    .filter((item: { date: string; btc: number; eth: number | undefined }) => item.eth !== undefined);

  const first = data[0];

  if (!first) {
    return NextResponse.json([]);
  }

  const normalized = data.map((item: { date: string; btc: number; eth: number | undefined }) => ({
    date: item.date,
    btc: (item.btc / first.btc) * 100,
    eth: ((item.eth as number) / (first.eth as number)) * 100,
  }));

  return NextResponse.json(normalized);
}