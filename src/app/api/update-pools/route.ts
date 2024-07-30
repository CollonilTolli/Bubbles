import { NextResponse } from "next/server";
import { updateCoins } from '@/lib/db';

const ALLOWED_IPS = ['127.0.0.1', '::1'];

export async function GET(request: any) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('client-ip') || request.socket.remoteAddress;

  if (!ALLOWED_IPS.includes(clientIP)) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const result = await updateCoins();
  return NextResponse.json(result);
}
