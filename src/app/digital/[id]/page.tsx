'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Filter, BookOpen, Star, Heart, Share2, Download, Play, FileText, Image, Music, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import ImageComponent from 'next/image'

interface DigitalResource {
  id: string
  title: string
  description: string
  type: 'ebook' | 'audiobook' | 'video' | 'image' | 'document' | 'audio'
  category: string
  thumbnail: string
  fileSize: string
  duration?: string
  language: string
  year: number
  rating: number
  downloads: number
  isFree: boolean
  price?: number
  author?: string
  publisher?: string
  tags: string[]
}

const DigitalResourceDetailPage = ({ params }: { params: { id: string } }) => {
  const [resource, setResource] = useState<DigitalResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDownloaded, setIsDownloaded] = useState(false)

  // Mock data - in real app, this would come from API
  const mockResources: DigitalResource[] = [
    {
      id: '1',
      title: 'Kosovo Historical Archives Digital Collection',
      description: 'Rare historical documents and manuscripts from Kosovo\'s rich past, digitized for easy access. This comprehensive digital collection includes thousands of documents spanning centuries of Kosovo\'s history, from medieval manuscripts to modern political documents. The collection features original correspondence, official records, photographs, and other archival materials that provide invaluable insights into the region\'s cultural and political development.',
      type: 'document',
      category: 'History',
      thumbnail: 'https://www.biblioteka-ks.org/wp-content/uploads/2025/10/jd5.3.jpg',
      fileSize: '2.3 GB',
      language: 'Albanian',
      year: 2024,
      rating: 4.8,
      downloads: 1250,
      isFree: true,
      tags: ['History', 'Archives', 'Kosovo', 'Documents']
    },
    {
      id: '2',
      title: 'Albanian Literature Audiobook Collection',
      description: 'Classic Albanian literature read by professional narrators in high-quality audio format. This extensive collection features readings of classic Albanian literary works, from traditional folk tales to contemporary novels. Each audiobook is professionally narrated by native Albanian speakers, ensuring authentic pronunciation and cultural context.',
      type: 'audiobook',
      category: 'Literature',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Lek%C3%AB_Dukagjini_%28portret%29.jpg/250px-Lek%C3%AB_Dukagjini_%28portret%29.jpg',
      fileSize: '1.8 GB',
      duration: '24 hours',
      language: 'Albanian',
      year: 2024,
      rating: 4.9,
      downloads: 890,
      isFree: true,
      author: 'Various Authors',
      tags: ['Literature', 'Audiobook', 'Albanian', 'Classics']
    },
    {
      id: '3',
      title: 'Digital Library Management Course',
      description: 'Comprehensive video course on modern library management and digital transformation. This professional development course covers all aspects of modern library management, including digital cataloging, user services, collection development, and technology integration. Perfect for library professionals looking to enhance their skills.',
      type: 'video',
      category: 'Education',
      thumbnail: 'https://em2io2deumv.exactdn.com/wp-content/uploads/2019/03/fotomontaggio-1.jpg?strip=all&lossy=1&ssl=1',
      fileSize: '4.2 GB',
      duration: '12 hours',
      language: 'English',
      year: 2023,
      rating: 4.7,
      downloads: 650,
      isFree: false,
      price: 29.99,
      author: 'Dr. Arben Krasniqi',
      tags: ['Education', 'Video', 'Library Management', 'Technology']
    },
    {
      id: '4',
      title: 'Kosovo Cultural Heritage Photo Collection',
      description: 'High-resolution photographs showcasing Kosovo\'s cultural heritage and landmarks. This stunning collection features professional photographs of Kosovo\'s most important cultural sites, traditional architecture, historical monuments, and cultural events. Each image is accompanied by detailed descriptions and historical context.',
      type: 'image',
      category: 'Culture',
      thumbnail: 'https://www.propeace.de/system/files/styles/forumzfd_lightbox_forumzfd_extralarge_1x/private/image/%E2%80%98Kosovo%20%E2%80%93%20memory%20heritage%E2%80%99%201.jpg?itok=V2XmZNyV',
      fileSize: '3.1 GB',
      language: 'Multilingual',
      year: 2024,
      rating: 4.6,
      downloads: 2100,
      isFree: true,
      tags: ['Culture', 'Photography', 'Heritage', 'Kosovo']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundResource = mockResources.find(r => r.id === params.id)
      setResource(foundResource || null)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ebook':
        return <FileText className="w-5 h-5" />
      case 'audiobook':
        return <Music className="w-5 h-5" />
      case 'video':
        return <Play className="w-5 h-5" />
      case 'image':
        return <Image className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      case 'audio':
        return <Music className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const handleDownload = () => {
    if (resource) {
      setIsDownloaded(true)
      // In real app, this would make an API call
      alert(`Download functionality would be implemented here for: ${resource.title}`)
    }
  }

  const handleAddToFavorites = () => {
    // In real app, this would make an API call
    alert(`Add to favorites functionality would be implemented here for: ${resource?.title}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource?.title,
        text: resource?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${resource?.title} - ${window.location.href}`)
      alert('Resource link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resource details...</p>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Resource Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/digital"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Browse Digital Resources
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
            <Link href="/digital" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Digital Resources
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resource Thumbnail */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <ImageComponent
                    src={resource.thumbnail}
                    alt={resource.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      {getTypeIcon(resource.type)}
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                    {resource.isFree ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Free
                      </span>
                    ) : (
                      <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${resource.price}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                      {resource.category}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                      {resource.language}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span>{resource.fileSize}</span>
                    </div>
                    {resource.duration && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{resource.duration}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span>{resource.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleAddToFavorites}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Favorite
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloaded}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    {isDownloaded ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Downloaded Successfully
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        {resource.isFree ? 'Download' : 'Purchase'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Resource Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h1>
                {resource.author && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    by {resource.author}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Resource Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resource Information</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Technical Details</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                        <li><strong>Type:</strong> {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</li>
                        <li><strong>Category:</strong> {resource.category}</li>
                        <li><strong>Language:</strong> {resource.language}</li>
                        <li><strong>Year:</strong> {resource.year}</li>
                        <li><strong>File Size:</strong> {resource.fileSize}</li>
                        {resource.duration && (
                          <li><strong>Duration:</strong> {resource.duration}</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Usage Statistics</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                        <li><strong>Downloads:</strong> {resource.downloads.toLocaleString()}</li>
                        <li><strong>Rating:</strong> {resource.rating}/5.0</li>
                        <li><strong>Price:</strong> {resource.isFree ? 'Free' : `$${resource.price}`}</li>
                        <li><strong>Format:</strong> Digital</li>
                        <li><strong>Access:</strong> Online</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Resources */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockResources.filter(r => r.id !== resource.id && r.category === resource.category).slice(0, 2).map((relatedResource) => (
                    <Link
                      key={relatedResource.id}
                      href={`/digital/${relatedResource.id}`}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <ImageComponent
                            src={relatedResource.thumbnail}
                            alt={relatedResource.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                            {relatedResource.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            {relatedResource.type.charAt(0).toUpperCase() + relatedResource.type.slice(1)}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{relatedResource.rating}</span>
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

export default DigitalResourceDetailPage