export const metadata = {
  title: "Help – LuxuryStay",
};

const helpPoints = [
  {
    title: "Booking & Cancellation",
    content: "Modify or cancel your booking up to 24 hours before check‑in without penalty on eligible rates.",
  },
  {
    title: "Check‑in & Check‑out",
    content: "Standard check‑in is 2 PM and check‑out is 11 AM. Early check‑in/late check‑out subject to availability.",
  },
  {
    title: "Payment Methods",
    content: "We accept major credit/debit cards, UPI, and net banking. Pre‑authorization may apply.",
  },
  {
    title: "Amenities & Services",
    content: "Complimentary Wi‑Fi, 24/7 concierge, airport transfers, spa, and fitness center available.",
  },
  {
    title: "Pet Policy",
    content: "Pets under 10kg are allowed in select rooms with a refundable deposit.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold">Help & Support</h1>
      <p className="mt-2 text-white/80">Need assistance? Call us at <span className="font-semibold">+91 79746 41985</span>.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {helpPoints.map((h) => (
          <div key={h.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold">{h.title}</h3>
            <p className="mt-2 text-white/80 text-sm">{h.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
