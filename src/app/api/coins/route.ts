import { NextResponse } from "next/server"
import { getCoins, deleteCoins, countCoins } from '@/lib/db';

export async function GET(request: any) {
  const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
  const pageSize = parseInt(request.nextUrl.searchParams.get('page_size')) || 10;

  const [res, totalRecords] = await Promise.all([
    getCoins(page, pageSize),
    countCoins()
  ]);

  const totalPages = Math.ceil(totalRecords / pageSize);
  const transformedResult = res.map((coin: any) => ({
    ...coin,
    current_price: parseFloat(coin.current_price),
    market_cap: parseFloat(coin.market_cap),
    market_cap_rank: parseFloat(coin.market_cap_rank),
    fully_diluted_valuation: parseFloat(coin.fully_diluted_valuation),
    total_volume: parseFloat(coin.total_volume),
    high_24h: parseFloat(coin.high_24h),
    low_24h: parseFloat(coin.low_24h),
    price_change_24h: parseFloat(coin.price_change_24h),
    price_change_percentage_24h: parseFloat(coin.price_change_percentage_24h),
    market_cap_change_24h: parseFloat(coin.market_cap_change_24h),
    market_cap_change_percentage_24h: parseFloat(coin.market_cap_change_percentage_24h),
    circulating_supply: parseFloat(coin.circulating_supply),
    total_supply: parseFloat(coin.total_supply),
    max_supply: parseFloat(coin.max_supply),
    ath: parseFloat(coin.ath),
    atl: parseFloat(coin.atl),
    ath_change_percentage: parseFloat(coin.ath_change_percentage),
    atl_change_percentage: parseFloat(coin.atl_change_percentage),
  }));
  console.log(transformedResult)
  return NextResponse.json({
    result: transformedResult,
    totalPages,
    totalRecords
  });
}


export async function DELETE(request: any) {
  const apiKey = request.headers.get('Authorization');
  const API_KEY = process.env.API_KEY;

  if (!apiKey || apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const result = await deleteCoins();
  return NextResponse.json(result);
}

