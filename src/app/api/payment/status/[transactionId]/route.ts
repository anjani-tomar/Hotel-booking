import { NextResponse } from "next/server";
import { ensureSchema, query } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    await ensureSchema();
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    // Expecting path: /api/payment/status/[transactionId]
    const statusIndex = parts.findIndex((p) => p === "status");
    const transactionId = statusIndex >= 0 && parts.length > statusIndex + 1 ? parts[statusIndex + 1] : "";
    if (!transactionId) return NextResponse.json({ error: 'transactionId is required' }, { status: 400 });

    const { rows } = await query<{ status: string; booking_id: string }>(
      `select status, booking_id from payments where transaction_id = $1 limit 1`,
      [transactionId]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    // In a real integration you'd also reconcile with gateway/webhook here
    return NextResponse.json({ transactionId, status: rows[0].status, bookingId: rows[0].booking_id });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
