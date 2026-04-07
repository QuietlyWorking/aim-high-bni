import { useSearchParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight, Users, CheckCircle } from "lucide-react";
import { useMembers, type Member } from "@/hooks/useMembers";
import { useMember } from "@/hooks/useMembers";

export default function Visit() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");
  const { data: referrer } = useMember(ref || undefined);
  const { data: members } = useMembers();

  // Speaker rotation data (from screenshots — April/May schedule)
  const upcomingSpeakers = [
    { name: "Chaplain TIG Heaslet", category: "Non-Profit", slug: "tig-heaslet", date: "Apr 9" },
    { name: "Derek Wilson", category: "Life Insurance", slug: "derek-wilson", date: "Apr 16" },
    { name: "Mark Denali", category: "Financial Advisor", slug: "mark-denali", date: "Apr 23" },
    { name: "Megan Lee", category: "Roof & Gutter", slug: "megan-lee", date: "Apr 30" },
    { name: "Jason Harmon", category: "Residential Mortgage", slug: "jason-harmon", date: "May 14" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-ah-dark text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {referrer && (
              <div className="flex items-center gap-3 mb-4 bg-white/10 rounded-lg px-4 py-3 inline-flex">
                {referrer.headshot_url && (
                  <img src={referrer.headshot_url} alt={referrer.full_name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <p className="text-white font-medium">
                  {referrer.first_name} {referrer.last_name} invited you to visit
                </p>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Visit Aim High BNI
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              See firsthand how structured networking generates nearly <span className="text-white font-semibold">$2M in closed business</span> for
              our members every year. Your first visit is free.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4 text-ah-red" />
                <span>Every Thursday</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Clock className="w-4 h-4 text-ah-red" />
                <span>11:30 AM PT</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <MapPin className="w-4 h-4 text-ah-red" />
                <span>Online via Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Main content (3 cols) */}
          <div className="lg:col-span-3 space-y-16">

            {/* What to expect */}
            <section>
              <h2 className="text-2xl font-bold text-ah-dark mb-6">What to expect at your visit</h2>
              <div className="space-y-4">
                {[
                  { title: "Open Networking", desc: "Casual introductions with members before the structured meeting begins." },
                  { title: "Member Presentations", desc: "Each member gives a 60-second overview of their business and ideal referral." },
                  { title: "Featured Speaker", desc: "One member delivers an in-depth 10-minute presentation about their expertise." },
                  { title: "Referral Passing", desc: "Watch real referrals being exchanged — this is where the business happens." },
                  { title: "Visitor Welcome", desc: "You'll have a chance to introduce yourself and your business to the group." },
                ].map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-ah-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ah-dark">{step.title}</h3>
                      <p className="text-sm text-ah-gray-text">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming speakers */}
            <section>
              <h2 className="text-2xl font-bold text-ah-dark mb-6">Featured Speakers</h2>
              <p className="text-ah-gray-text mb-6">Each week, one of our members delivers a detailed presentation. Come see what they have to offer.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {upcomingSpeakers.map((speaker) => {
                  const member = members?.find((m) => m.slug === speaker.slug);
                  return (
                    <div key={speaker.slug} className="bg-ah-gray rounded-lg p-4 text-center">
                      <div className="text-xs font-medium text-ah-red mb-2">{speaker.date}</div>
                      <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden">
                        {member?.headshot_url ? (
                          <img src={member.headshot_url} alt={speaker.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-500">
                            {speaker.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-ah-dark">{speaker.name}</div>
                      <div className="text-xs text-ah-gray-text">{speaker.category}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Members you'll meet */}
            {members && members.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-ah-dark mb-2">Members You'll Meet</h2>
                <p className="text-ah-gray-text mb-6">
                  {members.length} professionals across {new Set(members.map((m) => m.profession_category).filter(Boolean)).size} industries — each one a potential referral partner for your business.
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {members.map((m) => (
                    <Link
                      key={m.id}
                      to={`/members/${m.slug}`}
                      className="text-center group"
                    >
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-transparent group-hover:border-ah-red transition-colors">
                        {m.headshot_url ? (
                          <img src={m.headshot_url} alt={m.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-400">
                            {m.first_name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-medium text-ah-dark group-hover:text-ah-red transition-colors">
                        {m.full_name}
                      </div>
                      {m.profession_category && (
                        <span className="inline-block mt-1 text-[10px] bg-ah-red/10 text-ah-red px-2 py-0.5 rounded-full">
                          {m.profession_category}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Sticky RSVP form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-ah-dark mb-2">Register to Visit</h2>
                <p className="text-sm text-ah-gray-text mb-6">Free to attend. No obligation.</p>

                <form className="space-y-4">
                  {/* Honeypot for spam */}
                  <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div>
                    <label className="block text-sm font-medium text-ah-dark mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ah-dark mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ah-dark mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ah-dark mb-1">Business Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ah-dark mb-1">Your Industry</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                      placeholder="e.g., Real Estate, Insurance"
                    />
                  </div>

                  {ref && <input type="hidden" name="ref" value={ref} />}

                  <button
                    type="submit"
                    className="w-full bg-ah-red text-white py-3 rounded-lg font-semibold hover:bg-ah-red-dark transition-colors flex items-center justify-center gap-2"
                  >
                    Register to Visit <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-6 space-y-2">
                  {[
                    "Free to attend — no cost to visit",
                    "No sales pitch — just networking",
                    "See real referrals being exchanged",
                  ].map((perk) => (
                    <div key={perk} className="flex items-center gap-2 text-sm text-ah-gray-text">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {perk}
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Wanted mini-section */}
              <div className="mt-6 bg-ah-gray rounded-xl p-6">
                <h3 className="font-semibold text-ah-dark mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-ah-red" />
                  We're looking for
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Family Law Attorney", "Pest Control", "HVAC",
                    "Event Planner", "Photographer", "General Contractor",
                    "Fitness Trainer", "Chiropractor",
                  ].map((p) => (
                    <span key={p} className="text-xs bg-white text-ah-dark px-3 py-1 rounded-full border border-gray-200">
                      {p}
                    </span>
                  ))}
                  <span className="text-xs text-ah-red font-medium px-3 py-1">+ 9 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
