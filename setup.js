#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up National Library of Kosovo - Digital Platform');
console.log('========================================================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js version 18 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Create environment files if they don't exist
console.log('\n🔧 Setting up environment files...');

// Frontend .env.local
const frontendEnvPath = '.env.local';
if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnvContent = `NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="National Library of Kosovo"`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created .env.local for frontend');
}

// Backend .env
const backendEnvPath = 'backend/.env';
if (!fs.existsSync(backendEnvPath)) {
  const backendEnvContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_kosovo
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
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
FRONTEND_URL=http://localhost:3000`;
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update the environment variables in backend/.env');
console.log('3. Start the development servers:');
console.log('   - Frontend: npm run dev');
console.log('   - Backend: npm run backend');
console.log('4. Visit http://localhost:3000 to see the application');
console.log('\n📚 For more information, check the README.md file');
