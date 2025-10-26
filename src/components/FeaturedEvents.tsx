'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ArrowRight, Star, Share2 } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  eventDate: string
  startTime: string
  endTime: string
  location: {
    name: string
    address: string
  }
  category: string
  image: string
  isFeatured: boolean
  isFree: boolean
  price?: number
  maxAttendees?: number
  currentAttendees: number
  organizer: {
    name: string
  }
}

const FeaturedEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [learnMoreLoading, setLearnMoreLoading] = useState<string | null>(null)
  const handleLearnMore = (eventId: string, href: string) => {
    setLearnMoreLoading(eventId)
    setTimeout(() => {
      window.location.href = href
    }, 1200)
  }

  // Mock data - in real app, this would come from API
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Kosovo Literature Festival 2024',
      description: 'A celebration of contemporary Kosovo literature with readings, discussions, and book launches.',
      eventDate: '2024-03-15',
      startTime: '10:00',
      endTime: '18:00',
      location: {
        name: 'Main Hall',
        address: 'National Library of Kosovo, Pristina'
      },
      category: 'Cultural Event',
      image: 'https://literarysojourn.org/wp-content/uploads/2025/02/2025-LiterarySojourn_FBCover.png',
      isFeatured: true,
      isFree: true,
      maxAttendees: 200,
      currentAttendees: 150,
      organizer: {
        name: 'Kosovo Writers Association'
      }
    },
    {
      id: '2',
      title: 'Digital Literacy Workshop',
      description: 'Learn essential digital skills for the modern world. Perfect for beginners and intermediate users.',
      eventDate: '2024-03-20',
      startTime: '14:00',
      endTime: '16:00',
      location: {
        name: 'Computer Lab',
        address: 'National Library of Kosovo, Pristina'
      },
      category: 'Workshop',
      image: 'https://img.freepik.com/premium-photo/modern-classroom-setting-with-employees-attending-digital-literacy-seminar-laptops-digital-tools_38013-14526.jpg',
      isFeatured: true,
      isFree: true,
      maxAttendees: 25,
      currentAttendees: 18,
      organizer: {
        name: 'Library Technology Team'
      }
    },
    {
      id: '3',
      title: 'Children\'s Storytelling Hour',
      description: 'Interactive storytelling session for children aged 5-10. Stories, games, and fun activities included.',
      eventDate: '2024-03-22',
      startTime: '16:00',
      endTime: '17:00',
      location: {
        name: 'Children\'s Section',
        address: 'National Library of Kosovo, Pristina'
      },
      category: 'Children Event',
      image: 'https://i.ebayimg.com/images/g/5D0AAOSw8qNlEvct/s-l1200.jpg',
      isFeatured: true,
      isFree: true,
      maxAttendees: 30,
      currentAttendees: 22,
      organizer: {
        name: 'Library Education Team'
      }
    },
    {
      id: '4',
      title: 'Historical Archives Exhibition',
      description: 'Explore Kosovo\'s rich historical documents and rare manuscripts in this special exhibition.',
      eventDate: '2024-03-25',
      startTime: '09:00',
      endTime: '17:00',
      location: {
        name: 'Exhibition Hall',
        address: 'National Library of Kosovo, Pristina'
      },
      category: 'Exhibition',
      image: 'https://archives.anu.edu.au/files/styles/anu_gallery_big/public/2025-09/PNG%20image.jpg?h=0052fb37&itok=oZ3vQze5',
      isFeatured: true,
      isFree: true,
      maxAttendees: 100,
      currentAttendees: 45,
      organizer: {
        name: 'Historical Archives Department'
      }
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTimeRemaining = (eventDate: string) => {
    const now = new Date()
    const event = new Date(eventDate)
    const diffTime = event.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return ''
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  const getSpotsRemaining = (event: Event) => {
    if (!event.maxAttendees) return null
    return event.maxAttendees - event.currentAttendees
  }

  const handleAddToFavorites = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId)
        alert('Event removed from favorites')
      } else {
        newFavorites.add(eventId)
        alert('Event added to favorites')
      }
      return newFavorites
    })
  }

  const handleShareEvent = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: `${window.location.origin}/events/${event.id}`
      }).catch(() => {
        // Fallback if sharing fails
        navigator.clipboard.writeText(`${event.title} - ${window.location.origin}/events/${event.id}`)
        alert('Event link copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.origin}/events/${event.id}`)
      alert('Event link copied to clipboard!')
    }
  }

  const handleRegisterEvent = (eventId: string) => {
    alert(`Registration functionality would be implemented here for event ID: ${eventId}`)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our vibrant community of learners, readers, and culture enthusiasts
          </p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-purple-600"></div>
          
          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex items-start gap-8"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Event Card */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="flex flex-col lg:flex-row">
                    {/* Event Image */}
                    <div className="lg:w-1/3">
                      <div className="relative h-48 lg:h-full event-image">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300 border-0 outline-none"
                          style={{ border: 'none', outline: 'none' }}
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {event.category}
                          </span>
                          {event.isFree && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Free
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm text-center">
                            {getTimeRemaining(event.eventDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Event Content */}
                    <div className="lg:w-2/3 p-6">
                      {/* Date and Time */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location.name}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-200">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Event Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">Registration</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.currentAttendees} registered
                            {event.maxAttendees && ` / ${event.maxAttendees}`}
                          </p>
                          {getSpotsRemaining(event) !== null && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {getSpotsRemaining(event)} spots remaining
                            </p>
                          )}
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">Organizer</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.organizer.name}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {getSpotsRemaining(event) !== null && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Registration Progress</span>
                            <span>{Math.round((event.currentAttendees / event.maxAttendees!) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(event.currentAttendees / event.maxAttendees!) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleAddToFavorites(event.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              favorites.has(event.id) 
                                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${favorites.has(event.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button 
                            onClick={() => handleShareEvent(event)}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <Link
                          href="#"
                          className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 relative ${learnMoreLoading === event.id ? 'opacity-70 pointer-events-none' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLearnMore(event.id, `/events/${event.id}`);
                          }}
                        >
                          {learnMoreLoading === event.id ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                              Loading...
                            </span>
                          ) : (
                            <>
                              Learn More
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            View All Events
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedEvents
