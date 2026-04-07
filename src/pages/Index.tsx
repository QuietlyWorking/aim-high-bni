import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ah-dark text-white py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            AIM HIGH <span className="text-ah-red">BNI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Orange County's premier networking chapter. Meet local business
            professionals, exchange referrals, and grow together.
          </p>
          <Link
            to="/visit"
            className="inline-block bg-ah-red text-white px-8 py-3 rounded text-lg font-semibold hover:bg-ah-red-dark transition-colors"
          >
            Visit a Meeting
          </Link>
        </div>
      </section>

      {/* Meet with us every week */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-ah-dark mb-4">
            Meet with us every week
          </h2>
          <p className="text-ah-gray-text max-w-xl mb-12">
            Every week, our members gather to build meaningful business
            relationships, share referrals, and support each other's growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Connect", desc: "Build genuine relationships with local business professionals who share your commitment to growth." },
              { title: "Refer", desc: "Exchange quality referrals with trusted partners who understand your ideal customer." },
              { title: "Grow", desc: "Leverage the power of a structured networking system to expand your business reach." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-16 h-16 bg-ah-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-ah-red rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-ah-dark mb-2">{item.title}</h3>
                <p className="text-ah-gray-text text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ah-gray py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-ah-red uppercase tracking-wider mb-8">
            Take a look at these big numbers that relate to the chapter
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "4.8", label: "Average Rating" },
              { value: "512+", label: "Referrals Passed" },
              { value: "20+", label: "Active Members" },
              { value: "100+", label: "Weekly Visitors/Year" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-ah-red">{stat.value}</div>
                <div className="text-sm text-ah-gray-text mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-ah-dark mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-ah-gray-text max-w-xl mx-auto mb-8">
            Come visit a meeting and see what structured networking can do for you.
          </p>
          <Link
            to="/visit"
            className="inline-block bg-ah-red text-white px-8 py-3 rounded text-lg font-semibold hover:bg-ah-red-dark transition-colors"
          >
            Register to Visit
          </Link>
        </div>
      </section>
    </div>
  );
}
