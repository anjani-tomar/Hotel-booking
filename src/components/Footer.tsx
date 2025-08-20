import Link from "next/link";

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 transition-colors"
    >
      {children}
      <span>{label}</span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-br from-white/5 to-white/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold">LuxuryStay</h3>
          <p className="mt-2 text-sm text-white/80">
            Experience refined comfort with world-class amenities and bespoke hospitality.
          </p>
          <div className="mt-4 space-y-1 text-sm text-white/70">
            <p>
              <span className="font-medium">Location:</span> 221B Grand Avenue, Indore, MP
            </p>
            <p>
              <span className="font-medium">Phone:</span> +91 79746 41785
            </p>
            <p>
              <span className="font-medium">Email:</span> bookings@luxurystay.example
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-white/80 text-sm">
            <li><Link className="hover:underline" href="/">Home</Link></li>
            <li><Link className="hover:underline" href="/about">About Us</Link></li>
            <li><Link className="hover:underline" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:underline" href="/help">Help</Link></li>
            <li><Link className="hover:underline" href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-3 flex-wrap">
            <SocialLink href="https://maps.google.com" label="Location">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.25A7.5 7.5 0 0 0 4.5 9.75c0 5.25 7.5 12 7.5 12s7.5-6.75 7.5-12A7.5 7.5 0 0 0 12 2.25Zm0 10.125a2.625 2.625 0 1 1 0-5.25 2.625 2.625 0 0 1 0 5.25Z"/></svg>
            </SocialLink>
            <SocialLink href="https://instagram.com" label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M7 2.25A4.75 4.75 0 0 0 2.25 7v10A4.75 4.75 0 0 0 7 21.75h10A4.75 4.75 0 0 0 21.75 17V7A4.75 4.75 0 0 0 17 2.25H7Zm5 4.5a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5Zm6-1.125a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Z"/></svg>
            </SocialLink>
            <SocialLink href="https://facebook.com" label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M13.5 9H15V6h-1.5C11.57 6 10 7.57 10 9.5V11H8v3h2v6h3v-6h2.1l.9-3H13v-1.5c0-.28.22-.5.5-.5Z"/></svg>
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} LuxuryStay. All rights reserved.
      </div>
    </footer>
  );
}
