import { useParams, Link } from "react-router-dom";

export default function MemberProfile() {
  const { slug } = useParams();

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/members" className="text-ah-red text-sm hover:underline mb-8 inline-block">
          &larr; Back to Members
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0 mx-auto md:mx-0" />
            <div>
              <p className="text-sm text-ah-red uppercase tracking-wider mb-1">Meet</p>
              <h1 className="text-3xl font-bold text-ah-dark mb-2">
                {slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Member"}
              </h1>
              <p className="text-ah-gray-text">
                Member profile will load from QNT once data integration is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
