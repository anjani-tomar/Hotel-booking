import { NextResponse } from "next/server";
import { ensureSchema, query } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');
    if (!bookingId) return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });

    // Load booking
    const { rows: bRows } = await query<{ amount: number }>(
      `select amount from bookings where id = $1 limit 1`,
      [bookingId]
    );
    if (bRows.length === 0) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    const amount = Number(bRows[0].amount);

    // Create payment record
    const transactionId = `txn_qr_${Date.now().toString(36)}`;

    // Generate a QR image URL using a public QR service (replace with gateway-generated QR in production)
    // For UPI deep link example:
    const upiLink = `upi://pay?pa=merchant@upi&pn=LuxuryStay&am=${encodeURIComponent(
      amount.toString()
    )}&tn=${encodeURIComponent('LuxuryStay Booking')}&tr=${encodeURIComponent(transactionId)}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

    await query(
      `insert into payments (transaction_id, booking_id, method, status, amount, qr_image_url)
       values ($1,$2,'QR','PENDING',$3,$4)
       on conflict (transaction_id) do update set updated_at = now()`,
      [transactionId, bookingId, amount, qrImageUrl]
    );

    // Store transaction on booking (optional)
    await query(`update bookings set transaction_id = $1, payment_method = 'QR', updated_at = now() where id = $2`, [transactionId, bookingId]);

    return NextResponse.json({ transactionId, qrImageUrl, expiresIn: 300 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}
