import {
  pgTableCreator,
  text,
  decimal,
  timestamp,
  integer
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `${name}`);

export const coins = pgTable("coins", {
  id: text("id").primaryKey(),
  symbol: text("symbol"),
  name: text("name"),
  image: text("image"),
  current_price: decimal("current_price"),
  market_cap: decimal("market_cap"),
  market_cap_rank: decimal("market_cap_rank"),
  fully_diluted_valuation: decimal("fully_diluted_valuation"),
  total_volume: decimal("total_volume"),
  high_24h: decimal("high_24h"),
  low_24h: decimal("low_24h"),
  price_change_24h: decimal("price_change_24h"),
  price_change_percentage_24h: decimal("price_change_percentage_24h"),
  market_cap_change_24h: decimal("market_cap_change_24h"),
  market_cap_change_percentage_24h: decimal("market_cap_change_percentage_24h"),
  circulating_supply: decimal("circulating_supply"),
  total_supply: decimal("total_supply"),
  max_supply: decimal("max_supply"),
  ath: decimal("ath"),
  ath_change_percentage: decimal("ath_change_percentage"),
  ath_date: timestamp("ath_date"),
  atl: decimal("atl"),
  atl_change_percentage: decimal("atl_change_percentage"),
  atl_date: timestamp("atl_date"),
  last_updated: timestamp("last_updated"),
});

export const coinPriceHistory = pgTable("coin_price_history", {
  id: integer("id").primaryKey(),
  coinid: text("coinid").references(() => coins.id),
  price: decimal("price"),
  timestamp: timestamp("timestamp"),
});