import { NewCoin, dbFields, insertCoin } from "@/lib/db";
import axios from "axios";

async function updateCoins(coin: NewCoin) {
  try {
    const res = await insertCoin(await dbFields(coin));
    console.log("insert coin success", res);
    console.log(`Coin ${coin.symbol} saved successfully.`);
    return "insert coin Success"
  } catch (error) {
    console.error(`Error saving coin ${coin.symbol}: `, error);
    return "insert coin Error"
  }
}


const options = {
  headers: {
    accept: "application/json",
    "x-cg-pro-api-key": "CG-7wE4bZ5gZwza5kpP8MYBkdRi ",
  },
};

async function main() {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        ...options,
        params: {
          vs_currency: "usd",
        },
      }
    );

    for (const element of data) {
      await updateCoins(element);
    }

    console.log("Coins saved successfully.");
    process.exit();
  } catch (err) {
    console.error("Error fetching or saving coins:", err);
  }
}

main();
