import { NextResponse } from "next/server";
import { updateCoins } from '@/lib/db';

const API_KEY = process.env.API_KEY;

export async function GET(request: any) {
  const apiKey = request.headers.get('Authorization');

  if (!apiKey || apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const result = await updateCoins();
  return NextResponse.json(result);
}