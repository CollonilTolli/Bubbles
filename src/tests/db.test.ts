import { db, getCoins, insertCoin, dbFields } from '@/lib/db';
import { coins } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { NewCoin } from '@/lib/db';

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
// Имитация данных
const mockCoins = [
  MockCoin
];



describe('getCoins', () => {
  beforeEach(() => {
    jest.spyOn(db, 'select').mockImplementation(() => ({
      from: jest.fn().mockReturnValue({
        offset: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(mockCoins),
        }),
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должна возвращать правильные монеты для заданной страницы и размера страницы', async () => {
    const page = 2;
    const pageSize = 2;
    const expectedCoins = mockCoins.slice(2, 4);

    const result = await getCoins(page, pageSize);

    expect(result).toEqual(expectedCoins);
    expect(db.select).toHaveBeenCalled();
    expect(db.select().from(coins)).toHaveBeenCalled();
    expect(db.select().from(coins).offset(2)).toHaveBeenCalled();
    expect(db.select().from(coins).offset(2).limit(2)).toHaveBeenCalled();
  });

  it('должна возвращать пустой массив, если монеты не найдены', async () => {
    jest.spyOn(db, 'select').mockImplementation(() => ({
      from: jest.fn().mockReturnValue({
        offset: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue([]),
        }),
      }),
    }));

    const page = 1;
    const pageSize = 10;

    const result = await getCoins(page, pageSize);

    expect(result).toEqual([]);
  });
});

describe('insertCoin', () => {
  const mockNewCoin: NewCoin = {
    id: 'stellar',
    symbol: 'xlm',
    name: 'Stellar',
    image: 'https://coin-images.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png?1696501482',
    current_price: 0,
    market_cap: 3003913549,
    market_cap_rank: 32,
    fully_diluted_valuation: 5117856684,
    total_volume: 86774038,
    high_24h: 0,
    low_24h: 0,
    price_change_24h: 0,
    price_change_percentage_24h: 2,
    market_cap_change_24h: 65229287,
    market_cap_change_percentage_24h: 2,
    circulating_supply: 29348427401,
    total_supply: 50001786959,
    max_supply: 50001786959,
    ath: 0,
    ath_change_percentage: -88,
    ath_date: new Date('2018-01-03T00:00:00.000Z'),
    atl: 0,
    atl_change_percentage: 21383,
    atl_date: new Date('2015-03-05T00:00:00.000Z'),
    last_updated: new Date('2024-07-30T20:04:46.151Z'),
    price_history: [
      0.102194,
      0.102194,
      0.102194,
      0.103276,
      0.10001,
      0.099563,
      0.099907,
      0.099907,
      0.099907,
      0.099861
    ]
  };
  beforeEach(() => {
    jest.spyOn(db, 'insert').mockImplementation(() => ({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([mockNewCoin]),
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должна вставить новую монету в базу данных', async () => {
    const result = await insertCoin(mockNewCoin);
    expect(result).toEqual([mockNewCoin]);
    expect(db.insert).toHaveBeenCalled();
    expect(db.insert(coins)).toHaveBeenCalled();
    expect(db.insert(coins).values(mockNewCoin)).toHaveBeenCalled();
    expect(db.insert(coins).values(mockNewCoin).returning()).toHaveBeenCalled();
  });
});

describe('dbFields', () => {
  const mockCoin: NewCoin = {
    id: 'stellar',
    symbol: 'xlm',
    name: 'Stellar',
    image: 'https://coin-images.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png?1696501482',
    current_price: 0,
    market_cap: 3003913549,
    market_cap_rank: 32,
    fully_diluted_valuation: 5117856684,
    total_volume: 86774038,
    high_24h: 0,
    low_24h: 0,
    price_change_24h: 0,
    price_change_percentage_24h: 2,
    market_cap_change_24h: 65229287,
    market_cap_change_percentage_24h: 2,
    circulating_supply: 29348427401,
    total_supply: 50001786959,
    max_supply: 50001786959,
    ath: 0,
    ath_change_percentage: -88,
    ath_date: new Date("2024-07-30T20:04:33.387Z"),
    atl: 0,
    atl_change_percentage: 21383,
    atl_date: new Date("2024-07-30T20:04:33.387Z"),
    last_updated: new Date("2024-07-30T20:04:33.387Z"),
    price_history: [
      0.102194,
      0.102194,
      0.102194,
      0.103276,
      0.10001,
      0.099563,
      0.099907,
      0.099907,
      0.099907,
      0.099861
    ]
  };
  const mockExistingCoin = {
    name: 'Stellar',
    price_history: [
      0.102194,
      0.102194,
      0.102194,
      0.103276,
      0.10001,
      0.099563,
      0.099907,
      0.099907,
      0.099907,
      0.099861
    ]
  }

  beforeEach(() => {
    jest.spyOn(db, 'select').mockImplementation(() => ({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue([mockExistingCoin]),
        }),
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должна подготовить данные о монете для вставки в базу данных', async () => {
    const result = await dbFields(mockCoin);

    expect(result).toEqual({
      id: 'stellar',
      symbol: 'xlm',
      name: 'Stellar',
      image: 'https://coin-images.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png?1696501482',
      current_price: 0,
      market_cap: 3003913549,
      market_cap_rank: 32,
      fully_diluted_valuation: 5117856684,
      total_volume: 86774038,
      high_24h: 0,
      low_24h: 0,
      price_change_24h: 0,
      price_change_percentage_24h: 2,
      market_cap_change_24h: 65229287,
      market_cap_change_percentage_24h: 2,
      circulating_supply: 29348427401,
      total_supply: 50001786959,
      max_supply: 50001786959,
      ath: 0,
      ath_change_percentage: -88,
      ath_date: new Date('2018-01-03T00:00:00.000Z'),
      atl: 0,
      atl_change_percentage: 21383,
      atl_date: new Date('2015-03-05T00:00:00.000Z'),
      last_updated: new Date('2024-07-30T20:04:46.151Z'),
      price_history: [
        0,
        0.102194,
        0.102194,
        0.102194,
        0.103276,
        0.10001,
        0.099563,
        0.099907,
        0.099907,
        0.099907,
        0.099861
      ]
    });

    expect(db.select).toHaveBeenCalled();
    expect(db.select().from(coins)).toHaveBeenCalled();
    expect(db.select().from(coins).where(eq(coins.name, 'Stellar'))).toHaveBeenCalled();
  });

  it('должна корректно обрабатывать даты', async () => {
    const mockCoinWithDates: NewCoin = {
      ...mockCoin,
      ath_date: new Date("2024-07-30T20:04:33.387Z"),
      atl_date: new Date("2024-07-30T20:04:33.387Z"),
    };
    const result = await dbFields(mockCoinWithDates);

    expect(result.ath_date).toEqual(new Date('2023-08-10T12:00:00.000Z'));
    expect(result.atl_date).toEqual(new Date('2022-01-15T18:30:00.000Z'));
  });

  it('должна корректно обрабатывать отсутствующие даты', async () => {
    const mockCoinWithoutDates: NewCoin = {
      ...mockCoin,
      ath_date: undefined,
      atl_date: undefined,
    };
    const result = await dbFields(mockCoinWithoutDates);

    expect(result.ath_date).toEqual(undefined);
    expect(result.atl_date).toEqual(undefined);
  });
});
