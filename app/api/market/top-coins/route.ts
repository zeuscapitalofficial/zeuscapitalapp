import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const FALLBACK_COINS = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 68520.0,
    price_change_percentage_24h: 2.41,
    market_cap: 1345000000000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3450.0,
    price_change_percentage_24h: -0.82,
    market_cap: 414000000000,
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "bnb",
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 580.0,
    price_change_percentage_24h: 1.25,
    market_cap: 89000000000,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 142.0,
    price_change_percentage_24h: 4.78,
    market_cap: 66000000000,
  },
  {
    id: "ripple",
    name: "Ripple",
    symbol: "xrp",
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.58,
    price_change_percentage_24h: -0.32,
    market_cap: 32000000000,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ada",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.38,
    price_change_percentage_24h: -1.15,
    market_cap: 13000000000,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "doge",
    image: "https://assets.coingecko.com/coins/images/75/large/dogecoin.png",
    current_price: 0.12,
    price_change_percentage_24h: 0.48,
    market_cap: 17000000000,
  },
  {
    id: "shiba-inu",
    name: "Shiba Inu",
    symbol: "shib",
    image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    current_price: 0.000017,
    price_change_percentage_24h: -2.35,
    market_cap: 10000000000,
  },
  {
    id: "toncoin",
    name: "Toncoin",
    symbol: "ton",
    image:
      "https://assets.coingecko.com/coins/images/17980/large/ton_token_blue.png",
    current_price: 7.2,
    price_change_percentage_24h: 3.12,
    market_cap: 18000000000,
  },
  {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "avax",
    image:
      "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 28.5,
    price_change_percentage_24h: 1.92,
    market_cap: 11000000000,
  },
];

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    let coins = FALLBACK_COINS;

    if (apiKey) {
      const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`;
      const headers: Record<string, string> = {
        Accept: "application/json",
        "x-cg-demo-api-key": apiKey,
      };

      const res = await fetch(url, { headers, next: { revalidate: 300 } });
      if (res.ok) {
        coins = await res.json();
      } else {
        console.error(
          `CoinGecko markets API returned status ${res.status}. Loading fallback mock top coins.`,
        );
      }
    } else {
      console.warn(
        "COINGECKO_API_KEY missing in server env, using top-coins fallback data.",
      );
    }

    // Fetch database price overrides
    const overrides = await prisma.priceOverride.findMany({
      where: { isEnabled: true },
    });

    const overrideMap = new Map(overrides.map((o) => [o.coinId, o.priceUsd]));

    // Map overrides to output array
    const mappedCoins = coins.map((coin: any) => {
      const overridePrice = overrideMap.get(coin.id);
      if (overridePrice !== undefined) {
        return {
          ...coin,
          current_price: overridePrice,
          // Set percentage 24h change to a placeholder or keep live indicator if desired
        };
      }
      return coin;
    });

    return NextResponse.json(mappedCoins);
  } catch (error) {
    console.error("Error in top coins API handler:", error);
    return NextResponse.json(FALLBACK_COINS);
  }
}
