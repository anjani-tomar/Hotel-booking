'use client';
import { useCallback, useMemo, useState } from 'react';

// Razorpay SDK typing
declare global {
  interface Window { Razorpay?: any }
}

export interface PaymentSandboxProps {
  // Optional: booking data from previous step. Replace with your real shape.
  bookingPayload?: {
    name: string;
    email: string;
    phone: string;
    checkIn: string; // YYYY-MM-DD
    checkOut: string; // YYYY-MM-DD
    guests: number;
    roomType?: string | null;
    notes?: string | null;
    amount: number; // in paise
  };
  onBack: () => void;
  onSuccess: (bookingId: string, transactionId: string) => void;
}

export default function PaymentSandbox({ bookingPayload, onBack, onSuccess }: PaymentSandboxProps) {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefer explicit env. Auto-fallback to :4000/api
  const apiBase = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '');
    if (env) return env;
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:4000/api`;
    }
    return '/api';
  }, []);

  const loadRazorpay = useCallback(async (): Promise<boolean> => {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  async function ensureBooking(): Promise<{ bookingId: string; amount: number }> {
    // TODO: replace fallback payload with actual data from previous step via bookingPayload prop
    const payload = bookingPayload ?? {
      name: 'Guest',
      email: 'guest@example.com',
      phone: '+911234567890',
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      guests: 1,
      roomType: 'Deluxe',
      notes: 'Sandbox booking',
      amount: 149900, // ₹1,499.00 in paise
    };

    const res = await fetch(`${apiBase}/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    const data = await res.json();
    const id = String(data.bookingId);
    setBookingId(id);
    return { bookingId: id, amount: Number(data.amount) };
  }

  async function createOrder(bId: string) {
    const res = await fetch(`${apiBase}/payment/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: bId, method: 'card', gateway: 'razorpay' }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`Failed to create order (${res.status}): ${msg || 'no details'}`);
    }
    return res.json();
  }

  async function confirmPayment(bId: string, txId: string) {
    try {
      await fetch(`${apiBase}/booking/${encodeURIComponent(bId)}/confirmPayment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txId }),
      });
    } catch {}
  }

  async function handlePay() {
    setError(null); setProcessing(true);
    try {
      const { bookingId: bId } = await ensureBooking();
      const order = await createOrder(bId);
      if (!order?.razorpay) throw new Error('Gateway data missing');

      const ok = await loadRazorpay();
      if (!ok) throw new Error('Failed to load Razorpay');

      // Basic validation of key to catch sandbox vs live mismatches early
      const keyId: string | undefined = order.razorpay.keyId;
      if (!keyId) throw new Error('Backend did not return Razorpay keyId');
      if (!keyId.startsWith('rzp_test_')) {
        console.warn('Razorpay keyId does not look like a sandbox key. Using:', keyId);
      }

      const opts: Record<string, any> = {
        key: keyId,
        amount: order.amount, // should match order amount created on backend (paise)
        currency: order.razorpay.currency || 'INR',
        name: 'LuxuryStay Hotels',
        order_id: order.razorpay.orderId,
        prefill: {
          name: bookingPayload?.name || 'Guest',
          email: bookingPayload?.email || 'guest@example.com',
          contact: bookingPayload?.phone || '+911234567890',
        },
        notes: { bookingId: bId },
        theme: { color: '#ffb900' },
        retry: { enabled: false }, // surface errors immediately
        handler: async () => {
          try {
            // In sandbox, we mark success after status check/confirmation
            const txId = String(order.transactionId);
            await confirmPayment(bId, txId);
            onSuccess(bId, txId);
          } catch (e) {
            setError('Payment confirmation failed');
          }
        },
        modal: { ondismiss: () => {} },
      };

      const rzp = new window.Razorpay(opts);
      // Capture explicit failures from Checkout (e.g., 401, key mismatch, order invalid)
      if (typeof rzp.on === 'function') {
        rzp.on('payment.failed', (resp: any) => {
          const err = resp?.error || {};
          const details = [err.code, err.description, err.reason].filter(Boolean).join(' | ');
          setError(details || 'Payment failed in checkout');
        });
      }
      rzp.open();
    } catch (e: any) {
      setError(e?.message || 'Payment failed to start');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold">Payment</h2>
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-2 text-xs rounded-md border border-white/20 text-white hover:bg-white/5"
        >
          Back
        </button>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handlePay}
          disabled={processing}
          className="px-6 py-3 bg-[#ffb900] text-black rounded-md font-medium hover:opacity-90 disabled:opacity-50"
        >
          {processing ? 'Processing…' : 'Pay with Razorpay Sandbox'}
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      <p className="mt-4 text-xs text-white/60">
        Sandbox mode. No real charges. Uses hosted Razorpay Checkout.
      </p>
    </section>
  );
}
