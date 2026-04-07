import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-ah-dark">
            AIM HIGH <span className="text-ah-red">BNI</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-ah-dark hover:text-ah-red transition-colors">
            Home
          </Link>
          <Link to="/members" className="text-sm font-medium text-ah-dark hover:text-ah-red transition-colors">
            Members
          </Link>
          <Link
            to="/visit"
            className="bg-ah-red text-white px-5 py-2 rounded text-sm font-semibold hover:bg-ah-red-dark transition-colors"
          >
            Visit Us
          </Link>
        </div>
        <div className="md:hidden">
          <Link
            to="/visit"
            className="bg-ah-red text-white px-4 py-2 rounded text-sm font-semibold hover:bg-ah-red-dark transition-colors"
          >
            Visit Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
