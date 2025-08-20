import { NextResponse } from 'next/server';

// POST /api/booking/summary
// Body: { price: number, currency?: string, nights?: number, guests?: number, couponCode?: string }
// Computes baseFare, taxesFees, couponDiscount, finalTotal, savings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const price = Number(body?.price ?? 0);
    const nights = Number(body?.nights ?? 1);
    const guests = Number(body?.guests ?? 1);
    const couponCode: string | undefined = body?.couponCode;

    // Basic calculations (demo logic)
    const baseFare = Math.max(0, price * nights);
    const taxesFeesRate = 0.18; // 18%
    const taxesFees = Math.round(baseFare * taxesFeesRate);

    // Simple coupon rules (demo)
    let couponDiscount = 0;
    if (couponCode) {
      if (couponCode.toUpperCase() === 'SAVE10') {
        couponDiscount = Math.round(baseFare * 0.1);
      } else if (couponCode.toUpperCase() === 'FLAT200') {
        couponDiscount = 200;
      }
    }

    const subtotal = Math.max(0, baseFare - couponDiscount);
    const finalTotal = Math.max(0, subtotal + taxesFees);

    // Demo savings: assume MRP was 5% higher than baseFare
    const mrp = Math.round(baseFare * 1.05);
    const savings = Math.max(0, mrp - baseFare) + couponDiscount;

    return NextResponse.json({ baseFare, taxesFees, couponDiscount, finalTotal, savings });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid request' }, { status: 400 });
  }
}
