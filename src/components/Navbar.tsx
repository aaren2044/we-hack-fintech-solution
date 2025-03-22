import React from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from '../types';
import { Coins, User } from 'lucide-react'; // Import User icon

const navItems: NavItem[] = [
  // { label: 'News', href: '/news' },
  // { label: 'Government Schemes', href: '/schemes' },
  // { label: 'Courses', href: '/courses' },
  // { label: 'Community', href: '/community' },
  // { label: 'Tools', href: '/tools' },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Coins className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinStart</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}

            {/* Profile Icon Link */}
            <Link
              to="/login" // Adjust this route as needed
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50 flex items-center"
            >
              <User className="h-6 w-6 mr-1" /> {/* Profile Icon */}
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
