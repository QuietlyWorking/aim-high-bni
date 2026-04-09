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

    const form = e.currentTarget;
    const data = new FormData(form);

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

  return (
    <div className="mt-8 bg-[#f5f5f5] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
          <svg className="w-5 h-5 text-[#c41230]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Say something nice about {memberName}
        </h2>
        {!showForm && status !== "success" && (
          <button
            onClick={() => setShowForm(true)}
            className="text-[#c41230] text-sm font-medium hover:underline"
          >
            Write a note
          </button>
        )}
      </div>

      {!showForm && status !== "success" && (
        <p className="text-sm text-[#666]">
          Had a great experience with {memberName}? Received a referral? Let them know!
        </p>
      )}

      {showForm && status !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Your Name</label>
            <input
              type="text"
              name="author_name"
              required
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
      )}

      {status === "success" && (
        <div className="text-center py-4">
          <p className="text-[#1a1a1a] font-medium">Thank you for your kind words!</p>
          <p className="text-sm text-[#666] mt-1">
            Your message will appear after review.
          </p>
        </div>
      )}
    </div>
  );
}
