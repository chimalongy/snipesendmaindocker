'use client';

import React from 'react';
import Link from 'next/link';
import { RiSendPlaneFill } from 'react-icons/ri';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <RiSendPlaneFill className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SnipeSend
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">About Us</Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Pricing</Link>
              <Link href="/faq" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">FAQ</Link>
              <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Blog</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden md:inline text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">Login</Link>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
