import { useState, type FormEvent } from "react";

interface Props {
  memberSlug: string;
  memberName: string;
  orgId: string;
}

export default function TestimonialForm({ memberSlug, memberName, orgId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: data.get("author_name"),
          message: data.get("message"),
          about_member_slug: memberSlug,
          organization_id: orgId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(body.error || "Something went wrong");
      }

      setStatus("success");
      setShowForm(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c41230]/10 mb-4">
          <svg className="w-7 h-7 text-[#c41230]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-[#1a1a1a] font-semibold text-lg">Thank you for your kind words!</p>
        <p className="text-sm text-[#666] mt-1">
          Your message about {memberName} will appear after review.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="mt-8 w-full text-left group cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 transition-all duration-300 ease-out hover:border-[#c41230]/40 hover:bg-[#c41230]/[0.02] hover:shadow-lg hover:shadow-[#c41230]/5 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#c41230]/30 focus:ring-offset-2"
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#c41230]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#c41230]/20 group-hover:scale-110">
            <svg className="w-6 h-6 text-[#c41230] transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-[#1a1a1a] group-hover:text-[#c41230] transition-colors duration-300">
              Say something nice about {memberName}
            </p>
            <p className="text-sm text-[#666] mt-0.5">
              Had a great experience? Received a referral? Let them know!
            </p>
          </div>
          <div className="flex-shrink-0 text-[#c41230] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in">
      <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#c41230]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Say something nice about {memberName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Your Name</label>
          <input
            type="text"
            name="author_name"
            required
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Your Message</label>
          <textarea
            name="message"
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c41230]/50 focus:border-[#c41230] resize-none"
            placeholder={`What would you like to say about ${memberName}?`}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-[#c41230] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#a00f28] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {status === "submitting" ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-[#666] text-sm hover:text-[#1a1a1a] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
