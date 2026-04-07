import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ah-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              AIM HIGH <span className="text-ah-red">BNI</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Orange County's premier networking chapter. Building relationships,
              exchanging referrals, and growing together.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Home</Link>
              <Link to="/members" className="text-gray-400 text-sm hover:text-white transition-colors">Members</Link>
              <Link to="/visit" className="text-gray-400 text-sm hover:text-white transition-colors">Visit Us</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">hello@aimhighbni.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Aim High BNI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
