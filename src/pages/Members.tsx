import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";

export default function Members() {
  const { data: members, isLoading } = useMembers();

  return (
    <div>
      <section className="bg-ah-red text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-wider mb-2 text-white/70">
            Meet the Infamous
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Aim High BNI Members
          </h1>
          {members && (
            <p className="text-white/70 mt-4">
              {members.length} professionals across {new Set(members.map((m) => m.profession_category).filter(Boolean)).size} industries
            </p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center animate-pulse">
                  <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((m) => (
                <Link
                  key={m.id}
                  to={`/members/${m.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md hover:border-ah-red/20 transition-all group"
                >
                  <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden border-3 border-transparent group-hover:border-ah-red transition-colors">
                    {m.headshot_url ? (
                      <img src={m.headshot_url} alt={m.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                        {m.first_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-ah-dark group-hover:text-ah-red transition-colors">
                    {m.full_name}
                  </h3>
                  {m.business_name && (
                    <p className="text-sm text-ah-gray-text mt-1">{m.business_name}</p>
                  )}
                  {m.profession_category && (
                    <span className="inline-block mt-2 text-xs bg-ah-red/10 text-ah-red px-3 py-1 rounded-full font-medium">
                      {m.profession_category}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-ah-gray-text">
              Member directory loading...
            </p>
          )}

          {/* CTA */}
          <div className="text-center mt-16 py-12 bg-ah-gray rounded-xl">
            <h2 className="text-2xl font-bold text-ah-dark mb-3">
              Want to meet these professionals in person?
            </h2>
            <p className="text-ah-gray-text mb-6">
              Visit a meeting and see how we work together.
            </p>
            <Link
              to="/visit"
              className="inline-flex items-center gap-2 bg-ah-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-ah-red-dark transition-colors"
            >
              Register to Visit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
