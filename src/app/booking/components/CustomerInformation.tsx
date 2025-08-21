'use client';
import { useEffect, useMemo, useState } from 'react';

interface CustomerInformationProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  idImageUrl: string | null;
  onIdImageChange: (file: File) => void;
  errors: Record<string, string>;
  onNext: () => void;
}

export default function CustomerInformation({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  idImageUrl,
  onIdImageChange,
  errors,
  onNext,
}: CustomerInformationProps) {
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [savedPreview, setSavedPreview] = useState<{ firstName: string; lastName: string; email: string; phone: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Base URL for Express backend or fallback to Next API
  const apiBase = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '');
    if (env) return env;
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:4000/api`;
    }
    return '/api';
  }, []);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('booking_lead_guest') : null;
      if (raw) {
        const data = JSON.parse(raw);
        if (data && (data.firstName || data.lastName || data.email || data.phone)) {
          setHasSavedProfile(true);
          setSavedPreview({
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const payload = { firstName, lastName, email, phone };
      if (typeof window !== 'undefined') {
        localStorage.setItem('booking_lead_guest', JSON.stringify(payload));
      }
    } catch {}
  }, [firstName, lastName, email, phone]);

  function handleAutofill() {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('booking_lead_guest') : null;
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.firstName) setFirstName(data.firstName);
      if (data.lastName) setLastName(data.lastName);
      if (data.email) setEmail(data.email);
      if (data.phone) setPhone(data.phone);
    } catch {}
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onIdImageChange(file);
    }
  };

  async function saveLeadGuest() {
    setSubmitError(null);
    try {
      setSubmitting(true);
      const payload = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        phone: phone?.trim(),
        idImageUrl: idImageUrl || null,
      };
      const res = await fetch(`${apiBase}/lead-guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to save');
      }
    } catch (e: any) {
      setSubmitError(e?.message || 'Unable to save');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg md:text-xl font-semibold">Who's the lead guest?</h2>
        <button
          type="button"
          onClick={handleAutofill}
          className="px-3 py-2 text-xs rounded-md border border-white/20 text-white hover:bg-white/5 disabled:opacity-50"
          disabled={!hasSavedProfile}
        >
          Use saved
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <input
              className={`w-full rounded-md bg-black/20 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm outline-none focus:border-[#ffb900]`}
              placeholder="First name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <input
              className={`w-full rounded-md bg-black/20 border ${errors.lastName ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm outline-none focus:border-[#ffb900]`}
              placeholder="Last name *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <input
            type="email"
            className={`w-full rounded-md bg-black/20 border ${errors.email ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm outline-none focus:border-[#ffb900]`}
            placeholder="Email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            className={`w-full rounded-md bg-black/20 border ${errors.phone ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm outline-none focus:border-[#ffb900]`}
            placeholder="Phone number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
          )}
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium mb-2">
            Upload ID (Passport/Driver's License) — optional
          </label>
          <label className="flex flex-col items-center px-4 py-6 bg-black/20 border border-dashed border-white/10 rounded-md cursor-pointer hover:border-[#ffb900] transition-colors">
            {idImageUrl ? (
              <div className="relative w-full">
                <img src={idImageUrl} alt="ID preview" className="max-h-40 mx-auto mb-2 rounded" />
                <span className="text-sm text-[#ffb900]">Click to change</span>
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1 text-sm text-gray-300">Upload a file</p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG, PDF up to 5MB</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
          {errors.idImage && (
            <p className="mt-1 text-sm text-red-400">{errors.idImage}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={async () => { await saveLeadGuest(); onNext(); }}
          disabled={submitting}
          className="px-6 py-3 bg-[#ffb900] hover:bg-[#e6a500] disabled:opacity-50 text-black font-medium rounded-md transition-colors"
        >
          Continue to Payment
        </button>
      </div>
      {submitError && (
        <p className="mt-3 text-sm text-red-400">{submitError}</p>
      )}
    </section>
  );
}
