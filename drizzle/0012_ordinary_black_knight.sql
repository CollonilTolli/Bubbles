ALTER TABLE "coin_price_history" RENAME COLUMN "coin_id" TO "coinid";--> statement-breakpoint
ALTER TABLE "coin_price_history" DROP CONSTRAINT "coin_price_history_coin_id_coins_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coin_price_history" ADD CONSTRAINT "coin_price_history_coinid_coins_id_fk" FOREIGN KEY ("coinid") REFERENCES "public"."coins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
