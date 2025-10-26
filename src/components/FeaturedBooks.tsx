'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, BookOpen, Calendar, User, ArrowRight, Heart, Share2 } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
  genre: string[]
  isNewArrival: boolean
  isBestseller: boolean
  isFeatured: boolean
  description: string
  publicationYear: number
  language: string
}

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('featured')

  // Mock data - in real app, this would come from API
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'The History of Kosovo',
      author: 'Dr. Mark Krasniqi',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center',
      rating: 4.8,
      genre: ['History', 'Non-Fiction'],
      isNewArrival: false,
      isBestseller: true,
      isFeatured: true,
      description: 'A comprehensive account of Kosovo\'s rich history and cultural heritage.',
      publicationYear: 2023,
      language: 'English'
    },
    {
      id: '2',
      title: 'Albanian Literature Through the Ages',
      author: 'Prof. Shpresa Gashi',
      coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Lek%C3%AB_Dukagjini_%28portret%29.jpg/250px-Lek%C3%AB_Dukagjini_%28portret%29.jpg',
      rating: 4.9,
      genre: ['Literature', 'Education'],
      isNewArrival: true,
      isBestseller: false,
      isFeatured: true,
      description: 'An exploration of Albanian literary traditions and contemporary works.',
      publicationYear: 2024,
      language: 'Albanian'
    },
    {
      id: '3',
      title: 'Digital Transformation in Libraries',
      author: 'Dr. Arben Krasniqi',
      coverImage: 'https://em2io2deumv.exactdn.com/wp-content/uploads/2019/03/fotomontaggio-1.jpg?strip=all&lossy=1&ssl=1',
      rating: 4.7,
      genre: ['Technology', 'Education'],
      isNewArrival: false,
      isBestseller: true,
      isFeatured: true,
      description: 'Modern approaches to library management and digital services.',
      publicationYear: 2023,
      language: 'English'
    },
    {
      id: '4',
      title: 'Kosovo\'s Cultural Heritage',
      author: 'Dr. Fatmir Sejdiu',
      coverImage: 'https://www.propeace.de/system/files/styles/forumzfd_lightbox_forumzfd_extralarge_1x/private/image/%E2%80%98Kosovo%20%E2%80%93%20memory%20heritage%E2%80%99%201.jpg?itok=V2XmZNyV',
      rating: 4.6,
      genre: ['Culture', 'History'],
      isNewArrival: true,
      isBestseller: false,
      isFeatured: true,
      description: 'Preserving and celebrating Kosovo\'s unique cultural identity.',
      publicationYear: 2024,
      language: 'Albanian'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBooks(mockBooks)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    { id: 'featured', label: 'Featured', count: books.filter(b => b.isFeatured).length },
    { id: 'new', label: 'New Arrivals', count: books.filter(b => b.isNewArrival).length },
    { id: 'bestsellers', label: 'Bestsellers', count: books.filter(b => b.isBestseller).length }
  ]

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 'new':
        return books.filter(book => book.isNewArrival)
      case 'bestsellers':
        return books.filter(book => book.isBestseller)
      default:
        return books.filter(book => book.isFeatured)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleAddToFavorites = (bookId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId)
        alert('Book removed from favorites')
      } else {
        newFavorites.add(bookId)
        alert('Book added to favorites')
      }
      return newFavorites
    })
  }

  const handleShareBook = (book: Book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href
      }).catch(() => {
        // User cancelled or error occurred
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${book.title} by ${book.author} - ${window.location.href}`)
      alert('Book link copied to clipboard!')
    }
  }

  const handleViewDetails = (bookId: string, bookTitle: string) => {
    // In a real app, this could track analytics or perform additional actions
    console.log(`Viewing details for book: ${bookTitle} (ID: ${bookId})`)
    alert(`Opening details for: ${bookTitle}`)
    // The Link component will handle the navigation
  }

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
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
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Our Collection
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our carefully curated selection of books, from timeless classics to contemporary works
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Books Display - Realistic Book Shelf Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getFilteredBooks().map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group perspective-1000"
            >
              {/* Book Container - Realistic Book Design */}
              <div className="relative w-full h-96 transform group-hover:rotate-y-12 group-hover:translate-z-20 transition-all duration-500">
                
                {/* Book Cover - Front Face */}
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                  <div className="relative h-full">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Book Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {book.isNewArrival && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                          New
                        </span>
                      )}
                      {book.isBestseller && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                      {renderStars(book.rating)}
                      <span className="text-xs font-bold text-gray-900">
                        {book.rating}
                      </span>
                    </div>

                    {/* Book Title on Cover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white text-lg font-bold mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {book.author}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Spine - Left Edge */}
                <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-l-lg shadow-lg" />
                
                {/* Book Pages - Multiple Layers for Realism */}
                <div className="absolute left-1 top-0 w-1 h-full bg-gradient-to-b from-gray-300 to-gray-500 rounded-l-sm" />
                <div className="absolute left-2 top-0 w-1 h-full bg-gradient-to-b from-gray-200 to-gray-400 rounded-l-sm" />
                <div className="absolute left-3 top-0 w-1 h-full bg-gradient-to-b from-gray-100 to-gray-300 rounded-l-sm" />
                
                {/* Book Back Cover - Right Edge */}
                <div className="absolute right-0 top-0 w-3 h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-r-lg shadow-lg" />
              </div>

              {/* Book Information - Integrated into Book Design */}
              <div className="mt-4 space-y-3">
                {/* Book Details */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                    {book.publicationYear}
                  </span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
                    {book.language}
                  </span>
                </div>
                
                {/* Book Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {book.description}
                </p>
                
                {/* Book Genres */}
                <div className="flex flex-wrap gap-1">
                  {book.genre.slice(0, 2).map((g, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Book Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAddToFavorites(book.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        favorites.has(book.id) 
                          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(book.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleShareBook(book)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Link
                    href={`/books/${book.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleViewDetails(book.id, book.title)
                      // Navigate after showing the alert
                      setTimeout(() => {
                        window.location.href = `/books/${book.id}`
                      }, 100)
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm hover:scale-105 transform transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Explore Full Catalog
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedBooks
