'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Filter, BookOpen, Star, Heart, Share2, Download, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  category: string
  language: string
  year: number
  rating: number
  isAvailable: boolean
  isbn: string
  pages: number
  publisher: string
}

const BookDetailPage = ({ params }: { params: { id: string } }) => {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBorrowed, setIsBorrowed] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [shareMsg, setShareMsg] = useState('')

  // Mock data - in real app, this would come from API
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'The History of Kosovo',
      author: 'Dr. Mark Krasniqi',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center',
      description: 'A comprehensive account of Kosovo\'s rich history and cultural heritage. This meticulously researched work traces the development of Kosovo from ancient times through the modern era, exploring the region\'s complex political, social, and cultural evolution. The book provides detailed analysis of key historical events, influential figures, and the diverse communities that have shaped Kosovo\'s identity.',
      category: 'History',
      language: 'English',
      year: 2023,
      rating: 4.8,
      isAvailable: true,
      isbn: '978-1234567890',
      pages: 320,
      publisher: 'Kosovo Academic Press'
    },
    {
      id: '2',
      title: 'Albanian Literature Through the Ages',
      author: 'Prof. Shpresa Gashi',
      coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Lek%C3%AB_Dukagjini_%28portret%29.jpg/250px-Lek%C3%AB_Dukagjini_%28portret%29.jpg',
      description: 'An exploration of Albanian literary traditions and contemporary works. This comprehensive study examines the evolution of Albanian literature from its oral traditions to modern written works, highlighting the contributions of key authors and the influence of historical events on literary development.',
      category: 'Literature',
      language: 'Albanian',
      year: 2024,
      rating: 4.9,
      isAvailable: true,
      isbn: '978-1234567891',
      pages: 450,
      publisher: 'Dukagjini Publishing'
    },
    {
      id: '3',
      title: 'Digital Transformation in Libraries',
      author: 'Dr. Arben Krasniqi',
      coverImage: 'https://em2io2deumv.exactdn.com/wp-content/uploads/2019/03/fotomontaggio-1.jpg?strip=all&lossy=1&ssl=1',
      description: 'Modern approaches to library management and digital services. This forward-thinking work explores how libraries can adapt to the digital age while maintaining their core mission of providing access to knowledge and information.',
      category: 'Technology',
      language: 'English',
      year: 2023,
      rating: 4.7,
      isAvailable: false,
      isbn: '978-1234567892',
      pages: 280,
      publisher: 'Tech Publications'
    },
    {
      id: '4',
      title: 'Kosovo\'s Cultural Heritage',
      author: 'Dr. Fatmir Sejdiu',
      coverImage: 'https://www.propeace.de/system/files/styles/forumzfd_lightbox_forumzfd_extralarge_1x/private/image/%E2%80%98Kosovo%20%E2%80%93%20memory%20heritage%E2%80%99%201.jpg?itok=V2XmZNyV',
      description: 'Preserving and celebrating Kosovo\'s unique cultural identity. This important work documents the rich cultural heritage of Kosovo, from traditional arts and crafts to architectural landmarks and intangible cultural practices.',
      category: 'Culture',
      language: 'Albanian',
      year: 2024,
      rating: 4.6,
      isAvailable: true,
      isbn: '978-1234567893',
      pages: 380,
      publisher: 'Cultural Heritage Press'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundBook = mockBooks.find(b => b.id === params.id)
      setBook(foundBook || null)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleBorrow = () => {
    if (book?.isAvailable) {
      setIsBorrowed(true)
      // In real app, this would make an API call
      alert(`Book borrowing functionality would be implemented here for: ${book.title}`)
    }
  }

  const handleAddToFavorites = () => {
    setIsFavorite((prev) => !prev)
    setShareMsg(isFavorite ? 'Removed from favorites.' : 'Added to favorites!')
    setTimeout(() => setShareMsg(''), 1500)
    // In a real app, this would make an API call
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title,
        text: book?.description,
        url: window.location.href
      })
      setShareMsg('Shared successfully!')
    } else {
      navigator.clipboard.writeText(`${book?.title} by ${book?.author} - ${window.location.href}`)
      setShareMsg('Book link copied to clipboard!')
    }
    setTimeout(() => setShareMsg(''), 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Book Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/catalog"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Browse Catalog
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
            <Link href="/catalog" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  {!book.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Not Available
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                      {book.category}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm">
                      {book.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{book.rating}</span>
                    <span className="text-gray-500 dark:text-gray-500">(4.8/5)</span>
                  </div>

                  <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>ISBN:</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <span>{book.pages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year:</span>
                      <span>{book.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Publisher:</span>
                      <span>{book.publisher}</span>
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
                    {shareMsg && (
                      <span className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">{shareMsg}</span>
                    )}
                  </div>

                  {book.isAvailable ? (
                    <button
                      onClick={handleBorrow}
                      disabled={isBorrowed}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      {isBorrowed ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Borrowed Successfully
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5" />
                          Borrow Book
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  by {book.author}
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Publication Details</h3>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                        <li><strong>Publisher:</strong> {book.publisher}</li>
                        <li><strong>Publication Year:</strong> {book.year}</li>
                        <li><strong>ISBN:</strong> {book.isbn}</li>
                        <li><strong>Pages:</strong> {book.pages}</li>
                        <li><strong>Language:</strong> {book.language}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Availability</h3>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                        <li><strong>Status:</strong> {book.isAvailable ? 'Available' : 'Not Available'}</li>
                        <li><strong>Category:</strong> {book.category}</li>
                        <li><strong>Rating:</strong> {book.rating}/5.0</li>
                        <li><strong>Location:</strong> Main Library</li>
                        <li><strong>Shelf:</strong> History Section</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Books */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockBooks.filter(b => b.id !== book.id && b.category === book.category).slice(0, 2).map((relatedBook) => (
                    <Link
                      key={relatedBook.id}
                      href={`/books/${relatedBook.id}`}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-16 h-20 flex-shrink-0">
                          <Image
                            src={relatedBook.coverImage}
                            alt={relatedBook.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                            {relatedBook.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            by {relatedBook.author}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{relatedBook.rating}</span>
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

export default BookDetailPage
