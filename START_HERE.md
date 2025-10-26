# 🎉 National Library of Kosovo - Web Application

## ✅ Application Status: READY TO USE!

Your library management web application is **fully functional** and ready to use!

---

## 🌐 Access the Application

### Main Application
**URL:** http://localhost:3000

### Backend API  
**URL:** http://localhost:5000

---

## 🚀 Quick Start Guide

### Option 1: Using the Startup Script (Recommended)
```powershell
.\start-app.ps1
```
This will:
- Check all dependencies
- Start both backend and frontend servers
- Open the application in your browser automatically

### Option 2: Manual Start
**Terminal 1 - Backend:**
```powershell
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

---

## 🛑 Stopping the Application

### Option 1: Using the Stop Script
```powershell
.\stop-app.ps1
```

### Option 2: Manual Stop
- Press `Ctrl + C` in each server terminal window
- Or close the PowerShell windows

---

## 📚 Features

### For Visitors
- ✅ **Browse Catalog** - Search and explore thousands of books
- ✅ **View Events** - Check upcoming library events and programs
- ✅ **Read News** - Stay updated with library announcements
- ✅ **Digital Library** - Access digital resources and e-books
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Mode** - Toggle between light and dark themes

### For Members (After Login)
- ✅ **Borrow Books** - Request book borrowings
- ✅ **Reserve Books** - Reserve books in advance
- ✅ **Event Registration** - Register for library events
- ✅ **Reading History** - Track your borrowing history
- ✅ **Favorites** - Save your favorite books
- ✅ **Notifications** - Receive updates about your activities

### For Staff/Admin (After Admin Login)
- ✅ **Manage Books** - Add, edit, delete books
- ✅ **Manage Users** - View and manage library members
- ✅ **Manage Events** - Create and manage library events
- ✅ **Manage News** - Post library news and announcements
- ✅ **View Statistics** - Dashboard with analytics
- ✅ **Handle Borrowings** - Process book checkouts and returns

---

## 🔧 Technical Details

### Frontend Stack
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React Icons
- **Animations:** Framer Motion
- **State Management:** Zustand, React Query
- **Forms:** React Hook Form

### Backend Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (optional, runs without it)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi, Express Validator
- **Security:** Helmet, CORS, Rate Limiting

### Ports
- **Frontend:** 3000
- **Backend:** 5000

---

## 📖 User Guide

### 1. Homepage
- Search for books using the search bar
- Quick access to Catalog, Events, and Digital Resources
- View featured content and latest news

### 2. Catalog Page
Navigate to: http://localhost:3000/catalog
- Browse all available books
- Filter by genre, language, and availability
- Sort by title, author, rating, or publication date
- Click on any book for detailed information

### 3. Events Page
Navigate to: http://localhost:3000/events
- View upcoming library events
- See event details (date, time, location)
- Register for events (requires login)

### 4. Digital Library
Navigate to: http://localhost:3000/digital
- Access digital resources
- Read e-books online
- Download PDF materials

### 5. User Registration
Navigate to: http://localhost:3000/register
- Create a new library member account
- Fill in required information
- Verify your email (if email service is configured)

### 6. User Login
Navigate to: http://localhost:3000/login
- Login with your credentials
- Access member-only features
- View your dashboard

---

## 🔑 Default Admin Account (Development)

If the database is seeded, you can use:
- **Email:** admin@library.org
- **Password:** admin123

**⚠️ Important:** Change these credentials in production!

---

## ⚙️ Configuration

### Environment Variables

#### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="National Library of Kosovo"
```

#### Backend (`backend/.env`)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_kosovo
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Problem: Blank Page
**Solution:** The issue has been fixed! If you still see a blank page:
1. Hard refresh the browser: `Ctrl + Shift + R`
2. Clear browser cache
3. Check both servers are running
4. Check browser console for errors (F12)

### Problem: Port Already in Use
**Solution:**
```powershell
# Run the stop script
.\stop-app.ps1
```
Or manually kill the processes:
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Problem: MongoDB Connection Error
**Solution:** The app works without MongoDB! You'll see a warning but the app continues to function with limited features. To enable full features:
- Install MongoDB locally, OR
- Use MongoDB Atlas (cloud database)

### Problem: npm Errors
**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force backend\node_modules
npm install
cd backend
npm install
cd ..
```

---

## 📝 Development Notes

### Fixed Issues
1. ✅ Fixed missing React Hook imports in Header component
2. ✅ Fixed missing Framer Motion imports
3. ✅ Fixed missing Lucide React icon imports
4. ✅ Removed duplicate code declarations
5. ✅ Fixed MongoDB connection warnings
6. ✅ Added graceful MongoDB fallback

### Recent Changes
- Updated Header.tsx with all required imports
- Fixed navigation and routing
- Improved error handling
- Added comprehensive startup scripts
- Enhanced documentation

---

## 📞 Need Help?

### Common Pages
- Homepage: http://localhost:3000
- Catalog: http://localhost:3000/catalog
- Events: http://localhost:3000/events
- News: http://localhost:3000/news
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact

### API Endpoints
- Health Check: http://localhost:5000/api/health
- Books API: http://localhost:5000/api/books
- Events API: http://localhost:5000/api/events
- News API: http://localhost:5000/api/news

---

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.js` to customize the theme colors.

### Adding New Pages
Create new files in `src/app/` directory.

### Modifying Components
Edit files in `src/components/` directory.

---

## 📄 License

This project is for the National Library of Kosovo.

---

## 🎉 Enjoy Your Library Management System!

The application is now fully functional and ready to use. All issues have been resolved!

**Happy Reading! 📚**

