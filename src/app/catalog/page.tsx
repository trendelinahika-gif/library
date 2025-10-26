'use client';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, Bookmark, ShoppingCart, Check } from 'lucide-react';

type Book = {
  id: string;
  title: string;
  author: string;
  category?: string;
  year?: number;
  description?: string;
};

const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'History of Kosovo', author: 'J. Smith', category: 'History', year: 2015, description: 'A comprehensive look at the history of Kosovo.' },
  { id: '2', title: 'Albanian Literature', author: 'A. Berisha', category: 'Literature', year: 2018, description: 'An anthology of Albanian literary works.' },
  { id: '3', title: 'Serbian Poetry', author: 'M. Petrovic', category: 'Poetry', year: 2020, description: 'A collection of modern Serbian poetry.' },
  { id: '4', title: 'Technology in the Balkans', author: 'L. Kelmendi', category: 'Technology', year: 2022, description: 'Exploring the rise of technology in the Balkan region.' },
  { id: '5', title: 'Architecture of Prishtina', author: 'E. Krasniqi', category: 'Architecture', year: 2012, description: 'A visual guide to the city architecture.' },
  { id: '6', title: 'Cultural Heritage', author: 'M. Hoxha', category: 'Culture', year: 2019, description: 'Preserving cultural identity through archives.' },
  { id: '7', title: 'Children Stories', author: 'A. Dreshaj', category: 'Children', year: 2017, description: 'Stories for young readers to enjoy.' },
  { id: '8', title: 'Modern Art', author: 'B. Krasniqi', category: 'Art', year: 2021, description: 'An overview of modern art movements in region.' }
];

export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const s = new Set<string>();
    MOCK_BOOKS.forEach(b => b.category && s.add(b.category));
    return ['All', ...Array.from(s)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_BOOKS.filter(b => {
      const matchesQuery = q === '' || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Library Catalog</h1>
        <p className="text-gray-600">Beautifully browse our collection. Search, filter and reserve titles with one click.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            aria-label="Search catalog"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by title, author or description..."
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-44 px-4 py-3 border rounded-lg bg-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map(book => {
          const isReserved = reservedIds.includes(book.id);
          const fav = !!favorites[book.id];
          const image = getBookImage(book);
          return (
            <article key={book.id} className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition p-0 overflow-hidden">
          <div className="relative h-44 sm:h-48 w-full">
            <img src={image} alt={book.title} className="object-cover w-full h-full" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${book.id}/800/600` }} />
                <div className="absolute left-3 top-3 bg-white/80 dark:bg-black/60 rounded-full px-3 py-1 text-xs font-medium">{book.category}</div>
                <button onClick={() => toggleFavorite(book.id)} className="absolute right-3 top-3 bg-white/80 dark:bg-black/60 p-2 rounded-full">
                  <Heart className={`w-4 h-4 ${fav ? 'text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="p-4 flex flex-col h-40">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">by {book.author} • {book.year}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{book.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedBook(book)} className="flex items-center gap-2 text-sm px-3 py-2 bg-white border rounded-lg hover:shadow-sm hover:scale-105 transition-transform duration-150">
                      <Bookmark className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">View</span>
                    </button>

                    <button
                      onClick={() => handleReserve(book.id, book.title)}
                      disabled={isReserved}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition ${isReserved ? 'bg-green-100 text-green-800 cursor-not-allowed border border-green-200' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
                    >
                      {isReserved ? <><Check className="w-4 h-4" /> <span>Reserved</span></> : <><ShoppingCart className="w-4 h-4" /> <span>Reserve</span></>}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-600">No results — try a different search.</div>
      )}

      {filtered.length > visibleCount && (
        <div className="text-center mt-8">
          <button onClick={() => setVisibleCount(c => c + 6)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Load more</button>
        </div>
      )}

      {/* Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              <div className="md:col-span-1">
                <img src={getBookImage(selectedBook)} alt={selectedBook.title} className="object-cover w-full h-56 rounded-lg" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${selectedBook.id}/800/600` }} />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                    <p className="text-sm text-gray-500">by {selectedBook.author} • {selectedBook.year}</p>
                  </div>
                  <button onClick={() => setSelectedBook(null)} className="text-gray-500 hover:text-gray-800">Close</button>
                </div>
                <div className="mt-4 text-gray-700 dark:text-gray-300">
                  <p>{selectedBook.description}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  {reservedIds.includes(selectedBook.id) ? (
                    <button disabled className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
                      <Check className="w-4 h-4" /> Reserved
                    </button>
                  ) : (
                    <button onClick={() => { handleReserve(selectedBook.id, selectedBook.title); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md">
                      <ShoppingCart className="w-4 h-4" /> Reserve
                    </button>
                  )}
                  <button onClick={() => setSelectedBook(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  
  function toggleFavorite(id: string) {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    toast((favorites[id] ? 'Removed from favorites' : 'Added to favorites'));
  }

  function handleReserve(id: string, title: string) {
    if (reservedIds.includes(id)) return;
    // Simulate reserving — in future this should POST to backend
    setReservedIds(prev => [...prev, id]);
    toast.success(`${title} reserved. Visit the library to collect it.`);
  }
}

// Use the same gallery images as the homepage LibraryGallery component so catalog photos match the homepage
const HOMEPAGE_IMAGES = [
  'https://www.whitemad.pl/wp-content/uploads/2024/07/2048px-Drone_imagary_of_the_National_Library_of_Kosovo_08.jpg',
  'https://res.cloudinary.com/tourhq/image/upload/c_fill,f_auto,fl_progressive,g_auto,h_900,q_auto:best,w_1800/rop9gxl0i0pabgwy9eje',
  'https://upload.wikimedia.org/wikipedia/commons/e/ef/Dome%2C_National_Library_Of_Kosovo.JPG'
];

function getBookImage(book: Book) {
  // Map book id to one of the homepage images so the catalog uses the same photography.
  const idx = (Number(book.id) - 1) % HOMEPAGE_IMAGES.length;
  return HOMEPAGE_IMAGES[idx] || `https://picsum.photos/seed/${book.id}/800/600`;
}

