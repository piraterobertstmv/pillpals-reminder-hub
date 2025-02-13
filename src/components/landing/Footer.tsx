
import { Link } from "react-router-dom";
import { Pill } from "lucide-react";

export const Footer = () => (
  <footer className="bg-gray-50 border-t">
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Pill className="w-6 h-6 text-lavender" />
          <span className="text-xl font-bold">PillPals</span>
        </div>
        <div className="flex gap-6">
          <Link to="#" className="text-gray-600 hover:text-gray-900">Contact</Link>
          <Link to="#" className="text-gray-600 hover:text-gray-900">Privacy</Link>
          <Link to="#" className="text-gray-600 hover:text-gray-900">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);
