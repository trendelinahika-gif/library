'use client';

import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe,
  ArrowRight
} from 'lucide-react';
import FindUsMap from './FindUsMap';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Membership', href: '/membership' },
    { name: 'Research', href: '/research' },
    { name: 'Digital Resources', href: '/digital' },
    { name: 'Events', href: '/events' }
  ];

  const resources = [
    { name: 'Online Catalog', href: '/catalog' },
    { name: 'Digital Library', href: '/digital' },
    { name: 'Research Guides', href: '/research-guides' },
    { name: 'Academic Support', href: '/academic-support' },
    { name: 'Children\'s Section', href: '/children' },
    { name: 'Accessibility', href: '/accessibility' }
  ];

  const support = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Technical Support', href: '/support' },
    { name: 'Report Issue', href: '/report' },
    { name: 'Feedback', href: '/feedback' }
  ];

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility Statement', href: '/accessibility-statement' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Library Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Biblioteka Kombëtare e Kosovës</h3>
              <h4 className="text-lg font-semibold text-blue-400 mb-4">"Pjetër Bogdani"</h4>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Preserving Kosovo's cultural heritage while embracing the future of digital learning and research.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <div>Sheshi "HASAN PRISHTINA" p.n.</div>
                  <div>Prishtinë 10000,</div>
                  <div>Kosovë</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <div className="text-sm">
                  <div>+383 (0)38 212 416</div>
                  <div>+383 (0)38 249 650</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@library-kosovo.org</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Mon-Fri: 8:00-20:00</span>
              </div>
            </div>
            {/* Small embedded map */}
            <FindUsMap />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3 mb-8">
              {support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest news, events, and resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
              <Link
                href="/newsletter"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>© {currentYear} National Library of Kosovo. All rights reserved.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <select className="bg-transparent border-none text-gray-400 focus:outline-none cursor-pointer">
                <option value="en">English</option>
                <option value="sq">Shqip</option>
                <option value="sr">Српски</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
