'use client';

import { useState } from 'react';
import { Search, BookOpen, Calendar, Users, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden pt-20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-400 to-pink-600 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900">National Library of </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kosovo
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Discover, learn, and explore our vast collection of books, digital resources, and cultural heritage
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, topics..."
                className="w-full px-6 py-4 text-lg bg-white text-gray-900 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 shadow-xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full transition-all shadow-lg"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Browse Catalog</span>
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Upcoming Events</span>
            </Link>
            <Link
              href="/digital"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Digital Resources</span>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
            >
              Join Our Community
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-full transition-all border-2 border-gray-200 hover:border-gray-300 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
