import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-6xl font-bold text-ah-red mb-4">404</h1>
        <p className="text-xl text-ah-dark mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-ah-red text-white px-6 py-3 rounded font-semibold hover:bg-ah-red-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
