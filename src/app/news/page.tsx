"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

// Dummy news data for demonstration
const newsList = [
  {
    slug: 'java-e-bibliotekes-ne-kosove-2025-dita-e-peste',
    title: 'Java e Bibliotekës në Kosovë 2025 – Dita e pestë',
    excerpt: 'Në kuadër të edicionit të 22-të të Javës së Bibliotekës në Kosovë, Biblioteka Kombëtare e Kosovës ka organizuar një sërë aktivitetesh informuese dhe edukative për vizitorët...',
    date: '2025-10-22',
    author: 'Biblioteka Kombëtare',
  },
  {
    slug: 'java-e-bibliotekes-ne-kosove-2025-dita-e-trete',
    title: 'Java e Bibliotekës në Kosovë 2025 – Dita e tretë',
    excerpt: 'Dita e tretë e Javës së Bibliotekës në Kosovë po vazhdon me aktivitete të larmishme që hedhin dritë mbi rëndësinë shumëdimensionale të bibliotekave...',
    date: '2025-10-20',
    author: 'Event Team',
  },
  {
    slug: 'biblioteka-mes-tradites-dhe-inovacionit',
    title: 'Biblioteka mes traditës dhe inovacionit',
    excerpt: 'Biblioteka Kombëtare e Kosovës "Pjetër Bogdani" mirëpret edicionin e 22-të të Javës së Bibliotekës në Kosovë, një ngjarje e cila tashmë është shndërruar në traditë kombëtare...',
    date: '2025-10-18',
    author: 'Cultural Desk',
  }
];

function getNewsImage(slug: string) {
  // Use Unsplash to fetch a relevant editorial image; fallback handled on image error.
  const q = encodeURIComponent(slug.replace(/-/g, ' '));
  return `https://source.unsplash.com/800x600/?${q},library,books`;
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center"
        >
          All News
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map(news => (
            <motion.article
              key={news.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="relative h-48 w-full">
                <img
                  src={getNewsImage(news.slug)}
                  alt={news.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${news.slug}/800/600`; }}
                />
                <div className="absolute left-4 bottom-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">News</div>
              </div>

              <div className="p-6 flex flex-col h-56">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{news.title}</h2>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">{news.excerpt}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(news.date).toLocaleDateString()}</span>
                    <span className="mx-1">•</span>
                    <User className="w-4 h-4" />
                    <span>{news.author}</span>
                  </div>
                  <Link href={`/news/${news.slug}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
