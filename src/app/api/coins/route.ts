// app/api/coins/route.ts

import { NextResponse, NextRequest } from "next/server"
import { getCoins, deleteCoins, countCoins } from '@/lib/db';

const ALLOWED_IPS = ['127.0.0.1', '::1'];

export async function GET(request: any) {
  const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
  const pageSize = parseInt(request.nextUrl.searchParams.get('page_size')) || 10;

  const [result, totalRecords] = await Promise.all([
    getCoins(page, pageSize),
    countCoins()
  ]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  return NextResponse.json({
    result,
    totalPages,
    totalRecords 
  });
}


export async function DELETE(request: any) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('client-ip') || request.socket.remoteAddress;

  if (!ALLOWED_IPS.includes(clientIP)) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const result = await deleteCoins();
  return NextResponse.json(result);
}

