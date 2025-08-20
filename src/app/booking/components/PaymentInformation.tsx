'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { QrReaderProps } from 'react-qr-reader';
import rupay from "@/assets/pngegg (1).png";

interface PaymentInformationProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvv: string;
  setCardCvv: (value: string) => void;
  paymentMethodError: string;
  cardNameError: string;
  cardNumberError: string;
  cardExpiryError: string;
  cardCvvError: string;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

export default function PaymentInformation({
  paymentMethod, setPaymentMethod,
  cardName, setCardName,
  cardNumber, setCardNumber,
  cardExpiry, setCardExpiry,
  cardCvv, setCardCvv,
  paymentMethodError,
  cardNameError,
  cardNumberError,
  cardExpiryError,
  cardCvvError,
  onBack,
  onSubmit,
  isSubmitDisabled,
}: PaymentInformationProps) {
  // Tab state: 'card' | 'qr' | 'scan'
  const [selectedTab, setSelectedTab] = useState<'card' | 'qr' | 'scan'>('card');
  // Booking + payment state
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pmOpen, setPmOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const pmRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (pmRef.current && !pmRef.current.contains(e.target as Node)) setPmOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // Removed localStorage save/autofill by request to keep component lean.

  // When switching to QR tab, we don't auto-create booking or set local image.
  // The user will click to create/generate, and we show loader appropriately.
  useEffect(() => {
    if (selectedTab !== 'qr') return;
    // Reset transient QR states when entering the tab
    setError(null);
  }, [selectedTab]);

  // --- API helpers ---
  async function handleCreateBooking() {
    try {
      setLoading(true); setError(null);
      // TODO: Replace with payload from parent/booking context (user, hotel, dates, amount)
      const payload = { /* populated by parent later */ } as any;
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      const data = await res.json();
      setBookingId(data.bookingId);
    } catch (e: any) {
      setError(e.message || 'Unable to create booking');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateQr() {
    if (!bookingId) return;
    try {
      setLoading(true); setError(null); setQrLoading(true);
      const res = await fetch(`/api/payment/qr?bookingId=${encodeURIComponent(bookingId)}`);
      if (!res.ok) throw new Error('Failed to generate QR');
      const data = await res.json();
      setQrImageUrl(data.qrImageUrl);
      setTransactionId(data.transactionId);
      setPaymentStatus('PENDING');
    } catch (e: any) {
      setError(e?.message || 'Unable to generate QR');
      setQrLoading(false);
    } finally {
      setLoading(false);
    }
  }
  // Removed unused payment status polling and scan alert per cleanup request.

  // Dynamically import QrReader (named export) from react-qr-reader for Scan QR tab (no SSR)
  const QrReader = dynamic<QrReaderProps>(
    () => import('react-qr-reader').then((m) => m.QrReader),
    { ssr: false }
  );

  const methods = [
    { id: 'card_visa_mc_amex_jcb', label: 'Visa / Mastercard / Amex / JCB', logos: [
      { alt: 'Visa', url: 'https://cdn.simpleicons.org/visa' },
      { alt: 'Mastercard', url: 'https://cdn.simpleicons.org/mastercard' },
      { alt: 'American Express', url: 'https://cdn.simpleicons.org/americanexpress' },
      { alt: 'JCB', url: 'https://cdn.simpleicons.org/jcb' },
    ]},
    { id: 'card_rupay', label: 'RuPay', logos: [ { alt: 'RuPay', url: 'https://cdn.simpleicons.org/rupay' } ] },
    { id: 'card_unionpay', label: 'UnionPay - Creditcard', logos: [ { alt: 'UnionPay', url: 'https://cdn.simpleicons.org/unionpay' } ] },
    { id: 'upi', label: 'UPI', logos: [ { alt: 'UPI', url: 'https://cdn.simpleicons.org/upi' } ] },
    { id: 'paypal', label: 'PayPal', logos: [ { alt: 'PayPal', url: 'https://cdn.simpleicons.org/paypal' } ] },
  ] as const;

  return (
    <section className="rounded-xl border border-white/10 bg-[#ffffff0d] p-0 text-white">
      {/* Secure banner */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25V9H6a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0018 9h-.75V6.75A5.25 5.25 0 0012 1.5zm-3.75 7.5V6.75a3.75 3.75 0 117.5 0V9h-7.5z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium">Secure payment</span>
        </div>
        <div className="text-xs text-white/60">256-bit SSL • PCI DSS</div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Payment</h2>
        </div>

        {/* Segmented tabs */}
        <div className="inline-flex rounded-lg bg-black/20 border border-white/10 p-1 text-sm">
          <button
            className={`px-3 py-1.5 rounded-md ${selectedTab === 'card' ? 'bg-[#ffb900] text-black' : 'text-white hover:bg-white/5'}`}
            onClick={() => setSelectedTab('card')}
            type="button"
          >Card</button>
          <button
            className={`px-3 py-1.5 rounded-md ${selectedTab === 'qr' ? 'bg-[#ffb900] text-black' : 'text-white hover:bg-white/5'}`}
            onClick={() => setSelectedTab('qr')}
            type="button"
          >QR Code</button>
          <button
            className={`px-3 py-1.5 rounded-md ${selectedTab === 'scan' ? 'bg-[#ffb900] text-black' : 'text-white hover:bg-white/5'}`}
            onClick={() => setSelectedTab('scan')}
            type="button"
          >Scan QR</button>
        </div>

        {/* Payment method dropdown (only for Card) */}
        {selectedTab === 'card' && (
        <div className="space-y-1" ref={pmRef}>
          <label className="block text-xs text-white/70">Select payment method</label>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPmOpen((o) => !o); }}
              className={`w-full inline-flex items-center justify-between rounded-md bg-black/20 border ${paymentMethodError ? 'border-red-500' : 'border-white/10'} px-3 py-2.5 text-sm text-white hover:bg-white/5`}
            >
              <span className="inline-flex items-center gap-2">
                {methods.find(m => m.id === paymentMethod)?.logos?.[0] ? (
                  <img src={methods.find(m => m.id === paymentMethod)!.logos![0].url} alt={methods.find(m => m.id === paymentMethod)!.logos![0].alt} className="h-4 w-auto" />
                ) : (
                  <svg className="h-4 w-7 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M3.75 6.75h16.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5z"/></svg>
                )}
                {methods.find(m => m.id === paymentMethod)?.label || 'Choose a method'}
              </span>
              <svg className={`h-4 w-4 transition-transform ${pmOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
            </button>
            {pmOpen && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-white/10 bg-[#111] shadow-xl">
                <ul className="max-h-56 overflow-auto py-1">
                  {methods.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod(m.id); setPmOpen(false); }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/5 ${paymentMethod === m.id ? 'bg-white/10' : ''}`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {m.logos?.slice(0, 3).map((l) => (
                            <img key={l.alt} src={l.url} alt={l.alt} className="h-4 w-auto" />
                          ))}
                        </span>
                        <span className="flex-1 truncate">{m.label}</span>
                        {paymentMethod === m.id && (
                          <svg className="h-4 w-4 text-[#ffb900]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {paymentMethodError && <p className="text-[11px] text-red-400">{paymentMethodError}</p>}
        </div>
        )}
        
        {/* Card brand logos (Card tab only) */}
        {selectedTab === 'card' && (
        <div className="flex flex-wrap items-center gap-3">
          <button className="w-20 h-10 border-[#ffb900] rounded-md flex items-center justify-center bg-[#ffb900] hover:opacity-100">
            <img src="https://cdn.simpleicons.org/visa" alt="Visa" className="h-[42px] w-auto" />
          </button>
          <button className="w-20 h-10 border-[#ffb900] rounded-md flex items-center justify-center bg-[#ffb900] hover:opacity-100">
            <img src="https://cdn.simpleicons.org/mastercard" alt="Mastercard" className="h-[35px] w-auto" />
          </button>
          <button className="w-20 h-10 border-[#ffb900] rounded-md flex items-center justify-center bg-[#ffb900] hover:opacity-100">
            <Image src={rupay} alt="RuPay" width={46} height={23} className="h-[23px] w-auto" />
          </button>
          <button className="w-20 h-10 border-[#ffb900] rounded-md flex items-center justify-center bg-[#ffb900] hover:opacity-100">
            <img src="https://cdn.simpleicons.org/jcb" alt="JCB" className="h-[36px] w-auto" />
          </button>
        </div>
        )}



        {/* Card fields (Card tab only) */}
        {selectedTab === 'card' && (
        <div className="mt-2 grid gap-4">
          <div>
            <input 
              className={`w-full rounded-md bg-black/20 border px-3 py-2.5 text-sm outline-none focus:border-white/50 ${cardNameError ? 'border-red-500' : 'border-white/10'} text-white placeholder-white/50`} 
              placeholder="Card Holder Name" 
              autoComplete="cc-name"
              value={cardName} 
              onChange={(e) => setCardName(e.target.value)} 
            />
            {cardNameError && <p className="mt-1 text-[11px] text-red-400">{cardNameError}</p>}
          </div>
          
          <div>
            <input 
              inputMode="numeric" 
              className={`w-full rounded-md bg-black/20 border px-3 py-2.5 text-sm outline-none focus:border-white/50 ${cardNumberError ? 'border-red-500' : 'border-white/10'} text-white placeholder-white/50`} 
              placeholder="Card Number" 
              autoComplete="cc-number"
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value)} 
            />
            {cardNumberError && <p className="mt-1 text-[11px] text-red-400">{cardNumberError}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                className={`w-full rounded-md bg-black/20 border px-3 py-2.5 text-sm outline-none focus:border-white/50 ${cardExpiryError ? 'border-red-500' : 'border-white/10'} text-white placeholder-white/50`} 
                placeholder="Expiry (MM/YY)" 
                autoComplete="cc-exp"
                value={cardExpiry} 
                onChange={(e) => setCardExpiry(e.target.value)} 
              />
              {cardExpiryError && <p className="mt-1 text-[11px] text-red-400">{cardExpiryError}</p>}
            </div>
            <div>
              <input 
                inputMode="numeric" 
                className={`w-full rounded-md bg-black/20 border px-3 py-2.5 text-sm outline-none focus:border-white/50 ${cardCvvError ? 'border-red-500' : 'border-white/10'} text-white placeholder-white/50`} 
                placeholder="CVV" 
                autoComplete="cc-csc"
                value={cardCvv} 
                onChange={(e) => setCardCvv(e.target.value)} 
              />
              {cardCvvError && <p className="mt-1 text-[11px] text-red-400">{cardCvvError}</p>}
            </div>
          </div>
        </div>
        )}

        {/* QR Payment Panel */}
        {selectedTab === 'qr' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={bookingId ? handleGenerateQr : handleCreateBooking}
                className="px-4 py-2 rounded-md bg-[#ffb900] text-black text-sm hover:opacity-90 disabled:opacity-50"
                disabled={loading}
              >
                {bookingId ? (qrImageUrl ? 'Regenerate QR' : 'Generate QR') : 'Create Booking'}
              </button>
            </div>

            {qrLoading && (
              <div className="space-y-2">
                <div className="rounded-md w-1/2 border border-white/10 bg-black/20 p-10 flex flex-col items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <p className="mt-3 text-center text-xs text-white/70">Loading QR...</p>
                </div>
              </div>
            )}

            {qrImageUrl && (
              <div className="space-y-2">
                <div className="rounded-md w-1/2 border border-[#ffb900] bg-[#ffb900] p-4 flex flex-col items-center">
                  <img src={qrImageUrl} alt="Payment QR" className="w-48 h-48 object-contain" onLoad={() => setQrLoading(false)} onError={() => setQrLoading(false)} />
                  <p className="mt-3 text-center text-xs text-black">
                    Scan with any UPI app like Google Pay, PhonePe, Paytm
                  </p>
                  {transactionId && (
                    <p className="mt-1 text-[11px] text-white/50">Transaction ID: {transactionId}</p>
                  )}
                </div>
                {paymentStatus && (
                  <p className={`text-sm ${paymentStatus === 'SUCCESS' ? 'text-green-400' : paymentStatus === 'FAILED' ? 'text-red-400' : 'text-white/70'}`}>
                    Status: {paymentStatus}
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-[12px] text-red-400">{error}</p>}
          </div>
        )}

        {/* Scan QR Panel */}
        {selectedTab === 'scan' && (
          <div className="space-y-3">
            {!(typeof window !== 'undefined' && (window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost')) ? (
              <p className="text-sm text-red-400">
                Camera access requires a secure context (HTTPS). Please open the site over HTTPS
                (e.g., https://localhost:3443 via mkcert) or use an HTTPS tunnel like ngrok.
              </p>
            ) : (
              <>
                <div style={{ width: '100%' }}>
                  <QrReader
                    constraints={{ facingMode: { ideal: 'environment' } }}
                    scanDelay={300}
                    onResult={(result: any, err: any) => {
                      if (result) {
                        try {
                          const text = (result as any)?.getText?.() ?? String((result as any)?.text ?? '');
                          if (text) {
                            console.log('QR scanned:', text);
                            // TODO: parse UPI link or show instructions
                          }
                        } catch {}
                      }
                      if (err) {
                        const name = String((err as any)?.name || '');
                        if (name.includes('NotAllowedError')) {
                          setError('Camera permission denied. Please allow camera access.');
                        } else if (name.includes('NotFoundError')) {
                          setError('No camera found on this device.');
                        } else if (name.includes('NotReadableError')) {
                          setError('Camera is in use by another application.');
                        } else {
                          // Ignore frequent decode errors; only show non-decode issues
                          const msg = String((err as any)?.message || '').toLowerCase();
                          if (!msg.includes('decode')) {
                            setError('Camera error: ' + ((err as any)?.message || name));
                          }
                        }
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-white/60">Point your camera at the QR to scan.</p>
                {error && <p className="text-[12px] text-red-400">{error}</p>}
              </>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-md border border-white/20 bg-transparent text-white text-sm hover:bg-white/5 transition-colors"
          >
            Back
          </button>
          {selectedTab === 'card' && (
            <button
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className={`px-5 py-2.5 rounded-md text-sm font-medium ${
                isSubmitDisabled 
                  ? "bg-white/10 text-white/40 cursor-not-allowed" 
                  : "bg-[#ffb900] text-black hover:opacity-90"
              }`}
            >
              Pay & Book
            </button>
          )}
          {/* No extra action for QR tab when API removed */}
        </div>
      </div>
    </section>
  );
}
