'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ArrowLeft, Star, Share2, Heart, Filter, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDate, setSelectedDate] = useState('All')
  const [registerLoading, setRegisterLoading] = useState<string | null>(null)
  const [registerMsg, setRegisterMsg] = useState<string | null>(null)
  const [learnMoreLoading, setLearnMoreLoading] = useState<string | null>(null)

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
      isFeatured: false,
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
      isFeatured: false,
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
    },
    {
      id: '5',
      title: 'Book Club Meeting',
      description: 'Monthly book club discussion featuring contemporary Albanian literature.',
      eventDate: '2024-03-28',
      startTime: '18:00',
      endTime: '20:00',
      location: {
        name: 'Reading Room',
        address: 'National Library of Kosovo, Pristina'
      },
      category: 'Book Club',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center',
      isFeatured: false,
      isFree: true,
      maxAttendees: 20,
      currentAttendees: 15,
      organizer: {
        name: 'Literature Society'
      }
    },
    {
      id: '6',
      title: 'Research Methodology Seminar',
      description: 'Advanced research techniques and academic writing for graduate students.',
      eventDate: '2024-04-02',
      startTime: '10:00',
      endTime: '12:00',
      location: {
        name: 'Conference Room',
        address: 'National Library of Kosovo, Pristina'
      },
      category: 'Seminar',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center',
      isFeatured: false,
      isFree: false,
      price: 15,
      maxAttendees: 40,
      currentAttendees: 28,
      organizer: {
        name: 'Academic Support Team'
      }
    }
  ]

  const categories = ['All', 'Cultural Event', 'Workshop', 'Children Event', 'Exhibition', 'Book Club', 'Seminar']
  const dateFilters = ['All', 'This Week', 'This Month', 'Next Month']

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents)
      setFilteredEvents(mockEvents)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = events

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Filter by date
    const now = new Date()
    if (selectedDate !== 'All') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDate)
        switch (selectedDate) {
          case 'This Week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            return eventDate >= now && eventDate <= weekFromNow
          case 'This Month':
            const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            return eventDate >= now && eventDate <= monthFromNow
          case 'Next Month':
            const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
            const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0)
            return eventDate >= nextMonthStart && eventDate <= nextMonthEnd
          default:
            return true
        }
      })
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())

    setFilteredEvents(filtered)
  }, [events, searchQuery, selectedCategory, selectedDate])

  const getTimeRemaining = (eventDate: string) => {
    const now = new Date()
    const event = new Date(eventDate)
    const diffTime = event.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Past Event'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  const handleRegister = (eventId: string) => {
    setRegisterLoading(eventId)
    setRegisterMsg(null)
    setTimeout(() => {
      setRegisterLoading(null)
      setRegisterMsg('Registered successfully!')
      setTimeout(() => setRegisterMsg(null), 1500)
    }, 1200)
    // In real app, this would make an API call
  }

  const handleLearnMore = (eventId: string, href: string) => {
    setLearnMoreLoading(eventId)
    setTimeout(() => {
      window.location.href = href
    }, 1200)
  }

  const handleAddToFavorites = (eventId: string) => {
    // In real app, this would make an API call
    alert(`Add to favorites functionality would be implemented here for event ID: ${eventId}`)
  }

  const handleShareEvent = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.href}`)
      alert('Event link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upcoming Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Join our vibrant community of learners, readers, and culture enthusiasts</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {dateFilters.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                  {event.isFree ? (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Free
                    </span>
                  ) : (
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${event.price}
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleAddToFavorites(event.id)}
                    className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareEvent(event)}
                    className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {getTimeRemaining(event.eventDate)}
                  </span>
                  {event.isFeatured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{event.currentAttendees} / {event.maxAttendees} registered</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Registration Progress</span>
                    <span>{Math.round((event.currentAttendees / event.maxAttendees!) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.currentAttendees / event.maxAttendees!) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRegister(event.id)}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-semibold relative ${registerLoading === event.id ? 'opacity-70 pointer-events-none' : ''}`}
                  >
                    {registerLoading === event.id ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        Registering...
                      </span>
                    ) : (
                      'Register'
                    )}
                  </button>
                  <button
                    onClick={() => handleLearnMore(event.id, `/events/${event.id}`)}
                    className={`flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors text-sm font-semibold text-center relative ${learnMoreLoading === event.id ? 'opacity-70 pointer-events-none' : ''}`}
                  >
                    {learnMoreLoading === event.id ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></span>
                        Loading...
                      </span>
                    ) : (
                      'Learn More'
                    )}
                  </button>
                  {registerMsg && (
                    <span className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">{registerMsg}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or browse all events
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedDate('All')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
