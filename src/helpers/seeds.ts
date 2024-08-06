import { updateCoins } from "@/lib/db";

async function main() {
  try {
    await updateCoins();
    console.log("Coins saved successfully.");
    process.exit();
  } catch (err) {
    console.error("Error fetching or saving coins:", err);
  }
}

main();
