import { NextResponse } from "next/server";
import { ensureSchema, query } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    await ensureSchema();
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    // Expecting path: /api/booking/[bookingId]/confirmPayment
    const bookingIndex = parts.findIndex((p) => p === "booking");
    const bookingId = bookingIndex >= 0 && parts.length > bookingIndex + 1 ? parts[bookingIndex + 1] : "";
    if (!bookingId) return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });

    // Optionally you could verify latest payment is SUCCESS here
    await query(`update bookings set status = 'CONFIRMED', updated_at = now() where id = $1`, [bookingId]);

    return NextResponse.json({ bookingId, status: 'CONFIRMED' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
  }
}
