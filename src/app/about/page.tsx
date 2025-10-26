'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Users, Award, Globe, Heart, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission')

  const features = [
    {
      icon: BookOpen,
      title: 'Vast Collection',
      description: 'Over 500,000 books, manuscripts, and digital resources spanning centuries of knowledge',
      stat: '500K+'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Serving 50,000+ active members and growing community of learners and researchers',
      stat: '50K+'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Recognized for outstanding service and innovation in library management',
      stat: '25+'
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Resources in 15+ languages including Albanian, Serbian, and English',
      stat: '15+'
    }
  ]

  const values = [
    'Preserving Kosovo\'s cultural heritage',
    'Promoting literacy and education',
    'Fostering community engagement',
    'Embracing digital innovation',
    'Ensuring equal access to knowledge'
  ]

  const history = [
    {
      year: '1944',
      title: 'Foundation',
      description: 'The National Library of Kosovo was established as a cornerstone of cultural preservation.'
    },
    {
      year: '1982',
      title: 'New Building',
      description: 'The iconic library building designed by Croatian architect Andrija Mutnjaković was completed.'
    },
    {
      year: '1999',
      title: 'Post-War Recovery',
      description: 'Extensive restoration and modernization following the Kosovo War.'
    },
    {
      year: '2008',
      title: 'Digital Transformation',
      description: 'Launch of digital services and online catalog system.'
    },
    {
      year: '2020',
      title: 'Modern Era',
      description: 'Implementation of advanced digital resources and virtual services.'
    }
  ]

  const tabs = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'history', label: 'History' },
    { id: 'team', label: 'Our Team' },
    { id: 'awards', label: 'Awards' }
  ]

  const team = [
    {
      name: 'Dr. Pjetër Bogdani',
      position: 'Director',
      description: 'Leading the library\'s vision for digital innovation and cultural preservation.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Prof. Shpresa Gashi',
      position: 'Head of Collections',
      description: 'Expert in Albanian literature and cultural heritage preservation.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Dr. Arben Krasniqi',
      position: 'Digital Services Manager',
      description: 'Leading digital transformation and technology integration initiatives.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
    }
  ]

  const awards = [
    {
      title: 'UNESCO Memory of the World',
      year: '2023',
      description: 'Recognition for preserving Kosovo\'s documentary heritage'
    },
    {
      title: 'European Library Excellence Award',
      year: '2022',
      description: 'Outstanding achievement in digital library services'
    },
    {
      title: 'Kosovo Cultural Heritage Award',
      year: '2021',
      description: 'Exceptional contribution to cultural preservation'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">About Us</h1>
            <p className="text-gray-600 dark:text-gray-400">Discover the story behind Kosovo's premier library</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with image and gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center mb-16"
        >
          <div className="absolute inset-0 -z-10">
            <div className="w-full h-72 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 rounded-3xl shadow-xl" />
          </div>
          <img src="https://www.whitemad.pl/wp-content/uploads/2024/07/2048px-Drone_imagary_of_the_National_Library_of_Kosovo_08.jpg" alt="Library Hero" className="mx-auto rounded-2xl shadow-lg object-cover w-full max-w-3xl h-72 mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-lg">
            Biblioteka Kombëtare e Kosovës
          </h2>
          <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            "Pjetër Bogdani"
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
            Preserving Kosovo's cultural heritage while embracing the future of digital learning and research. <br />
            <span className="font-semibold text-blue-700 dark:text-blue-300">We are more than a library – we are a gateway to knowledge, culture, and community.</span>
          </p>
        </motion.div>

        {/* Features Grid with animated stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-2xl p-8 shadow-lg text-center border border-blue-100 dark:border-blue-900"
            >
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2 tracking-tight animate-pulse">
                {feature.stat}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tabs Section */}
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-blue-100 dark:border-blue-900">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'mission' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The National Library of Kosovo "Pjetër Bogdani" is dedicated to preserving, 
                    promoting, and providing access to Kosovo's rich cultural and intellectual heritage. 
                    We serve as a bridge between the past and future, ensuring that knowledge remains 
                    accessible to all members of our community.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Core Values</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.map((value, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our History</h3>
                <div className="space-y-6">
                  {history.map((item, index) => (
                    <div key={index} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{item.year}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {team.map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                        {member.position}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {member.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'awards' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recognition & Awards</h3>
                <div className="space-y-4">
                  {awards.map((award, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                          <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {award.title}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {award.year}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {award.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
