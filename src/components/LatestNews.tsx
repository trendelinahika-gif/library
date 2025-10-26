'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Eye, Heart, Share2, Tag } from 'lucide-react'

// View All News Button with process
function ViewAllNewsButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const handleClick = () => {
    setLoading(true)
    setMsg('Loading all news...')
    setTimeout(() => {
      setMsg('')
      window.location.href = '/news'
    }, 1200)
  }
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg relative ${loading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          {msg}
        </span>
      ) : (
        <>
          View All News
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  )
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  author: {
    name: string
    avatar: string
  }
  publishDate: string
  category: string
  tags: string[]
  views: number
  likes: number
  isFeatured: boolean
  slug: string
}

const LatestNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Mock data - in real app, this would come from API
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Java e Bibliotekës në Kosovë 2025 – Dita e pestë',
      excerpt: 'Në kuadër të edicionit të 22-të të Javës së Bibliotekës në Kosovë, Biblioteka Kombëtare e Kosovës ka organizuar një sërë aktivitetesh informuese dhe edukative për vizitorët, duke hapur dyert për një vizitë gjithëpërfshirëse në shërbimet dhe sektorët e saj.',
      content: 'Gjatë ditës, pjesëmarrësit patën mundësinë të njihen nga afër me procesin e digjitalizimit të materialeve bibliotekare, duke përfshirë përzgjedhjen, skanimin, përpunimin teknik dhe publikimin e tyre në platformën digjitale të Bibliotekës. Vizita në Qendrën e Digjitalizimit ndriçoi rëndësinë e këtij procesi në ruajtjen dhe ofrimin e qasjes moderne në fondin dokumentar.',
      featuredImage: 'https://www.biblioteka-ks.org/wp-content/uploads/2025/10/jd5.3.jpg',
      author: {
        name: 'editor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      publishDate: '2025-10-11',
      category: 'Ngjarje',
      tags: ['Biblioteka', 'Kosovë', 'Aktivitetet'],
      views: 1250,
      likes: 89,
      isFeatured: true,
      slug: 'java-e-bibliotekes-ne-kosove-2025-dita-e-peste'
    },
    {
      id: '2',
      title: 'Java e Bibliotekës në Kosovë 2025 – Dita e tretë',
      excerpt: 'Dita e tretë e Javës së Bibliotekës në Kosovë po vazhdon me aktivitete të larmishme që hedhin dritë mbi rëndësinë shumëdimensionale të bibliotekave në jetën kulturore dhe arsimore të shoqërisë.',
      content: 'Gjatë këtij sesioni u theksua roli i bibliotekave si ruajtëse të trashëgimisë kulturore, përfshirë edhe trashëgiminë orientale që ruhen në fondet bibliotekare. Pjesëmarrësit diskutuan mënyrat se si mund të promovohet kjo trashëgimi, duke nxitur qasjen më të gjerë në literaturën që lidhet me historinë dhe kulturën tonë.',
      featuredImage: 'https://www.biblioteka-ks.org/wp-content/uploads/2025/10/Javad3.1.jpg',
      author: {
        name: 'editor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      publishDate: '2025-10-09',
      category: 'Ngjarje',
      tags: ['Biblioteka', 'Kosovë', 'Kultura'],
      views: 890,
      likes: 45,
      isFeatured: false,
      slug: 'java-e-bibliotekes-ne-kosove-2025-dita-e-trete'
    },
    {
      id: '3',
      title: 'Biblioteka mes traditës dhe inovacionit',
      excerpt: 'Biblioteka Kombëtare e Kosovës "Pjetër Bogdani" mirëpret edicionin e 22-të të Javës së Bibliotekës në Kosovë, një ngjarje e cila tashmë është shndërruar në traditë kombëtare dhe rajonale.',
      content: 'Nga data 6 deri më 12 tetor 2025, Prishtina dhe qytetet e tjera të Kosovës do të bëhen skena të aktiviteteve që ndërthurin librin, kulturën, trashëgiminë dhe teknologjinë. Java fillon me një ceremoni të veçantë hapjeje ku marrin pjesë përfaqësues të institucioneve më të larta shtetërore e kulturore.',
      featuredImage: 'https://www.biblioteka-ks.org/wp-content/uploads/2025/10/93578541-dbae-43a9-a7d6-3ef332803efe.jpg',
      author: {
        name: 'admin',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      publishDate: '2025-10-01',
      category: 'Ngjarje',
      tags: ['Biblioteka', 'Traditë', 'Inovacion'],
      views: 2100,
      likes: 156,
      isFeatured: true,
      slug: 'biblioteka-mes-tradites-dhe-inovacionit'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setArticles(mockArticles)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAddToFavorites = (articleId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(articleId)) {
        newFavorites.delete(articleId)
        alert('Article removed from favorites')
      } else {
        newFavorites.add(articleId)
        alert('Article added to favorites')
      }
      return newFavorites
    })
  }

  const handleShareArticle = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `${window.location.origin}/news/${article.slug}`
      }).catch(() => {
        // Fallback if sharing fails
        navigator.clipboard.writeText(`${article.title} - ${window.location.origin}/news/${article.slug}`)
        alert('Article link copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(`${article.title} - ${window.location.origin}/news/${article.slug}`)
      alert('Article link copied to clipboard!')
    }
  }

  const handleLikeArticle = (articleId: string) => {
    alert(`Like functionality would be implemented here for article ID: ${articleId}`)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
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
            Latest News & Updates
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay informed about library services, events, and community news
          </p>
        </motion.div>

        {/* News Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Article Image */}
              <div className="relative h-32">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {article.category}
                  </span>
                </div>
                {article.isFeatured && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                )}
              </div>
              
              {/* Article Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{getTimeAgo(article.publishDate)}</span>
                  <span>•</span>
                  <span>{formatDate(article.publishDate)}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {article.likes}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAddToFavorites(article.id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          favorites.has(article.id) 
                            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(article.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleShareArticle(article)}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All News Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <ViewAllNewsButton />
        </motion.div>
      </div>
    </section>
  )
}

export default LatestNews