'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Play, FileText, Image, Video, Music, ArrowLeft, Search, Filter, Star, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import ImageComponent from 'next/image'
import toast from 'react-hot-toast'

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
  downloadUrl?: string
  previewUrl?: string
  previewImages?: string[]
  tags: string[]
}

const DigitalResourcesPage = () => {
  const [resources, setResources] = useState<DigitalResource[]>([])
  const [filteredResources, setFilteredResources] = useState<DigitalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')

  // Mock data - in real app, this would come from API
  const mockResources: DigitalResource[] = [
    {
      id: '1',
      title: 'Kosovo Historical Archives Digital Collection',
      description: 'Rare historical documents and manuscripts from Kosovo\'s rich past, digitized for easy access.',
      type: 'document',
      category: 'History',
      thumbnail: 'https://www.biblioteka-ks.org/wp-content/uploads/2025/10/jd5.3.jpg',
      fileSize: '2.3 GB',
      language: 'Albanian',
      year: 2024,
      rating: 4.8,
      downloads: 1250,
      isFree: true,
      tags: ['History', 'Archives', 'Kosovo', 'Documents'],
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      previewImages: [
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/Old_manuscript.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Old_book_pages.jpg'
      ]
    },
    {
      id: '2',
      title: 'Albanian Literature Audiobook Collection',
      description: 'Classic Albanian literature read by professional narrators in high-quality audio format.',
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
      tags: ['Literature', 'Audiobook', 'Albanian', 'Classics'],
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: '3',
      title: 'Digital Library Management Course',
      description: 'Comprehensive video course on modern library management and digital transformation.',
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
      tags: ['Education', 'Video', 'Library Management', 'Technology'],
      downloadUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      previewUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
    },
    {
      id: '4',
      title: 'Kosovo Cultural Heritage Photo Collection',
      description: 'High-resolution photographs showcasing Kosovo\'s cultural heritage and landmarks.',
      type: 'image',
      category: 'Culture',
      thumbnail: 'https://www.propeace.de/system/files/styles/forumzfd_lightbox_forumzfd_extralarge_1x/private/image/%E2%80%98Kosovo%20%E2%80%93%20memory%20heritage%E2%80%99%201.jpg?itok=V2XmZNyV',
      fileSize: '3.1 GB',
      language: 'Multilingual',
      year: 2024,
      rating: 4.6,
      downloads: 2100,
      isFree: true,
      tags: ['Culture', 'Photography', 'Heritage', 'Kosovo'],
      downloadUrl: 'https://picsum.photos/1200/800',
      previewUrl: 'https://picsum.photos/1200/800'
    },
    {
      id: '5',
      title: 'Research Methodology E-Book',
      description: 'Complete guide to academic research methods and academic writing for students.',
      type: 'ebook',
      category: 'Education',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center',
      fileSize: '15 MB',
      language: 'English',
      year: 2023,
      rating: 4.5,
      downloads: 1800,
      isFree: true,
      author: 'Academic Support Team',
      publisher: 'Kosovo Academic Press',
      tags: ['Education', 'Research', 'Academic Writing', 'Methodology'],
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      id: '6',
      title: 'Traditional Kosovo Music Collection',
      description: 'Authentic recordings of traditional Kosovo music and folk songs.',
      type: 'audio',
      category: 'Music',
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center',
      fileSize: '2.8 GB',
      duration: '18 hours',
      language: 'Albanian',
      year: 2024,
      rating: 4.7,
      downloads: 950,
      isFree: true,
      tags: ['Music', 'Traditional', 'Folk', 'Kosovo'],
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    }
  ]

  const categories = ['All', 'History', 'Literature', 'Education', 'Culture', 'Music']
  const types = ['All', 'ebook', 'audiobook', 'video', 'image', 'document', 'audio']

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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResources(mockResources)
      setFilteredResources(mockResources)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = resources

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    // Sort by downloads (most popular first)
    filtered.sort((a, b) => b.downloads - a.downloads)

    setFilteredResources(filtered)
  }, [resources, searchQuery, selectedCategory, selectedType])

  const handleDownload = (resourceId: string) => {
    const res = resources.find(r => r.id === resourceId)
    if (!res) return

    // If paid, simulate purchase flow
    if (!res.isFree) {
      const confirmPurchase = window.confirm(`This resource costs $${res.price}. Purchase and download?`)
      if (!confirmPurchase) return
      toast.success('Purchase successful')
    }

    // prevent multiple clicks
    setDownloadingIds(prev => [...prev, resourceId])

    // increment local downloads count for optimistic UI
    setResources(prev => prev.map(p => p.id === resourceId ? { ...p, downloads: p.downloads + 1 } : p))

    // Attempt to fetch the file and trigger browser download
    const url = (res as any).downloadUrl || res.thumbnail
    fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        const ext = url.split('.').pop()?.split('?')[0] || 'bin'
        a.download = `${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
        toast.success('Download started')
      })
      .catch(() => {
        // fallback: create a small text file
        const blob = new Blob([`Download: ${res.title}`], { type: 'text/plain' })
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
        toast.success('Download started (fallback)')
      })
      .finally(() => setDownloadingIds(prev => prev.filter(id => id !== resourceId)))
  }

  const handleAddToFavorites = (resourceId: string) => {
    // Local favorites stored in localStorage for demo
    const raw = localStorage.getItem('favorites')
    const favs: string[] = raw ? JSON.parse(raw) : []
    if (favs.includes(resourceId)) {
      const next = favs.filter(f => f !== resourceId)
      localStorage.setItem('favorites', JSON.stringify(next))
      toast('Removed from favorites')
    } else {
      const next = [...favs, resourceId]
      localStorage.setItem('favorites', JSON.stringify(next))
      toast.success('Added to favorites')
    }
  }

  function toggleFavoriteLocal(resourceId: string) {
    // helper used by modal to toggle favorites
    const raw = localStorage.getItem('favorites')
    const favs: string[] = raw ? JSON.parse(raw) : []
    if (favs.includes(resourceId)) {
      const next = favs.filter(f => f !== resourceId)
      localStorage.setItem('favorites', JSON.stringify(next))
      toast('Removed from favorites')
    } else {
      const next = [...favs, resourceId]
      localStorage.setItem('favorites', JSON.stringify(next))
      toast.success('Added to favorites')
    }
  }

  const handleShareResource = (resource: DigitalResource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${resource.title} - ${window.location.href}`)
      alert('Resource link copied to clipboard!')
    }
  }

  const [previewResource, setPreviewResource] = useState<DigitalResource | null>(null)
  const [downloadingIds, setDownloadingIds] = useState<string[]>([])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading digital resources...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Digital Resources</h1>
            <p className="text-gray-600 dark:text-gray-400">Access our extensive collection of digital materials and online resources</p>
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
                  placeholder="Search digital resources..."
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

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredResources.length} of {resources.length} digital resources
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48">
                <ImageComponent
                  src={resource.thumbnail}
                  alt={resource.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleAddToFavorites(resource.id)}
                    className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareResource(resource)}
                    className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                    {resource.category}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                    {resource.language}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {resource.author && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    by {resource.author}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>File Size:</span>
                    <span>{resource.fileSize}</span>
                  </div>
                  {resource.duration && (
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Duration:</span>
                      <span>{resource.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Downloads:</span>
                    <span>{resource.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">+{resource.tags.length - 3} more</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(resource.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {resource.isFree ? 'Download' : 'Purchase'}
                  </button>
                  <button onClick={() => setPreviewResource(resource)} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors text-sm font-semibold">
                    Preview
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Preview Modal */}
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row">
                {/* Left: metadata panel */}
                <aside className="md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 flex flex-col gap-4">
                  <div className="relative rounded-lg overflow-hidden shadow-inner">
                    <img src={(previewResource as any).previewUrl || previewResource.thumbnail} alt={previewResource.title} className="object-cover w-full h-48" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{previewResource.title}</h3>
                    <p className="text-sm text-gray-500">{previewResource.author || previewResource.category} • {previewResource.language}</p>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">File Size</span>
                      <span>{previewResource.fileSize}</span>
                    </div>
                    {previewResource.duration && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Duration</span>
                        <span>{previewResource.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Downloads</span>
                      <span>{previewResource.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Rating</span>
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {previewResource.rating}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {previewResource.tags.map((t, i) => (
                        <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button onClick={() => { handleDownload(previewResource.id); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button onClick={() => { toggleFavoriteLocal(previewResource.id); }} className="px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg">
                      <Heart className="w-4 h-4 text-red-500" />
                    </button>
                    <button onClick={() => handleShareResource(previewResource)} className="px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </aside>

                {/* Right: viewer */}
                <section className="md:w-2/3 p-6 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm text-gray-500">Preview</h4>
                      <p className="text-xs text-gray-400">{previewResource.description}</p>
                    </div>
                    <button onClick={() => setPreviewResource(null)} className="text-gray-500 hover:text-gray-800 dark:text-gray-300">Close</button>
                  </div>

                  <div className="mt-4 flex-1 bg-black/5 dark:bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    {/* viewer */}
                    {previewResource.type === 'image' && (
                      <img src={(previewResource as any).previewUrl || previewResource.thumbnail} alt={previewResource.title} className="max-h-[70vh] object-contain" />
                    )}

                    {previewResource.type === 'video' && (
                      <video controls src={(previewResource as any).previewUrl || previewResource.thumbnail} className="w-full h-[70vh] bg-black" />
                    )}

                    {(previewResource.type === 'audio' || previewResource.type === 'audiobook') && (
                      <div className="w-full p-6">
                        <audio controls src={(previewResource as any).previewUrl || previewResource.thumbnail} className="w-full" />
                      </div>
                    )}

                    {(previewResource.type === 'ebook' || previewResource.type === 'document') && (
                      <div className="w-full h-[70vh]">
                        <iframe src={(previewResource as any).previewUrl || previewResource.thumbnail} className="w-full h-full" />
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or browse all resources
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedType('All')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DigitalResourcesPage;
