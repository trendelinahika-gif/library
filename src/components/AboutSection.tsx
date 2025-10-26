'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Globe, Heart, ArrowRight, CheckCircle, Star } from 'lucide-react'

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  const features = [
    {
      icon: BookOpen,
      title: 'Vast Collection',
      description: 'Over 500,000 books, manuscripts, and digital resources'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Serving 50,000+ active members and growing'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Recognized for outstanding service and innovation'
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Resources in 15+ languages including Albanian, Serbian, and English'
    }
  ]

  const values = [
    'Preserving Kosovo\'s cultural heritage',
    'Promoting literacy and education',
    'Fostering community engagement',
    'Embracing digital innovation',
    'Ensuring equal access to knowledge'
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('about-section')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about-section" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Our Library
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the story behind Kosovo's premier knowledge institution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://www.whitemad.pl/wp-content/uploads/2024/07/2048px-Drone_imagary_of_the_National_Library_of_Kosovo_08.jpg"
                alt="National Library of Kosovo"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">National Library of Kosovo</h3>
                <p className="text-sm opacity-90">Established 1999</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              The National Library of Kosovo serves as the cornerstone of knowledge, culture, and education in Kosovo. 
              We are committed to preserving our rich heritage while embracing the future of digital learning and research.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Since our establishment in 1999, we have grown into a modern, inclusive institution that welcomes 
              all members of our community to explore, learn, and discover.
            </p>

            {/* Values */}
            <div className="space-y-3">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Core Values
              </h4>
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="text-center group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Community Today
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Become a member and unlock access to our vast collection of resources, 
              exclusive events, and a vibrant community of learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Become a Member
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 border border-white/30"
              >
                <ArrowRight className="w-5 h-5" />
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
