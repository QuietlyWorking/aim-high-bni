import { Link } from "react-router-dom";
import { Users, ArrowRight, Handshake, TrendingUp, Quote } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useChapterStats } from "@/hooks/useChapterStats";

export default function Index() {
  const { data: members } = useMembers();
  const { data: testimonials } = useTestimonials(true);
  const { data: stats } = useChapterStats();

  const featuredMembers = members?.slice(0, 6) || [];

  return (
    <div>
      {/* Hero — visitor-focused */}
      <section className="relative bg-ah-dark text-white py-20 md:py-28 overflow-hidden">
        {/* Member photo strip background */}
        {featuredMembers.length > 0 && (
          <div className="absolute inset-0 opacity-15">
            <div className="flex h-full">
              {featuredMembers.map((m) => (
                <div key={m.id} className="flex-1 h-full">
                  {m.headshot_url && (
                    <img src={m.headshot_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            AIM HIGH <span className="text-ah-red">BNI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Orange County's premier business networking chapter
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-8 max-w-3xl mx-auto">
            {stats?.tyfcb12Month || "$1.99M+"} in closed business generated for our members in the last 12 months
          </p>
          <Link
            to="/visit"
            className="inline-flex items-center gap-2 bg-ah-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ah-red-dark transition-colors shadow-lg shadow-ah-red/25"
          >
            Visit a Meeting <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Every Wednesday, 8:30 AM &mdash; Online via Zoom
          </p>
        </div>
      </section>

      {/* How it works — visitor-oriented */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ah-dark mb-4">
              Meet with us every week
            </h2>
            <p className="text-ah-gray-text max-w-2xl mx-auto">
              Aim High is a structured networking group where members build real relationships,
              pass quality referrals, and help each other grow. Here's how it works.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Handshake,
                title: "Connect",
                desc: "Build genuine relationships with local business professionals through weekly meetings and one-to-one conversations.",
              },
              {
                icon: Users,
                title: "Refer",
                desc: "Exchange quality referrals with trusted partners who understand your ideal customer — because they've gotten to know you.",
              },
              {
                icon: TrendingUp,
                title: "Grow",
                desc: "Our members generated nearly $2M in closed business last year through the power of structured, relationship-based networking.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl hover:bg-ah-gray transition-colors">
                <div className="w-16 h-16 bg-ah-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-ah-red" />
                </div>
                <h3 className="text-xl font-semibold text-ah-dark mb-2">{item.title}</h3>
                <p className="text-ah-gray-text text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — real numbers from screenshots */}
      <section className="bg-ah-red text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: stats?.tyfcb12Month || "$1.99M+", label: "Closed Business (12 Months)" },
              { value: stats?.referralsGiven || "46+", label: "Referrals Given (Q1)" },
              { value: String(stats?.memberCount || 18), label: "Active Members" },
              { value: stats?.visitorsPerYear || "100+", label: "Visitors Per Year" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-extrabold">{stat.value}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-ah-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-ah-red uppercase tracking-wider mb-2">
              What our members say
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ah-dark">
              What people are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(testimonials || []).slice(0, 6).map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm">
                <Quote className="w-8 h-8 text-ah-red/20 mb-3" />
                <p className="text-ah-dark text-sm leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  {t.author_headshot_url ? (
                    <img src={t.author_headshot_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-ah-red/10 rounded-full flex items-center justify-center">
                      <span className="text-ah-red font-semibold text-sm">
                        {t.author_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-ah-dark">{t.author_name}</div>
                    <div className="text-xs text-ah-gray-text">{t.context || "Aim High BNI Member"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Wanted Professions — attract the right visitors */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ah-dark mb-4">
              Is your profession on our Most Wanted list?
            </h2>
            <p className="text-ah-gray-text mb-8">
              We're actively looking for professionals in these categories to join our chapter.
              If you see your industry below, we have a seat reserved for you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                "Family Law Attorney",
                "Pest Control",
                "Business Attorney",
                "HVAC",
                "HR / Payroll",
                "Event Planner",
                "Landscaper",
                "Photographer",
                "Property Management",
                "General Contractor",
                "Personal Injury Attorney",
                "Fitness Trainer",
                "Title",
                "Notary",
                "Commercial Insurance",
                "Massage Therapist",
                "Chiropractor",
              ].map((profession) => (
                <span
                  key={profession}
                  className="bg-ah-gray text-ah-dark text-sm font-medium px-4 py-2 rounded-full border border-gray-200"
                >
                  {profession}
                </span>
              ))}
            </div>
            <Link
              to="/visit"
              className="inline-flex items-center gap-2 bg-ah-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ah-red-dark transition-colors"
            >
              Register to Visit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the members preview */}
      {featuredMembers.length > 0 && (
        <section className="py-16 md:py-24 bg-ah-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ah-dark mb-4">
                Meet some of our members
              </h2>
              <p className="text-ah-gray-text">
                {stats?.memberCount || 18} professionals ready to help grow your business
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredMembers.map((m) => (
                <Link
                  key={m.id}
                  to={`/members/${m.slug}`}
                  className="text-center group"
                >
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-transparent group-hover:border-ah-red transition-colors">
                    {m.headshot_url ? (
                      <img src={m.headshot_url} alt={m.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                        {m.first_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-ah-dark group-hover:text-ah-red transition-colors">
                    {m.full_name}
                  </div>
                  {m.profession_category && (
                    <div className="text-xs text-ah-gray-text">{m.profession_category}</div>
                  )}
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/members"
                className="text-ah-red font-medium hover:underline inline-flex items-center gap-1"
              >
                View all members <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-ah-dark mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-ah-gray-text max-w-xl mx-auto mb-8">
            Visit a meeting and see what happens when {stats?.memberCount || 18} professionals
            are working to send you their best referrals.
          </p>
          <Link
            to="/visit"
            className="inline-flex items-center gap-2 bg-ah-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ah-red-dark transition-colors shadow-lg shadow-ah-red/25"
          >
            Register to Visit <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
