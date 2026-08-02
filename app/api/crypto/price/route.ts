import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing coin id" }, { status: 400 });
  }

  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        ...(apiKey ? { "x-cg-demo-api-key": apiKey } : {}),
      },
      next: { revalidate: 60 }, // cache for 60s
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch price" }, { status: 502 });
    }

    const data = await res.json();
    const price = data?.[id]?.usd ?? null;

    return NextResponse.json({ price, id });
  } catch (error) {
    console.error("CoinGecko price fetch failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
