import Image from "next/image";
import Link from "next/link";

// Typed data model for hotel/suite cards
interface SuiteCard {
  id: string;
  title: string;
  desc: string;
  price: string; // formatted label
  priceNum: number; // numeric value per night
  currency: string;
  image: string;
}

export default function Home() {
  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none -z-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[var(--text)]">
              Elevate your stay with <span className="text-[var(--accent)]">Luxury</span>
            </h1>
            <p className="mt-4 text-[var(--text-muted)]">
              Discover curated rooms, gourmet dining, and personalized experiences at LuxuryStay.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/booking" className="px-5 py-3 cursor-pointer rounded-md bg-[#ffb900] text-black font-medium hover:opacity-90 flex items-center">Book Now</Link>
              <Link href="/about" className="px-5 py-3 cursor-pointer rounded-md bg-[var(--surface)] hover:opacity-90 border border-[var(--border)]">Explore</Link>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <Image src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600" alt="Hotel room" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
        {[
          { title: "Prime Locations", desc: "Stay in the heart of the city with stunning views." },
          { title: "World‑class Dining", desc: "Savor dishes crafted by award‑winning chefs." },
          { title: "Spa & Wellness", desc: "Rejuvenate with premium spa and wellness therapies." },
        ].map((f) => (
          <div key={f.title} className="rounded-xl p-6 bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-lg text-[var(--text)]">{f.title}</h3>
            <p className="mt-2 text-[var(--text-muted)] text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. Suites Frames (5 sections) */}
      {(() => {
        const suites: SuiteCard[] = [
          {
            id: 'sig-001',
            title: "Signature Suite",
            desc:
              "Experience expansive city views, bespoke furnishings, and a marble ensuite bath. Enjoy complimentary breakfast and lounge access.",
            price: "₹ 9,999",
            priceNum: 9999,
            currency: '₹',
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600",
          },
          {
            id: 'pres-002',
            title: "Presidential Suite",
            desc:
              "A palatial residence with private lounge, butler service, and panoramic skyline views.",
            price: "₹ 19,999",
            priceNum: 19999,
            currency: '₹',
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600",
          },
          {
            id: 'exec-003',
            title: "Executive Room",
            desc:
              "Smart, elegant space for business travelers with ergonomic workspace and fast Wi‑Fi.",
            price: "₹ 6,499",
            priceNum: 6499,
            currency: '₹',
            image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600",
          },
          {
            id: 'dlx-004',
            title: "Deluxe King Room",
            desc:
              "A spacious retreat featuring a plush king bed, warm tones, and city vistas.",
            price: "₹ 7,999",
            priceNum: 7999,
            currency: '₹',
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600",
          },
          {
            id: 'fam-005',
            title: "Family Suite",
            desc:
              "Designed for families with a separate living area, twin options, and kid‑friendly amenities.",
            price: "₹ 8,999",
            priceNum: 8999,
            currency: '₹',
            image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600",
          },
        ];
        return suites.map((s) => (
          <section key={s.title} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-stretch rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
              {/* Left: description */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text)]">{s.title}</h2>
                <p className="mt-3 text-[var(--text-muted)] text-sm md:text-base">{s.desc}</p>
                <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs md:text-sm text-[var(--text-subtle)]">Starting from</p>
                    <p className="text-2xl md:text-3xl font-semibold text-[var(--text)]">{s.price}<span className="text-xs md:text-sm text-[var(--text-subtle)]"> /night</span></p>
                  </div>
                  <Link
                    href={{
                      pathname: '/booking',
                      query: {
                        hotel: 'LuxuryStay Mumbai',
                        room: s.title,
                        image: s.image,
                        price: String(s.priceNum),
                        currency: s.currency,
                        id: s.id,
                      },
                    }}
                    className="px-4 md:px-5 py-2.5 md:py-3 rounded-md bg-[#ffb900] text-black font-medium hover:opacity-90 whitespace-nowrap"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
              {/* Right: images */}
              <div className="relative min-h-60 md:min-h-72">
                <Image src={s.image} alt={s.title} fill className="object-cover" />
              </div>
            </div>
          </section>
        ));
      })()}

      {/* 4. Amenities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Amenities</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "High‑speed Wi‑Fi",
            "Infinity Pool",
            "24/7 Concierge",
            "Airport Transfers",
            "Fitness Center",
            "Business Lounge",
          ].map((a) => (
            <div key={a} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text)]">{a}</div>
          ))}
        </div>
      </section>

      {/* 5. Testimonials / CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-xl p-6 bg-[var(--surface)] border border-[var(--border)]">
          <p className="text-[var(--text)] italic">
            “Exceptional service and breathtaking views. The Signature Suite was pure indulgence!”
          </p>
          <p className="mt-3 text-sm text-[var(--text-subtle)]">— A. Sharma, Mumbai</p>
        </div>
        <div className="text-center md:text-right">
          <h3 className="text-2xl font-semibold text-[var(--text)]">Ready to experience LuxuryStay?</h3>
          <Link href="/booking" className="mt-4 inline-block px-5 py-3 rounded-md bg-[#ffb900] text-black font-medium hover:opacity-90">Book Now</Link>
        </div>
      </section>
    </div>
  );
}
