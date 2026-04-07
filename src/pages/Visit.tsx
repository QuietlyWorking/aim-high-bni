import { useSearchParams } from "react-router-dom";

export default function Visit() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div>
      <section className="bg-ah-dark text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {ref && (
              <p className="text-ah-red font-medium mb-2">
                You've been invited by {ref.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Visit Aim High BNI
            </h1>
            <p className="text-gray-300 text-lg">
              Experience the power of structured networking. Register below to
              attend our next meeting and see how referral-based business growth works.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* RSVP Form */}
            <div>
              <h2 className="text-2xl font-bold text-ah-dark mb-6">Register to Visit</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ah-dark mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ah-dark mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ah-dark mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                    placeholder="(555) 555-5555"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ah-dark mb-1">Business Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ah-dark mb-1">Industry / Category</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                    placeholder="e.g., Real Estate, Insurance, Marketing"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-ah-red text-white py-3 rounded font-semibold hover:bg-ah-red-dark transition-colors"
                >
                  Register to Visit
                </button>
              </form>
              <p className="text-xs text-ah-gray-text mt-3">
                RSVP form will be connected to QNT backend in a future phase.
              </p>
            </div>

            {/* Meeting Info */}
            <div>
              <h2 className="text-2xl font-bold text-ah-dark mb-6">Meeting Details</h2>
              <div className="bg-ah-gray rounded-lg p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-ah-gray-text">When</div>
                  <div className="text-ah-dark font-semibold">Every Wednesday, 8:30 AM - 10:00 AM</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-ah-gray-text">Where</div>
                  <div className="text-ah-dark font-semibold">Online via Zoom</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-ah-gray-text">Chapter</div>
                  <div className="text-ah-dark font-semibold">Aim High BNI — Orange County, CA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
