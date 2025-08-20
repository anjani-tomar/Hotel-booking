'use client';

import Link from 'next/link';

interface ThankYouProps {
  email: string;
  onGoHome: () => void;
}

export default function ThankYou({ email, onGoHome }: ThankYouProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#16a34a]/20 border border-[#16a34a]/30 flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className="w-8 h-8 text-[#16a34a]"
        >
          <path 
            fillRule="evenodd" 
            d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      
      <h2 className="mt-4 text-xl font-semibold">Booking confirmed!</h2>
      <p className="mt-2 text-white/70">
        A confirmation email has been sent to {email || 'your email'}.
      </p>
      
      <div className="mt-6 flex items-center justify-center gap-3">
        <button 
          onClick={onGoHome}
          className="px-4 py-2 rounded-md border border-white/15 bg-white/5 text-sm hover:bg-white/10 transition-colors"
        >
          Go home
        </button>
        <Link 
          href="/about" 
          className="px-4 py-2 rounded-md bg-[#ffb900] text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Explore more
        </Link>
      </div>
    </section>
  );
}
