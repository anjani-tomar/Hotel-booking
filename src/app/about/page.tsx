import Image from "next/image";
import Link from "next/link";

import Dinnig from "@/assets/Dinnig.png";
import Suits from "@/assets/HotelDinnig.jpg";

export const metadata = {
  title: "About Us – LuxuryStay",
};

export default function AboutPage() {
  const features: string[] = [
    "5 Star Rated Premium Hospitality",
    "Royal Suites & Deluxe Rooms with city or ocean view",
    "Infinity Swimming Pool",
    "Fine Dining Restaurant with multi-cuisine",
    "Rooftop Bar & Lounge",
    "Spa, Sauna & Wellness Center",
    "Luxury Airport Pickup & Limousine Service",
    "24/7 Room Service and Personalized Butler Service",
    "In-room Jacuzzi & Smart Room Automation",
    "Complimentary Breakfast and High-speed WiFi",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading and Intro */}
      <section className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left: Text + Features */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            About <span className="text-[#ffb900]">LuxuryStay</span>
          </h1>
          <p className="mt-4 text-white/80 leading-relaxed">
            Discover an elevated world of comfort, style, and impeccable service. At LuxuryStay, every
            moment is crafted to offer a royal experience — from lavish suites and curated fine dining to
            rejuvenating wellness rituals and bespoke concierge services.
          </p>

          {/* Features List */}
          <ul className="mt-6 space-y-3">
            {features.map((item) => (
              <li key={item} className="flex gap-3 items-start">
                {/* Golden accent icon */}
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffb900] text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/booking"
            className="mt-8 inline-block px-5 py-3 rounded-md bg-[#ffb900] text-black font-medium hover:brightness-110 transition"
          >
            Book Now
          </Link>
        </div>

        {/* Right: Image Gallery */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="relative h-40 md:h-56 lg:h-64 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <Image src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200" alt="Lobby" fill className="object-cover" />
          </div>
          <div className="relative h-40 md:h-56 lg:h-64 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <Image src={Suits} alt="Suite" fill className="object-cover" />
          </div>
          <div className="relative h-40 md:h-56 lg:h-64 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <Image src={Dinnig} alt="Dining" fill className="object-cover" />
          </div>
          <div className="relative h-40 md:h-56 lg:h-64 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <Image src="https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200" alt="Pool" fill className="object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
