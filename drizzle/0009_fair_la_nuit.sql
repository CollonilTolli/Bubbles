CREATE TABLE IF NOT EXISTS "coin_price_history" (
	"id" integer PRIMARY KEY NOT NULL,
	"coin_id" integer,
	"price" integer,
	"timestamp" timestamp
);
--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "current_price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "market_cap" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "market_cap_rank" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "fully_diluted_valuation" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "total_volume" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "high_24h" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "low_24h" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "price_change_24h" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "price_change_percentage_24h" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "market_cap_change_24h" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "market_cap_change_percentage_24h" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "circulating_supply" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "total_supply" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "max_supply" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "ath" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "ath_change_percentage" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "atl" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "coins" ALTER COLUMN "atl_change_percentage" SET DATA TYPE numeric;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coin_price_history" ADD CONSTRAINT "coin_price_history_coin_id_coins_id_fk" FOREIGN KEY ("coin_id") REFERENCES "public"."coins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "coins" DROP COLUMN IF EXISTS "price_history";