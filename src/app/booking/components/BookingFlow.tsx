'use client';

import { useState, useEffect } from 'react';
import { formatISO as fmtISO } from 'date-fns';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Lazy load steps
const CustomerInformation = dynamic(
  () => import('./CustomerInformation'),
  { ssr: false }
);

const PaymentInformation = dynamic(
  () => import('./PaymentInformation'),
  { ssr: false }
);

const ThankYou = dynamic(
  () => import('./ThankYou'),
  { ssr: false }
);

const BookingSummary = dynamic(
  () => import('./BookingSummary'),
  { ssr: false }
);

type Step = 1 | 2 | 3;

// Validation functions
const isAlpha = (s: string) => /^[a-zA-Z][a-zA-Z\s'-]+$/.test(s.trim());
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const isPhone = (s: string) => /^(\+?\d[\d\s-]{7,15})$/.test(s.trim());
const isCardNumber = (s: string) => /^\d{13,19}$/.test(s.replace(/\s/g, ''));
const isCardExpiry = (s: string) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(s);
const isCvv = (s: string) => /^\d{3,4}$/.test(s);

export default function BookingFlow() {
  // Selected hotel from query params
  const searchParams = useSearchParams();

  interface HotelSelection {
    id?: string;
    hotel: string;
    room: string;
    image: string;
    price: number; // price per night
    currency: string;
  }

  const fallbackSelection: HotelSelection = {
    hotel: 'LuxuryStay Mumbai',
    room: 'Deluxe King Room',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200',
    price: 249853.34,
    currency: '₹',
  };

  const selected: HotelSelection = {
    id: searchParams.get('id') || undefined,
    hotel: searchParams.get('hotel') || fallbackSelection.hotel,
    room: searchParams.get('room') || fallbackSelection.room,
    image: searchParams.get('image') || fallbackSelection.image,
    price: (() => {
      const p = searchParams.get('price');
      const n = p ? Number(p) : NaN;
      return Number.isFinite(n) ? n : fallbackSelection.price;
    })(),
    currency: searchParams.get('currency') || fallbackSelection.currency,
  };
  // Step and form state
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idImageUrl: null as string | null,
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    paymentMethod: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [holdSeconds, setHoldSeconds] = useState(300); // 5 minutes

  // Date handling
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dates, setDates] = useState({
    start: fmtISO(today),
    end: fmtISO(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))
  });
  
  // Format dates for display
  const [formattedDates, setFormattedDates] = useState({ start: '', end: '' });
  // Date UI state
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [tempStart, setTempStart] = useState<string>('');
  const [tempEnd, setTempEnd] = useState<string>('');
  const [datesConfirmed, setDatesConfirmed] = useState(false);

  // Update formatted dates when dates change
  useEffect(() => {
    const formatDisplay = (iso: string) =>
      new Date(iso).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
      });
    
    setFormattedDates({
      start: formatDisplay(dates.start),
      end: formatDisplay(dates.end)
    });
  }, [dates]);

  // Countdown for payment hold on steps 1 and 2
  useEffect(() => {
    if ((step !== 1 && step !== 2) || holdSeconds === 0) return;
    const t = setInterval(() => {
      setHoldSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [step, holdSeconds]);

  // Field setters to keep props simple
  const setFirstName = (value: string) => setFormData((p) => ({ ...p, firstName: value }));
  const setLastName = (value: string) => setFormData((p) => ({ ...p, lastName: value }));
  const setEmail = (value: string) => setFormData((p) => ({ ...p, email: value }));
  const setPhone = (value: string) => setFormData((p) => ({ ...p, phone: value }));
  const setCardName = (value: string) => setFormData((p) => ({ ...p, cardName: value }));
  const setCardNumber = (value: string) => setFormData((p) => ({ ...p, cardNumber: value }));
  const setCardExpiry = (value: string) => setFormData((p) => ({ ...p, cardExpiry: value }));
  const setCardCvv = (value: string) => setFormData((p) => ({ ...p, cardCvv: value }));
  const setPaymentMethod = (value: string) => setFormData((p) => ({ ...p, paymentMethod: value }));

  // File upload handler with basic validation
  const onIdImageChange = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const newErrors: Record<string, string> = { ...errors };

    if (!allowed.includes(file.type)) {
      newErrors.idImage = 'Unsupported file type';
    } else if (file.size > maxSize) {
      newErrors.idImage = 'File is too large (max 5MB)';
    } else {
      delete newErrors.idImage;
      const url = URL.createObjectURL(file);
      setFormData((p) => ({ ...p, idImageUrl: url }));
    }
    setErrors(newErrors);
  };

  // Validation helpers
  const validateCustomer = () => {
    const e: Record<string, string> = {};
    if (!isAlpha(formData.firstName)) e.firstName = 'Enter a valid first name';
    if (!isAlpha(formData.lastName)) e.lastName = 'Enter a valid last name';
    if (!isEmail(formData.email)) e.email = 'Enter a valid email';
    if (!isPhone(formData.phone)) e.phone = 'Enter a valid phone number';
    if (!formData.idImageUrl) e.idImage = 'Please upload your ID';
    return e;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (!formData.paymentMethod) e.paymentMethod = 'Please select a payment method';
    if (!formData.cardName.trim()) e.cardName = 'Card holder name is required';
    if (!isCardNumber(formData.cardNumber)) e.cardNumber = 'Enter a valid card number';
    if (!isCardExpiry(formData.cardExpiry)) e.cardExpiry = 'Use MM/YY format';
    if (!isCvv(formData.cardCvv)) e.cardCvv = 'Enter a valid CVV';
    return e;
  };

  const proceedToPayment = () => {
    // date must be confirmed
    const dateError: Record<string, string> = {};
    if (!datesConfirmed) {
      dateError.dates = 'Please select your check-in and check-out dates';
    }
    const e = validateCustomer();
    const merged = { ...e, ...dateError };
    setErrors(merged);
    if (Object.keys(merged).length === 0) {
      setStep(2);
    }
  };

  const submitBooking = () => {
    const e = { ...errors, ...validatePayment() };
    setErrors(e);
    if (Object.keys(validatePayment()).length === 0) {
      setStep(3);
    }
  };

  return (
    <>
      {(step === 1 || step === 2) && (
        <div className="sticky top-16 z-20">
          <div className="bg-[#ffb900] text-black border-b border-[#ffb900] text-sm flex items-center justify-center gap-2 py-2">
            <span className="inline-flex items-center gap-1">
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4'><path fillRule='evenodd' d='M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z' clipRule='evenodd'/></svg>
              We are holding your price…
            </span>
            <span className="font-semibold tabular-nums">
              {String(Math.floor(holdSeconds / 60)).padStart(2, '0')}:{String(holdSeconds % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Date selector bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => { setTempStart(dates.start.slice(0,10)); setTempEnd(dates.end.slice(0,10)); setShowDatePopup(true); }}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
        >
          <span className="text-white/70">Check-in</span>
          <span className="font-medium">{formattedDates.start}</span>
          <span className="opacity-60">→</span>
          <span className="text-white/70">Check-out</span>
          <span className="font-medium">{formattedDates.end}</span>
        </button>
        {!datesConfirmed && (
          <span className="text-xs text-red-400">Select dates to continue</span>
        )}
      </div>

      {/* Date Popup Modal */}
      {showDatePopup && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div className="p-2 absolute inset-0 bg-black/50 backdrop-blur-sm opacity-100 transition-opacity" onClick={() => setShowDatePopup(false)} />
          <div className="relative w-full max-w-md mx-auto rounded-xl border border-white/10 bg-[#111]/95 px-5 py-10 shadow-xl transform transition-all scale-95 opacity-100">
            <h3 className="text-base font-semibold mb-4">Select your stay</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1">Check-in</label>
                <input
                  type="date"
                  className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Check-out</label>
                <input
                  type="date"
                  className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                />
              </div>
            </div>
            {errors.dates && (
              <p className="mt-2 text-xs text-red-400">{errors.dates}</p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowDatePopup(false)} className="px-3 py-2 text-sm rounded-md border border-white/10 text-white/80 hover:bg-white/5">Cancel</button>
              <button
                onClick={() => {
                  // basic validation
                  if (!tempStart || !tempEnd) {
                    setErrors((p) => ({ ...p, dates: 'Please select both dates' }));
                    return;
                  }
                  const s = new Date(tempStart);
                  const e = new Date(tempEnd);
                  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) {
                    setErrors((p) => ({ ...p, dates: 'End date must be after start date' }));
                    return;
                  }
                  setErrors((p) => { const { dates, ...rest } = p; return rest; });
                  setDates({ start: fmtISO(s), end: fmtISO(e) });
                  setDatesConfirmed(true);
                  setShowDatePopup(false);
                }}
                className="px-4 py-2 text-sm rounded-md bg-[#ffb900] text-black font-medium hover:opacity-90"
              >
                Confirm dates
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <CustomerInformation
              firstName={formData.firstName}
              setFirstName={setFirstName}
              lastName={formData.lastName}
              setLastName={setLastName}
              email={formData.email}
              setEmail={setEmail}
              phone={formData.phone}
              setPhone={setPhone}
              idImageUrl={formData.idImageUrl}
              onIdImageChange={onIdImageChange}
              errors={errors}
              onNext={proceedToPayment}
            />
          )}

          {step === 2 && (
            <PaymentInformation
              paymentMethod={formData.paymentMethod}
              setPaymentMethod={setPaymentMethod}
              cardName={formData.cardName}
              setCardName={setCardName}
              cardNumber={formData.cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={formData.cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvv={formData.cardCvv}
              setCardCvv={setCardCvv}
              paymentMethodError={errors.paymentMethod || ''}
              cardNameError={errors.cardName || ''}
              cardNumberError={errors.cardNumber || ''}
              cardExpiryError={errors.cardExpiry || ''}
              cardCvvError={errors.cardCvv || ''}
              onBack={() => setStep(1)}
              onSubmit={submitBooking}
              isSubmitDisabled={Boolean(errors.paymentMethod || errors.cardName || errors.cardNumber || errors.cardExpiry || errors.cardCvv) || holdSeconds === 0 || !datesConfirmed}
            />
          )}

          {step === 2 && (
            <div className="text-xs text-white/60">
              Reservation held for: {Math.floor(holdSeconds / 60)}:{String(holdSeconds % 60).padStart(2, '0')}
            </div>
          )}

          {step === 3 && (
            <ThankYou
              email={formData.email}
              onGoHome={() => (window.location.href = '/')}
            />
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          {(() => {
            const nights = Math.round(
              (new Date(dates.end).getTime() - new Date(dates.start).getTime()) / (1000 * 60 * 60 * 24)
            );
            const baseFare = Math.max(1, nights) * selected.price; // at least 1 night
            const taxesFees = Math.round(baseFare * 0.18 * 100) / 100; // 18% GST approx
            const couponDiscount = 0;
            const finalTotal = baseFare + taxesFees - couponDiscount;
            const savings = 0;
            return (
              <BookingSummary
                selection={{
                  hotel: selected.hotel,
                  room: selected.room,
                  dates: `${formattedDates.start} → ${formattedDates.end}`,
                  nights,
                  guests: 2,
                  image: selected.image,
                  price: selected.price,
                  currency: selected.currency,
                }}
                baseFare={baseFare}
                taxesFees={taxesFees}
                couponDiscount={couponDiscount}
                finalTotal={finalTotal}
                savings={savings}
              />
            );
          })()}
        </div>
      </div>
      </div>
    </>
  );
}
