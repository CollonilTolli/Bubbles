import {
  pgTableCreator,
  text,
  integer,
  timestamp,
  jsonb
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `${name}`);

export const coins = pgTable("coins", {
  id: text("id").primaryKey(),
  symbol: text("symbol"),
  name: text("name"),
  image: text("image"),
  current_price: integer("current_price"), // No need to convert to string
  market_cap: integer("market_cap"), // No need to convert to string
  market_cap_rank: integer("market_cap_rank"), // No need to convert to string
  fully_diluted_valuation: integer("fully_diluted_valuation"), // No need to convert to string
  total_volume: integer("total_volume"), // No need to convert to string
  high_24h: integer("high_24h"), // No need to convert to string
  low_24h: integer("low_24h"), // No need to convert to string
  price_change_24h: integer("price_change_24h"), // No need to convert to string
  price_change_percentage_24h: integer("price_change_percentage_24h"), // No need to convert to string
  market_cap_change_24h: integer("market_cap_change_24h"), // No need to convert to string
  market_cap_change_percentage_24h: integer("market_cap_change_percentage_24h"), // No need to convert to string
  circulating_supply: integer("circulating_supply"), // No need to convert to string
  total_supply: integer("total_supply"), // No need to convert to string
  max_supply: integer("max_supply"), // No need to convert to string
  ath: integer("ath"), // No need to convert to string
  ath_change_percentage: integer("ath_change_percentage"), // No need to convert to string
  ath_date: timestamp("ath_date"), // No need to convert to string
  atl: integer("atl"), // No need to convert to string
  atl_change_percentage: integer("atl_change_percentage"), // No need to convert to string
  atl_date: timestamp("atl_date"), // No need to convert to string
  // roi_times: integer("roi_times"),
  // roi_currency: text("roi_currency"),
  // roi_percentage: integer("roi_percentage"),
  last_updated: timestamp("last_updated"), // No need to convert to string
  price_history: jsonb("price_history").default([])
});
