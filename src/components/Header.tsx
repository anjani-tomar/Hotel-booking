"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

const tabs = [
    { href: "/", label: "Home", icon: true },
    { href: "/about", label: "About Us" },
    { href: "/help", label: "Help" },
    { href: "/contact", label: "Contact Us" },
];

function HomeIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.25 8.25a.75.75 0 1 1-1.06 1.06l-.97-.97V20a2.25 2.25 0 0 1-2.25 2.25H7.5A2.25 2.25 0 0 1 5.25 20v-7.82l-.97.97a.75.75 0 1 1-1.06-1.06l8.25-8.25ZM6.75 12.69V20c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75v-7.31L12 6.69l-5.25 6Z" />
        </svg>
    );
}

export default function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        try {
            const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
            const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = (stored === "light" || stored === "dark") ? stored : (prefersDark ? "dark" : "light");
            document.documentElement.setAttribute("data-theme", initial);
        } catch {}
    }, []);


    return (
        <header className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-semibold tracking-wide text-white">
                        Luxury<span className="text-amber-300">Stay</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-2">
                        {tabs.map((t) => {
                            const active =
                                pathname === t.href ||
                                (t.href !== "/" && pathname?.startsWith(t.href));
                            return (
                                <Link
                                    key={t.href}
                                    href={t.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                    ${active
                                            ? "bg-[#ffb900] text-black"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {t.icon ? <HomeIcon className="w-4 h-4" /> : null}
                                    {t.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="md:hidden flex items-center gap-1">

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="text-white p-2 rounded hover:bg-white/10 md:hidden"
                        >
                            {/* Hamburger icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                {menuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <Transition
                show={menuOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
            >
                <div className="md:hidden bg-[#2a2f3dd9] border-t border-white/10 px-4 py-3 space-y-2">
                    {tabs.map((t) => {
                        const active =
                            pathname === t.href ||
                            (t.href !== "/" && pathname?.startsWith(t.href));
                        return (
                            <Link
                                key={t.href}
                                href={t.href}
                                className={`block px-3 py-2 rounded-md text-base transition-colors
                  ${active
                                        ? "bg-[#ffb900] text-black"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {t.icon ? <HomeIcon className="w-4 h-4 inline mr-2" /> : null}
                                {t.label}
                            </Link>
                        );
                    })}
                </div>
            </Transition>
        </header>
    );
}
