import { NextResponse } from "next/server";
import { ensureSchema, query } from "@/lib/db";

export const runtime = 'nodejs';

type BookingPayload = {
  // Minimal payload used by UI for payment
  userId?: string;
  hotelId?: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  amount: number;
  guests?: number;
  // Optional personal data (if form captures it)
  name?: string;
  email?: string;
  phone?: string;
  roomType?: string;
  notes?: string;
};

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query<any>(
      `select id, user_id as "userId", hotel_id as "hotelId", check_in as "checkIn", check_out as "checkOut", guests, status, amount, payment_method as "paymentMethod", transaction_id as "transactionId", created_at as "createdAt" from bookings order by created_at desc limit 100`
    );
    return NextResponse.json({ items: rows });
  } catch (e) {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = (await req.json()) as BookingPayload;

    if (!body.checkIn || !body.checkOut) return NextResponse.json({ error: "Dates are required" }, { status: 400 });
    if (typeof body.amount !== 'number' || body.amount <= 0) return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
    const guests = body.guests && body.guests > 0 ? body.guests : 1;

    // Basic ids (can be optional for browsing flow)
    const userId = body.userId || 'guest';
    const hotelId = body.hotelId || 'unknown-hotel';

    const bookingId = `bkg_${Date.now().toString(36)}`;
    await query(
      `insert into bookings (id, user_id, hotel_id, check_in, check_out, guests, status, amount, payment_method, transaction_id, name, email, phone)
       values ($1,$2,$3,$4,$5,$6,'PENDING',$7,null,null,$8,$9,$10)`,
      [
        bookingId,
        userId,
        hotelId,
        new Date(body.checkIn).toISOString(),
        new Date(body.checkOut).toISOString(),
        guests,
        body.amount,
        body.name || null,
        body.email || null,
        body.phone || null,
      ]
    );

    return NextResponse.json({ bookingId, amount: body.amount, status: 'PENDING' });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
