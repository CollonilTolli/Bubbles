import "@/lib/config";
import { eq, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { coins } from "./schema";
import * as schema from "./schema";
import axios from 'axios';

export const db = drizzle(sql, { schema });

type Coin = typeof coins.$inferInsert;

export interface NewCoin extends Omit<Coin, 'price_history'> {
  price_history: number[]
}

export const countCoins = async () => {
  const countCoins = await db.select({ count: count() }).from(coins);
  return countCoins[0].count;
};


export const getCoins = async (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;
  const selectResult = await db.select().from(coins).offset(offset).limit(pageSize);
  return selectResult;
};


export const insertCoin = async (coin: NewCoin) => {
  return db.insert(coins).values(coin).returning();
};
export const dbFields = async (coin: NewCoin) => {
  let athDate: Date | undefined = undefined;
  if (coin.ath_date) {
    athDate = new Date(coin.ath_date);
  }

  let atlDate: Date | undefined = undefined;
  if (coin.atl_date) {
    atlDate = new Date(coin.atl_date);
  }
  // @ts-ignore
  const currentHistory: any = await db.select().from(coins).where(eq(coins.name, coin.name));
  const priceHistory = []
  if (coin.current_price && currentHistory.length > 0) {
    priceHistory.unshift(coin.current_price, ...(currentHistory[0].price_history));
  }

  const lastDate = coin.last_updated ? new Date(coin.last_updated) : new Date();

  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    market_cap_rank: coin.market_cap_rank,
    fully_diluted_valuation: coin.fully_diluted_valuation,
    total_volume: coin.total_volume,
    high_24h: coin.high_24h,
    low_24h: coin.low_24h,
    price_change_24h: coin.price_change_24h,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    market_cap_change_24h: coin.market_cap_change_24h,
    market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
    circulating_supply: coin.circulating_supply,
    total_supply: coin.total_supply,
    max_supply: coin.max_supply,
    ath: coin.ath,
    ath_change_percentage: coin.ath_change_percentage,
    ath_date: athDate,
    atl: coin.atl,
    atl_change_percentage: coin.atl_change_percentage,
    atl_date: atlDate,

    last_updated: lastDate,
    price_history: priceHistory
  }
};

export const deleteCoins = async () => {
  try {
    await db.delete(coins);
    return { message: 'Таблица успешно удалена' };
  } catch (error) {
    return { error: 'Ошибка при удалении таблицы' };
  }
};


export async function updateCoins() {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
        },
      }
    );

    for (const coin of data) {
      if (coin.current_price && coin.market_cap_rank) {

        const existingCoin = await db.select().from(coins).where(eq(coins.name, coin.name)).limit(1);
        if (existingCoin.length > 0) {
          try {
            await db.update(coins)
              .set(await dbFields(coin))
              .where(eq(coins.name, coin.name));
          } catch {
            console.log(coin);
          }
        } else {
          try {

            await db.insert(coins).values(await dbFields(coin));
          } catch {
            console.log(coin);
          }
        }
      } else {
        console.warn(`Skipping coin ${coin.name} due to missing numeric values`);
      }
    }

    console.log("Coins updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Error updating coins:", error);
    return { error: "Error updating coins" };
  }
}
