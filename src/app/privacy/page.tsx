import Link from "next/link";

export const metadata = {
  title: "Privacy Policy – LuxuryStay",
};

export default function PrivacyPage() {
  const lastUpdated = "[Date]"; // Replace with an actual date string when needed

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          Privacy Policy – <span className="text-[#ffb900]">LuxuryStay</span>
        </h1>
        <p className="mt-2 text-sm text-white/60">Last updated: {lastUpdated}</p>
        <p className="mt-4 text-white/80">
          This Privacy Policy explains how LuxuryStay ("we", "us", or "our") collects, uses, and protects
          personal information of users ("you", "your") when using our hotel booking mobile application (the
          "Service"). We are committed to ensuring your privacy and complying with applicable data protection
          laws, including the General Data Protection Regulation (GDPR).
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {/* 1. Information We Collect */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">1.</span> Information We Collect
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">We may collect the following types of information:</p>
          <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
            <li><span className="text-white">Personal Identification Data:</span> Full name, email address, phone number, and postal address.</li>
            <li><span className="text-white">Booking Information:</span> Hotel selection, check-in/check-out dates, special requests, guest preferences.</li>
            <li><span className="text-white">Payment Details:</span> Credit/debit card or other payment information processed securely through third-party gateways.</li>
            <li><span className="text-white">Device & Usage Data:</span> IP address, device type, browser info, app usage patterns, and log data.</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">2.</span> How We Use Your Information
          </h2>
          <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
            <li>To create and manage user accounts.</li>
            <li>To process hotel bookings and transactions.</li>
            <li>To send confirmations, notifications, and updates.</li>
            <li>To improve our services, user experience, and application performance.</li>
            <li>To provide customer support.</li>
            <li>To send promotional or marketing communications (only with your consent).</li>
            <li>To comply with legal obligations and protect our legal rights.</li>
          </ul>
        </section>

        {/* 3. Legal Basis (GDPR Compliance) */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">3.</span> Legal Basis (GDPR Compliance)
          </h2>
          <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
            <li>Your consent.</li>
            <li>The performance of a contract (booking services).</li>
            <li>Legal obligations.</li>
            <li>Our legitimate interests (such as security, service improvement, fraud prevention).</li>
          </ul>
        </section>

        {/* 4. Data Sharing & Disclosure */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">4.</span> Data Sharing & Disclosure
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We do not sell your personal data. We may share your information only with:
          </p>
          <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
            <li>Hotel partners to facilitate your booking.</li>
            <li>Payment processors to complete transactions securely.</li>
            <li>Third-party service providers who assist with analytics, customer support, or marketing (under strict confidentiality).</li>
            <li>Regulatory or legal authorities, if required by law.</li>
          </ul>
        </section>

        {/* 5. Data Security */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">5.</span> Data Security
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We use industry-standard security measures (encryption, secure servers, limited access) to protect your
            personal information. While we strive to use commercially acceptable means, we cannot guarantee absolute
            security.
          </p>
        </section>

        {/* 6. Your Rights */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">6.</span> Your Rights
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">Depending on applicable laws (e.g. GDPR), you have the right to:</p>
          <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
            <li>Access, update, or delete your personal data.</li>
            <li>Request restriction or objection to processing.</li>
            <li>Withdraw your consent at any time.</li>
            <li>Request a copy of the data we hold about you (data portability).</li>
          </ul>
          <p className="mt-3 text-white/80">To exercise these rights, please contact us using the details below.</p>
        </section>

        {/* 7. Data Retention */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">7.</span> Data Retention
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We retain your information only as long as necessary to fulfill the purposes outlined in this Policy,
            unless a longer retention period is required by law.
          </p>
        </section>

        {/* 8. Children’s Privacy */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">8.</span> Children’s Privacy
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal
            data from children. If you believe a child has provided us information, please contact us and we will take
            appropriate steps to delete it.
          </p>
        </section>

        {/* 9. Changes to This Policy */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">9.</span> Changes to This Policy
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted within the app and the
            "Last updated" date will be revised. Continued use of the Service after changes implies acceptance.
          </p>
        </section>

        {/* 10. Contact Us */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            <span className="text-[#ffb900]">10.</span> Contact Us
          </h2>
          <div className="mt-3 text-white/80 leading-relaxed">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, you may contact us at:</p>
            <p className="mt-2"><span className="text-white">Company Name:</span> LuxuryStay</p>
            <p className="mt-1"><span className="text-white">Email:</span> support@luxurystay.com</p>
            <p className="mt-1"><span className="text-white">Address:</span> [Company Address]</p>
          </div>
          <div className="mt-5">
            <Link href="/booking" className="inline-block rounded-md bg-[#ffb900] px-5 py-3 font-medium text-black hover:brightness-110">
              Book Now
            </Link>
          </div>
        </section>
      </div>

      <p className="mt-8 text-center text-xs text-white/50">
        This Privacy Policy reflects LuxuryStay’s commitment to excellence and discretion.
      </p>
    </div>
  );
}
