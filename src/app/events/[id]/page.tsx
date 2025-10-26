'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star, Share2, Heart, CheckCircle } from 'lucide-react'
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

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteMsg, setFavoriteMsg] = useState('')
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactMsg, setContactMsg] = useState('')

  // Mock data - in real app, this would come from API
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Kosovo Literature Festival 2024',
      description: 'A celebration of contemporary Kosovo literature with readings, discussions, and book launches. This annual festival brings together writers, poets, critics, and literature enthusiasts from Kosovo and the region. The event features panel discussions on contemporary Albanian literature, poetry readings, book signings, and workshops for aspiring writers. Special guests include internationally acclaimed authors and local literary figures who will share their insights on the current state of Kosovo literature and its place in the broader European literary landscape.',
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
      description: 'Learn essential digital skills for the modern world. Perfect for beginners and intermediate users. This comprehensive workshop covers basic computer operations, internet navigation, email management, social media safety, and online research techniques. Participants will learn how to use digital tools effectively, protect their privacy online, and access digital resources available at the library.',
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
      description: 'Interactive storytelling session for children aged 5-10. Stories, games, and fun activities included. This engaging program introduces children to the joy of reading through interactive storytelling, puppet shows, and creative activities. Children will listen to age-appropriate stories, participate in storytelling games, and create their own mini-books to take home.',
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
      description: 'Explore Kosovo\'s rich historical documents and rare manuscripts in this special exhibition. This unique exhibition showcases rare historical documents, manuscripts, and artifacts from Kosovo\'s past. Visitors will have the opportunity to see original documents from different historical periods, learn about the preservation techniques used by archivists, and understand the importance of historical documentation in preserving cultural heritage.',
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
    setTimeout(() => {
      const foundEvent = mockEvents.find(e => e.id === params.id)
      setEvent(foundEvent || null)
      setLoading(false)
    }, 1000)
  }, [params.id])

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

  const handleRegister = () => {
    if (event && event.currentAttendees < event.maxAttendees!) {
      setIsRegistered(true)
      // In real app, this would make an API call
      alert(`Event registration functionality would be implemented here for: ${event.title}`)
    }
  }

  const handleAddToFavorites = () => {
    setIsFavorite((prev) => !prev)
    setFavoriteMsg(isFavorite ? 'Removed from favorites.' : 'Added to favorites!')
    setTimeout(() => setFavoriteMsg(''), 1500)
    // In a real app, this would make an API call
  }
  const handleOpenContact = () => {
    setIsContactOpen(true)
    setContactMsg('')
    setContactForm({ name: '', email: '', message: '' })
  }

  const handleCloseContact = () => {
    setIsContactOpen(false)
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContactMsg('Message sent to organizer!')
    setTimeout(() => {
      setContactMsg('')
      setIsContactOpen(false)
    }, 1500)
    // In a real app, this would send the message via API
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${event?.title} - ${window.location.href}`)
      alert('Event link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Event Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/events"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Browse Events
          </Link>
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
            <Link href="/events" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Image */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
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
                    {event.isFeatured && (
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {getTimeRemaining(event.eventDate)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.currentAttendees} / {event.maxAttendees} registered</span>
                    </div>
                  </div>

                  <div className="mb-6">
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

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleAddToFavorites}
                      className={`flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${isFavorite ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600 dark:text-red-400' : ''}`} />
                      {isFavorite ? 'Favorited' : 'Favorite'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    {favoriteMsg && (
                      <span className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">{favoriteMsg}</span>
                    )}
                  </div>

                  {event.currentAttendees < event.maxAttendees! ? (
                    <button
                      onClick={handleRegister}
                      disabled={isRegistered}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Registered Successfully
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5" />
                          Register Now
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Event Full
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Title and Organizer */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  Organized by {event.organizer.name}
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Event Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Schedule</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                        <li><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</li>
                        <li><strong>Time:</strong> {event.startTime} - {event.endTime}</li>
                        <li><strong>Duration:</strong> {Math.round((new Date(`2000-01-01 ${event.endTime}`).getTime() - new Date(`2000-01-01 ${event.startTime}`).getTime()) / (1000 * 60 * 60))} hours</li>
                        <li><strong>Category:</strong> {event.category}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                        <li><strong>Venue:</strong> {event.location.name}</li>
                        <li><strong>Address:</strong> {event.location.address}</li>
                        <li><strong>Capacity:</strong> {event.maxAttendees} attendees</li>
                        <li><strong>Registered:</strong> {event.currentAttendees} attendees</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Organizer Information</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.organizer.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    This event is organized by {event.organizer.name}, a dedicated group committed to promoting 
                    cultural and educational activities in Kosovo.
                  </p>
                  {/* Contact Organizer Button and Modal */}
                    <button
                      onClick={handleOpenContact}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Contact Organizer
                    </button>

                    {/* Contact Organizer Modal */}
                    {isContactOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                          <button
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                            onClick={handleCloseContact}
                            aria-label="Close"
                            style={{ zIndex: 10 }}
                          >
                            &times;
                          </button>
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Organizer</h3>
                          <form onSubmit={handleContactSubmit} className="space-y-4">
                            <input
                              type="text"
                              name="name"
                              value={contactForm.name}
                              onChange={handleContactChange}
                              placeholder="Your Name"
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                              type="email"
                              name="email"
                              value={contactForm.email}
                              onChange={handleContactChange}
                              placeholder="Your Email"
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <textarea
                              name="message"
                              value={contactForm.message}
                              onChange={handleContactChange}
                              placeholder="Your Message"
                              required
                              rows={4}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                            >
                              Send Message
                            </button>
                          </form>
                          {contactMsg && (
                            <div className="mt-4 text-green-600 font-semibold text-center">{contactMsg}</div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Related Events */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEvents.filter(e => e.id !== event.id && e.category === event.category).slice(0, 2).map((relatedEvent) => (
                    <Link
                      key={relatedEvent.id}
                      href={`/events/${relatedEvent.id}`}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={relatedEvent.image}
                            alt={relatedEvent.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                            {relatedEvent.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            {new Date(relatedEvent.eventDate).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {relatedEvent.currentAttendees}/{relatedEvent.maxAttendees}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
