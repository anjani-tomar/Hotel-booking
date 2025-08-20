'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the booking flow for better performance
const BookingFlow = dynamic(
  () => import('./components/BookingFlow'),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Loading booking experience...</div>
      </div>
    ) 
  }
);

const BookingPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Preparing your booking...</div>
      </div>
    }>
      <BookingFlow />
    </Suspense>
  );
};

export default BookingPage;
