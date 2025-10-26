'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Star, Eye, Heart, Share2 } from 'lucide-react'

const LibraryGallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [likes, setLikes] = useState([0, 0, 0])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const libraryImages = [
    {
      src: 'https://www.whitemad.pl/wp-content/uploads/2024/07/2048px-Drone_imagary_of_the_National_Library_of_Kosovo_08.jpg',
      alt: 'National Library of Kosovo - Drone View',
      title: 'Aerial View',
      description: 'Breathtaking drone view of our magnificent library building',
      location: 'Pristina, Kosovo',
      year: '2024'
    },
    {
      src: 'https://res.cloudinary.com/tourhq/image/upload/c_fill,f_auto,fl_progressive,g_auto,h_900,q_auto:best,w_1800/rop9gxl0i0pabgwy9eje',
      alt: 'National Library of Kosovo - Interior',
      title: 'Grand Interior',
      description: 'Stunning architectural details and modern reading spaces',
      location: 'Main Hall',
      year: '2024'
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Dome%2C_National_Library_Of_Kosovo.JPG',
      alt: 'National Library of Kosovo - Dome',
      title: 'Iconic Dome',
      description: 'The famous dome structure that defines our library',
      location: 'Central Atrium',
      year: '2024'
    }
  ]

  // Removed auto-advance; only show image user selects

  // Like button handler
  const handleLike = () => {
    setLikes((prev) => {
      const updated = [...prev]
      updated[currentImageIndex]++
      return updated
    })
  }

  // Share button handler
  const handleShare = () => {
    const image = libraryImages[currentImageIndex]
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description,
        url: image.src
      })
    } else {
      navigator.clipboard.writeText(image.src)
      alert('Image URL copied to clipboard!')
    }
  }

  // View button handler (open modal)
  const handleView = () => {
    setIsModalOpen(true)
  }

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Our
            <span className="text-black">
              {' '}Architecture
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the beauty and grandeur of our iconic library building through stunning photography
          </p>
        </motion.div>

        {/* Main Gallery Display */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={libraryImages[currentImageIndex].src}
                  alt={libraryImages[currentImageIndex].alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-bold mb-2">{libraryImages[currentImageIndex].title}</h3>
                  <p className="text-gray-200 mb-3">{libraryImages[currentImageIndex].description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{libraryImages[currentImageIndex].location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{libraryImages[currentImageIndex].year}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {libraryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl" />
            </motion.div>

            {/* Image Thumbnails and Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Thumbnail Grid */}
              <div className="grid grid-cols-3 gap-4">
                {libraryImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-4 ring-blue-500 scale-105' 
                        : 'hover:scale-105 hover:shadow-lg'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      index === currentImageIndex ? 'bg-blue-500/30' : 'bg-black/20'
                    }`} />
                  </motion.button>
                ))}
              </div>

              {/* Current Image Info */}
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {libraryImages[currentImageIndex].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {libraryImages[currentImageIndex].location}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {libraryImages[currentImageIndex].description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={handleLike}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Like</span>
                    <span className="ml-1 text-xs text-blue-600 font-bold">{likes[currentImageIndex]}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                  <button
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={handleView}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                </div>

                {/* Modal for viewing image */}
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeIn">
                      <button
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white text-4xl font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200"
                        onClick={handleCloseModal}
                        aria-label="Close"
                        style={{ zIndex: 10 }}
                      >
                        &times;
                      </button>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                        <Image
                          src={libraryImages[currentImageIndex].src}
                          alt={libraryImages[currentImageIndex].alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{libraryImages[currentImageIndex].title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{libraryImages[currentImageIndex].description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{libraryImages[currentImageIndex].location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{libraryImages[currentImageIndex].year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2024</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Year</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">★</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LibraryGallery
