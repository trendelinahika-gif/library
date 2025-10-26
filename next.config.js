/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental options removed
  images: {
    domains: [
      'www.whitemad.pl',
      'res.cloudinary.com',
      'upload.wikimedia.org',
      'localhost',
      'images.unsplash.com',
      'www.biblioteka-ks.org',
      'literarysojourn.org',
      'www.reddit.com',
      'i.ebayimg.com',
      'archives.anu.edu.au',
      'img.freepik.com',
      'em2io2deumv.exactdn.com',
      'www.propeace.de'
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig
