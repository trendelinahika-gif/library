'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Eye, Heart, Share2, Tag, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

const NewsDetailPage = ({ params }: { params: { slug: string } }) => {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Mock data - in real app, this would come from API
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Java e Bibliotekës në Kosovë 2025 – Dita e pestë',
      excerpt: 'Në kuadër të edicionit të 22-të të Javës së Bibliotekës në Kosovë, Biblioteka Kombëtare e Kosovës ka organizuar një sërë aktivitetesh informuese dhe edukative për vizitorët, duke hapur dyert për një vizitë gjithëpërfshirëse në shërbimet dhe sektorët e saj.',
      content: `Në kuadër të edicionit të 22-të të Javës së Bibliotekës në Kosovë, Biblioteka Kombëtare e Kosovës ka organizuar një sërë aktivitetesh informuese dhe edukative për vizitorët, duke hapur dyert për një vizitë gjithëpërfshirëse në shërbimet dhe sektorët e saj.

Gjatë ditës, pjesëmarrësit patën mundësinë të njihen nga afër me procesin e digjitalizimit të materialeve bibliotekare, duke përfshirë përzgjedhjen, skanimin, përpunimin teknik dhe publikimin e tyre në platformën digjitale të Bibliotekës. Vizita në Qendrën e Digjitalizimit ndriçoi rëndësinë e këtij procesi në ruajtjen dhe ofrimin e qasjes moderne në fondin dokumentar.

Një tjetër ndalesë e rëndësishme ishte prezantimi i procesit të katalogimit, ku u shpjegua mënyra se si materialet organizohen në sistemin bibliotekar për të mundësuar një qasje më efikase dhe të strukturuar për përdoruesit. Vizitorët u njohën gjithashtu me koleksionet e veçanta të Bibliotekës, që përfshijnë dorëshkrime të rralla, botime të vjetra, koleksione fotografike, arkiva personale dhe materiale me rëndësi të madhe kulturore e historike.

Ky prezantim u shoqërua me një ndjesi të thellë respekti për trashëgiminë kombëtare që Biblioteka ruan me përkushtim. Në laboratorin e restaurimit, pjesëmarrësit panë nga afër teknikat profesionale të restaurimit dhe konservimit të librave të dëmtuar, ndërsa vizita në zyrën e libërlidhjes shpalosi procesin e përpunimit dhe formatimit të materialeve për qëndrueshmëri afatgjatë.

Gjithashtu, vizitat në zyrën e pranimit dhe shërbimin e referencave ofruan një pasqyrë të qartë mbi mënyrën si pranohet, regjistrohet dhe sistemohet fondi bibliotekar, si dhe ndihmën që u ofrohet përdoruesve për orientim dhe qasje në katalogë dhe burime digjitale.`,
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
      content: `Dita e tretë e Javës së Bibliotekës në Kosovë po vazhdon me aktivitete të larmishme që hedhin dritë mbi rëndësinë shumëdimensionale të bibliotekave në jetën kulturore dhe arsimore të shoqërisë.

Dita e tretë e kësaj jave filloi me sesionin tematik: Ndikimi i bibliotekave në promovimin e leximit. Gjatë këtij sesioni u theksua roli i bibliotekave si ruajtëse të trashëgimisë kulturore, përfshirë edhe trashëgiminë orientale që ruhen në fondet bibliotekare. Pjesëmarrësit diskutuan mënyrat se si mund të promovohet kjo trashëgimi, duke nxitur qasjen më të gjerë në literaturën që lidhet me historinë dhe kulturën tonë.

Po ashtu, u debatua për sfidat dhe mundësitë e nxitjes së leximit në komunitet dhe rolin e bibliotekave si ura lidhëse mes lexuesit dhe dijes. Më pas, dita vazhdoi me një diskutim të hapur mbi përkthimin e letërsisë shqipe dhe qasjen e lexuesve të huaj ndaj veprave në gjuhën shqipe.

Ky diskutim u moderua nga Saranda Krasniqi, dhe solli një panel të veçantë me figura të njohura ndërkombëtare e vendore: poetja dhe përkthyesja znj. Nerimane Kamberi, përkthyesi dhe botuesi francez z. Sébastien Gricourt, si dhe autori dhe përkthyesi britanik z. Robert Wilton.`,
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
      content: `Biblioteka Kombëtare e Kosovës "Pjetër Bogdani" mirëpret edicionin e 22-të të Javës së Bibliotekës në Kosovë, një ngjarje e cila tashmë është shndërruar në traditë kombëtare dhe rajonale.

Nga data 6 deri më 12 tetor 2025, Prishtina dhe qytetet e tjera të Kosovës do të bëhen skena të aktiviteteve që ndërthurin librin, kulturën, trashëgiminë dhe teknologjinë. Hapja solemne dhe lansimi i rrjetit bibliotekar Java fillon me një ceremoni të veçantë hapjeje ku marrin pjesë përfaqësues të institucioneve më të larta shtetërore e kulturore, si dhe drejtues të bibliotekave kombëtare nga rajoni.

Një moment historik i këtij edicioni është lansimi i rrjetit bibliotekar të Kosovës, i cili përfshin 48 biblioteka në një sistem unik, duke hapur një kapitull të ri për bashkëpunimin, qasjen dhe shërbimet bibliotekare moderne në vend. Publiku do të ketë rastin të shohë edhe ekspozitën "Trashëgimia orientale në Kosovë", që sjell për herë të parë mbi 30 dorëshkrime dhe botime të rralla nga fondet e Bibliotekës Kombëtare.`,
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
    setTimeout(() => {
      const foundArticle = mockArticles.find(a => a.slug === params.slug)
      setArticle(foundArticle || null)
      setLoading(false)
    }, 1000)
  }, [params.slug])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    alert(`Like functionality would be implemented here for article: ${article?.title}`)
  }

  const handleAddToFavorites = () => {
    setIsFavorited(!isFavorited)
    alert(`Add to favorites functionality would be implemented here for article: ${article?.title}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      }).catch(() => {
        navigator.clipboard.writeText(`${article?.title} - ${window.location.href}`)
        alert('Article link copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(`${article?.title} - ${window.location.href}`)
      alert('Article link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Article Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Back to Home
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
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {article.category}
              </span>
              {article.isFeatured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getTimeAgo(article.publishDate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{article.likes} likes</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isLiked 
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleAddToFavorites}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isFavorited 
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage
