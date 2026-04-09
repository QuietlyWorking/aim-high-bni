import { useState, type FormEvent } from "react";

interface Props {
  refSlug?: string;
  referrerName?: string;
  orgId: string;
}

export default function RsvpForm({ refSlug, referrerName, orgId }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check
    if (data.get("website_url")) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.get("full_name"),
          email: data.get("email"),
          phone: data.get("phone") || null,
          business_name: data.get("business_name") || null,
          industry: data.get("industry") || null,
          ref: refSlug || null,
          organization_id: orgId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(body.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">You're registered!</h2>
        <p className="text-sm text-[#666]">
          We'll send you a reminder before the next meeting. Looking forward to meeting you!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Register to Visit</h2>
      <p className="text-sm text-[#666] mb-6">Free to attend. No obligation.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot */}
        <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Full Name *</label>
          <input
            type="text"
            name="full_name"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230]"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230]"
            placeholder="(555) 555-5555"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Business Name</label>
          <input
            type="text"
            name="business_name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230]"
            placeholder="Your company"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Your Industry</label>
          <input
            type="text"
            name="industry"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230]"
            placeholder="e.g., Real Estate, Insurance"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-[#c41230] text-white py-3 rounded-lg font-semibold hover:bg-[#a00f28] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {status === "submitting" ? "Registering..." : "Register to Visit"}
          {status !== "submitting" && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {["Free to attend — no cost to visit", "No sales pitch — just networking", "See real referrals being exchanged"].map((perk) => (
          <div key={perk} className="flex items-center gap-2 text-sm text-[#666]">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {perk}
          </div>
        ))}
      </div>
    </div>
  );
}
