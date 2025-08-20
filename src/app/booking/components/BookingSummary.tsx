"use client";
import Image from 'next/image';
import { useState } from 'react';

interface BookingSummaryProps {
  selection: {
    hotel: string;
    room: string;
    dates: string;
    nights: number;
    guests: number;
    image: string;
    price: number;
    currency: string;
  };
  baseFare: number;
  taxesFees: number;
  couponDiscount: number;
  finalTotal: number;
  savings: number;
}

export default function BookingSummary({
  selection,
  baseFare,
  taxesFees,
  couponDiscount,
  finalTotal,
  savings,
}: BookingSummaryProps) {
  const [recalc, setRecalc] = useState<{
    baseFare: number;
    taxesFees: number;
    couponDiscount: number;
    finalTotal: number;
    savings: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRecalculate() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/booking/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: selection.price,
          nights: selection.nights,
          guests: selection.guests,
          // couponCode: 'SAVE10', // optionally pass a code
        }),
      });
      if (!res.ok) throw new Error('Failed to recalculate');
      const data = await res.json();
      setRecalc(data);
    } catch (e: any) {
      setError(e?.message || 'Unable to recalculate');
    } finally {
      setLoading(false);
    }
  }

  const view = recalc ?? { baseFare, taxesFees, couponDiscount, finalTotal, savings };
  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <div className="relative h-20 w-28 rounded-md overflow-hidden border border-white/10 bg-white/5">
            <Image 
              src={selection.image} 
              alt={selection.room} 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{selection.hotel}</h3>
            <p className="text-sm text-white/80">{selection.room}</p>
            <div className="mt-1 text-xs text-white/60">
              {selection.dates} · {selection.nights} nights
            </div>
            <div className="mt-1 text-xs text-white/60">
              Guests: {selection.guests}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#ffffff0d] p-4 text-sm text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/70">Summary</span>
          <div className="flex items-center gap-2">
            {recalc && (
              <span className="text-[11px] text-white/60">Recalculated</span>
            )}
            <button
              type="button"
              onClick={handleRecalculate}
              className="px-2 py-1 rounded border border-white/20 text-xs hover:bg-white/5 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Recalculating…' : 'Recalculate'}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Room price</span>
          <span>{selection.currency} {view.baseFare.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Taxes & fees</span>
          <span>{selection.currency} {view.taxesFees.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-1 text-green-700">
          <span>Coupon discount</span>
          <span>-{selection.currency} {view.couponDiscount.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200/20 mt-3 pt-3 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>{selection.currency} {view.finalTotal.toLocaleString()}</span>
        </div>
        {view.savings > 0 && (
          <div className="mt-2 text-xs text-green-700">
            You save {selection.currency} {view.savings.toLocaleString()} on this booking
          </div>
        )}
        <div className="mt-3 bg-[#ffb900] rounded-md text-black text-xs px-3 py-2 border border-[#ffb900] flex justify-center font-semibold">
          Stay: {selection.dates} · {selection.nights} nights
        </div>
        {error && (
          <div className="mt-2 text-[11px] text-red-400">{error}</div>
        )}
      </section>
    </aside>
  );
}
