import { NextResponse } from "next/server";
import { ensureSchema, query } from "@/lib/db";

export const runtime = 'nodejs';

type CardChargePayload = {
  bookingId: string;
  paymentToken: string; // tokenized by PCI-compliant gateway SDK
  amount: number;
};

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = (await req.json()) as CardChargePayload;
    if (!body.bookingId || !body.paymentToken || !body.amount) {
      return NextResponse.json({ error: 'bookingId, paymentToken, amount are required' }, { status: 400 });
    }

    // TODO: Call your payment gateway with paymentToken
    // Simulate approval for demo
    const transactionId = `txn_card_${Date.now().toString(36)}`;

    await query(
      `insert into payments (transaction_id, booking_id, method, status, amount)
       values ($1,$2,'CARD','SUCCESS',$3)`,
      [transactionId, body.bookingId, body.amount]
    );

    await query(
      `update bookings set payment_method = 'CARD', transaction_id = $1, updated_at = now() where id = $2`,
      [transactionId, body.bookingId]
    );

    return NextResponse.json({ transactionId, status: 'SUCCESS' });
  } catch (e) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
