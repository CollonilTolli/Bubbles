CREATE TABLE IF NOT EXISTS "coins" (
	"id" text PRIMARY KEY NOT NULL,
	"symbol" text,
	"name" text,
	"image" text,
	"current_price" numeric,
	"market_cap" numeric,
	"market_cap_rank" integer,
	"fully_diluted_valuation" numeric,
	"total_volume" numeric,
	"high_24h" numeric,
	"low_24h" numeric,
	"price_change_24h" numeric,
	"price_change_percentage_24h" numeric,
	"market_cap_change_24h" numeric,
	"market_cap_change_percentage_24h" numeric,
	"circulating_supply" numeric,
	"total_supply" numeric,
	"max_supply" numeric,
	"ath" numeric,
	"ath_change_percentage" numeric,
	"ath_date" timestamp,
	"atl" numeric,
	"atl_change_percentage" numeric,
	"atl_date" timestamp,
	"roi" numeric,
	"last_updated" timestamp,
	"price_hour" numeric,
	"price_six_hour" numeric,
	"price_day" numeric,
	"price_week" numeric,
	"price_month" numeric
);
--> statement-breakpoint
DROP TABLE "_all_coins";