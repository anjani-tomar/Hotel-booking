"use client";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  description?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^\+?\d{10,15}$/; // supports international formats

export default function ContactPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const [data, setData] = useState<FormData>({ name: "", email: "", phone: "", description: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!emailRegex.test(data.email)) e.email = "Valid email is required";
    if (!phoneRegex.test(data.phone)) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await fetch(`${base}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json?.error) {
        throw new Error(json?.error || "Failed to submit");
      }
      setSubmitted(true);
      setData({ name: "", email: "", phone: "", description: "" });
    } catch (e: any) {
      setServerError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <p className="mt-2 text-white/80">We typically respond within a few hours.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Your full name"
            required
          />
          {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="name@example.com"
            required
          />
          {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+91 9876543210"
            required
          />
          {errors.phone && <p className="text-sm text-red-300 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Description (optional)</label>
          <textarea
            rows={4}
            className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Tell us about your requirements"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-md bg-amber-400 text-black font-medium hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {serverError && (
          <p className="text-sm text-red-300">{serverError}</p>
        )}
        {submitted && !serverError && (
          <p className="text-sm text-green-300">Thanks! Your details have been submitted successfully.</p>
        )}
      </form>
    </div>
  );
}
