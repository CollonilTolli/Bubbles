import type { NewCoin } from '@/lib/db';
import axios from 'axios';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { updateCoins } from '@/lib/db';
import { coins } from '@/lib/schema';

const MockCoin: NewCoin = {
  id: "MockCoin",
  symbol: "MockCoin",
  name: "MockCoin",
  image: "https://coin-images.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png?1696514180",
  current_price: 8,
  market_cap: 4134747641,
  market_cap_rank: 28,
  fully_diluted_valuation: 4614338833,
  total_volume: 75678003,
  high_24h: 9,
  low_24h: 8,
  price_change_24h: 0,
  price_change_percentage_24h: -2,
  market_cap_change_24h: -110769768,
  market_cap_change_percentage_24h: -2,
  circulating_supply: 467187766,
  total_supply: 521377080,
  max_supply: null,
  ath: 700,
  ath_change_percentage: -98,
  ath_date: new Date("2024-07-30T20:04:33.387Z"),
  atl: 2,
  atl_change_percentage: 209,
  atl_date: new Date("2024-07-30T20:04:33.387Z"),
  last_updated: new Date("2024-07-30T20:04:33.387Z"),
  price_history: [
    8.83,
    8.83,
    8.83,
    9.07,
    9.07,
    9.02,
    9.05,
    9.05,
    9.05,
    9.05
  ]
}
const mockCoins = {
  result: [
    MockCoin
  ],
  totalPages: 10,
  totalRecords: 100
}
jest.mock('axios');
const mockResponse = { data: mockCoins };
axios.get.mockResolvedValue(mockResponse);

// Имитация DrizzleORM клиента
jest.mock('drizzle-orm');
const mockDrizzleClient = {
  select: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue([]),
      }),
    }),
  })),
  update: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({}),
    }),
  })),
  insert: jest.fn().mockImplementation(() => ({
    values: jest.fn().mockResolvedValue({}),
  })),
};
drizzle.mockReturnValue(mockDrizzleClient);

jest.mock('./dbFields');
const dbFields = require('./dbFields');

describe('updateCoins', () => {
  it('должна обновить существующие монеты и добавить новые', async () => {
    mockDrizzleClient.select().from(coins).where().limit.mockReturnValueOnce([
      { name: 'Stellar' },
    ]);

    const result = await updateCoins();

    expect(mockDrizzleClient.update).toHaveBeenCalledTimes(1);
    expect(mockDrizzleClient.insert).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ success: true });

    expect(console.log).toHaveBeenCalledWith("Coins updated successfully");
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});