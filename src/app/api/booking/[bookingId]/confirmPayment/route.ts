import { NextResponse } from "next/server";
import { ensureSchema, query } from "@/lib/db";

interface Params {
  params: { bookingId: string };
}

export async function PUT(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { bookingId } = params;
    if (!bookingId) return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });

    // Optionally you could verify latest payment is SUCCESS here
    await query(`update bookings set status = 'CONFIRMED', updated_at = now() where id = $1`, [bookingId]);

    return NextResponse.json({ bookingId, status: 'CONFIRMED' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
  }
}
