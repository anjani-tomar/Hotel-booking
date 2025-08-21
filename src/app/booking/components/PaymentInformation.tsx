"use client";
import PaymentSandbox from './PaymentSandbox';

type BookingPayload = {
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

interface PaymentInformationProps {
  onBack: () => void;
  onSubmit: () => void; // called on successful payment
  bookingPayload?: BookingPayload; // optional: pass real booking data from previous step
}

export default function PaymentInformation({ onBack, onSubmit, bookingPayload }: PaymentInformationProps) {
  // Minimal wrapper: use hosted Razorpay sandbox component
  return (
    <PaymentSandbox
      bookingPayload={bookingPayload}
      onBack={onBack}
      onSuccess={(_bookingId, _txId) => onSubmit()}
    />
  );
}
