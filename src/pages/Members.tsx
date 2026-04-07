import { Link } from "react-router-dom";

export default function Members() {
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
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="text-center text-ah-gray-text mb-12">
            Member directory will load from QNT once data integration is complete.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder cards */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
