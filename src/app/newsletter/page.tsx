'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const NewsletterPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail('')
    }, 2000)
  }

  const newsletterFeatures = [
    {
      title: 'Latest News & Updates',
      description: 'Stay informed about library services, new collections, and community events'
    },
    {
      title: 'Event Announcements',
      description: 'Get notified about upcoming workshops, exhibitions, and cultural programs'
    },
    {
      title: 'New Book Releases',
      description: 'Be the first to know about new additions to our digital and physical collections'
    },
    {
      title: 'Research Resources',
      description: 'Access to exclusive research materials and academic support updates'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Newsletter Subscription</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay connected with the National Library of Kosovo</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Subscribe?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join thousands of library members who stay informed about our latest resources, 
                  events, and services. Our newsletter is your gateway to the rich cultural and 
                  educational offerings of the National Library of Kosovo.
                </p>
              </div>

              <div className="space-y-4">
                {newsletterFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What to Expect
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li>• Weekly updates on library services and programs</li>
                  <li>• Monthly highlights of new collections and resources</li>
                  <li>• Special announcements for members-only events</li>
                  <li>• Research tips and academic support information</li>
                  <li>• Cultural heritage and historical content</li>
                </ul>
              </div>
            </div>

            {/* Subscription Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscribe Now</h2>

                {isSubscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Successfully Subscribed!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for subscribing to our newsletter. You'll receive your first update within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubscribed(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                    >
                      Subscribe Another Email
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{error}</span>
                      </motion.div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Privacy & Preferences
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• We respect your privacy and never share your email</li>
                        <li>• You can unsubscribe at any time</li>
                        <li>• We send 1-2 emails per week maximum</li>
                        <li>• All emails include unsubscribe links</li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Subscribe to Newsletter
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  If you have questions about our newsletter or need assistance with your subscription, 
                  please don't hesitate to contact us.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Email:</strong> newsletter@library-kosovo.org
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Phone:</strong> +383 (0)38 212 416
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterPage
