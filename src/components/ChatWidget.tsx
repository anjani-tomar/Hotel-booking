"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";

// Safe ID generator that works even if crypto.randomUUID is unavailable
function genId(): string {
  // Prefer browser crypto.randomUUID when available
  // Fallback to getRandomValues or Math.random-based ID
  try {
    if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
      return (crypto as any).randomUUID();
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      // Set version and variant bits for RFC4122 v4
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0"));
      return (
        hex.slice(0, 4).join("") +
        hex.slice(4, 6).join("") +
        "-" +
        hex.slice(6, 8).join("") +
        "-" +
        hex.slice(8, 10).join("") +
        "-" +
        hex.slice(10, 12).join("") +
        "-" +
        hex.slice(12, 16).join("")
      );
    }
  } catch {}
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
}

function BotAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold">
      LS
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-[12px]">
      You
    </div>
  );
}

export default function ChatWidget() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: genId(),
    role: "assistant",
    content: "Hi! I’m your LuxuryStay assistant. Ask me about rooms, amenities, or booking.",
    ts: Date.now(),
  }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const canSend = input.trim().length > 0 && !sending;

  async function sendMessage() {
    if (!canSend) return;
    const userMsg: Message = {
      id: genId(),
      role: "user",
      content: input.trim(),
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch(`${base}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id: genId(),
        role: "assistant",
        content: data.reply ?? "Thanks for your message!",
        ts: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      const errMsg: Message = {
        id: genId(),
        role: "assistant",
        content: "Sorry, I couldn’t reach the server. Please try again.",
        ts: Date.now(),
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed right-4 bottom-10 z-50 select-none">
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group relative flex items-center gap-2 rounded-full bg-amber-400 text-black pl-3 pr-4 py-2 shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 transition-all duration-200"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-amber-200 animate-ping" />
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
          {/* chat icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M7.5 8.25h9m-9 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0ZM7.5 17.25H6a.75.75 0 01-.75-.75V9A1.5 1.5 0 016.75 7.5h10.5A1.5 1.5 0 0118.75 9v4.5A1.5 1.5 0 0117.25 15H12l-3.75 3.75a.75.75 0 01-1.28-.53v-.97z" />
          </svg>
        </span>
        <span className="text-sm font-semibold">Chat</span>
      </button>

      {/* Panel */}
      <Transition
        show={open}
        enter="transition duration-300 ease-out"
        enterFrom="opacity-0 translate-y-4 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition duration-200 ease-in"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-4 scale-95"
      >
        <div className="mt-3 w-[22rem] sm:w-[24rem] rounded-xl border border-white/10 bg-[#1f2430]/95 backdrop-blur-md shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <BotAvatar />
              <div>
                <div className="text-sm font-semibold">LuxuryStay Assistant</div>
                <div className="text-xs text-white/70">Online • Typically replies in seconds</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="px-4 py-3 max-h-80 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed border ${m.role === "user" ? "bg-white/10 border-white/15" : "bg-amber-400/15 border-amber-400/30"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-start gap-3">
                <BotAvatar />
                <div className="rounded-2xl px-3 py-2 text-sm leading-relaxed border bg-amber-400/15 border-amber-400/30">
                  <span className="inline-flex gap-1 items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-300 animate-bounce [animation-delay:-200ms]" />
                    <span className="h-2 w-2 rounded-full bg-amber-300 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-amber-300 animate-bounce [animation-delay:200ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about rooms, pricing, or amenities..."
                className="flex-1 bg-[#1b202b] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/40"
              />
              <button
                disabled={!canSend}
                onClick={sendMessage}
                className="rounded-lg px-3 py-2 bg-amber-400 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-300 transition-colors"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-[11px] text-white/60">
              Quick tips: Try "Show me suite options", "What amenities do you have?", or <Link href="/contact" className="underline hover:text-white">contact us</Link>.
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
