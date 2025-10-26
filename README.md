# National Library of Kosovo - Digital Platform

A modern, full-stack web application for the National Library of Kosovo, built with Next.js, TypeScript, Tailwind CSS, Node.js, Express.js, and MongoDB.

## 🏛️ Project Overview

This project transforms the National Library of Kosovo's digital presence into a comprehensive, user-friendly platform that supports:

- **Digital Catalog Management**: Browse and search through 500,000+ books and resources
- **User Authentication & Management**: Secure member registration and profile management
- **Borrowing & Reservation System**: Online book borrowing and reservation system
- **Digital Resources**: Access to eBooks, PDFs, and digital collections
- **Events & News Management**: Cultural events, workshops, and library news
- **Multilingual Support**: Albanian, Serbian, and English language support
- **Admin Dashboard**: Comprehensive management tools for library staff
- **Mobile Responsive Design**: Optimized for all devices

## 🚀 Features

### Core Functionality
- ✅ User Authentication (Registration, Login, Profile Management)
- ✅ Advanced Search & Catalog System
- ✅ Book Borrowing & Reservation System
- ✅ Digital Library Access
- ✅ Events & News Management
- ✅ Multilingual Support (Albanian, Serbian, English)
- ✅ Responsive Design
- ✅ Admin Dashboard
- ✅ Real-time Notifications

### Technical Features
- ✅ TypeScript for type safety
- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS for styling
- ✅ Framer Motion for animations
- ✅ React Query for data fetching
- ✅ Zustand for state management
- ✅ MongoDB for database
- ✅ Express.js for backend API
- ✅ JWT Authentication
- ✅ File upload with Cloudinary
- ✅ Email notifications
- ✅ Rate limiting and security

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query
- **UI Components**: Custom components with Lucide React icons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi, Express Validator

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/national-library-kosovo.git
cd national-library-kosovo
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_kosovo
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="National Library of Kosovo"
```

### 4. Database Setup

#### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `library_kosovo`
3. Update the `MONGODB_URI` in your backend `.env` file

#### Seed Data (Optional)
```bash
cd backend
npm run seed
```

### 5. Start Development Servers

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend Server (in a new terminal)
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Project Structure

```
national-library-kosovo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── providers.tsx      # Context providers
│   │   ├── globals.css        # Global styles
│   │   ├── login/            # Authentication pages
│   │   ├── register/
│   │   └── ...
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── FeaturedBooks.tsx
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   ├── types/                # TypeScript type definitions
│   └── utils/                 # Utility functions
├── backend/                   # Express.js backend
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── controllers/          # Route controllers
│   ├── utils/                # Backend utilities
│   └── server.js            # Main server file
├── public/                   # Static assets
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed         # Seed database with sample data
npm test             # Run tests
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Books & Catalog
- `GET /api/books` - Get all books
- `GET /api/books/search` - Search books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Add new book (admin)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

### Borrowing System
- `POST /api/borrowings` - Borrow a book
- `GET /api/borrowings/user/:userId` - Get user's borrowings
- `PUT /api/borrowings/:id/return` - Return a book
- `POST /api/borrowings/:id/renew` - Renew a book

### Events & News
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `GET /api/news` - Get all news
- `POST /api/news` - Create news article (admin)

## 🎨 Design System

### Color Palette
- **Primary Blue**: #3b82f6
- **Kosovo Blue**: #0066CC
- **Kosovo Yellow**: #FFD700
- **Kosovo Red**: #CC0000
- **Library Dark**: #1a1a2e
- **Library Medium**: #16213e
- **Library Light**: #0f3460

### Typography
- **Primary Font**: Inter
- **Serif Font**: Georgia
- **Monospace Font**: Fira Code

## 🔒 Security Features

- JWT Authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🌍 Multilingual Support

Currently supports:
- English (en)
- Albanian (sq)
- Serbian (sr)

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Heroku/AWS)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy backend to your preferred platform

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# ... other production variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: info@library-kosovo.org
- Phone: +383 38 123 456
- Website: https://library-kosovo.org

## 🙏 Acknowledgments

- National Library of Kosovo
- Kosovo Ministry of Education, Science, Technology and Innovation
- Open source community
- All contributors and supporters

---

**Built with ❤️ for the National Library of Kosovo**
