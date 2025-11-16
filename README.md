# 📺 TCSS 460 Group 5 Front-end Version Beta I

This repository contains the Group 5 Front-End application for the TCSS 460 course project. This web interface provides an interactive platform for discovering and ranking TV shows and movies, connecting to our assigned TV show, Movies, and Credentials API backend.

## 🎯 Overview

Our web application allows users to interact with comprehensive TV show and movie information. Users can search, filter, view detailed information, and manage their entertainment preferences all in one place.

The standout feature of our application is the **personalized Top 10 ranking system**. Rather than simply browsing content, users can create custom-themed Top 10 lists that reflect their unique tastes and preferences.

**Example Top 10 Lists:**
-  My Top 10 Action Movies
-  My Top 10 Shows of 2024
-  My Top 10 Netflix Originals
-  My Top 10 Comfort Watches
-  My Top 10 Underrated Gems

### 🔄 How It Works

1. **Create a List Category** - Define your custom theme or category
2. **Search the Database** - Use provided API endpoints to search by:
   - Genre
   - Release year
   - Title/name
   - Network/platform
   - And more...
3. **Select Your Favorites** - Browse results and pick shows or movies
4. **Rank Your Top 10** - Arrange your selections in your preferred order

## 🎨 Design Assets

View our complete mockup designs and user flow diagrams on Figma:

[Group 5 Design File](https://www.figma.com/design/Rd5diwQyQHicwcu4e7WKx7/group-5?node-id=18-2&t=BP7qIy3ceWIuPv9N-1)

## 📊 Current Status

**Beta Version I** - The application is now in active development with core features implemented. Users can browse movies, manage authentication, and navigate through a responsive UI.

## ✨ Current Features

### 🎥 Movies
- **Browse Movies** - View paginated grid of movies (6 per page)
- **Single Movie View** - Detailed information including poster, title, rating, runtime, genres, overview, director, budget, and revenue
- **Navigation** - Cycle through movies using left/right arrows
- **View Modes** - Toggle between single movie view and multi-movie grid
- **Search Bar** - Search interface (functionality pending)

### 🔐 Authentication
- **User Login** - Sign in with email and password
- **User Registration** - Create new accounts
- **Session Management** - Persistent login sessions (1 day duration)
- **Logout** - Secure sign out functionality
- **Password Reset** - Reset password option in profile menu

### 🎨 User Interface
- **Responsive Design** - Clean, modern interface
- **Dark/Light Theme** - Toggle between themes from profile menu
- **Custom Branding** - "Group 5's Movie & TV Show App" branding
- **Navigation Header** - Quick access to Home, My Top 10s, Movies, and TV Shows
- **Welcome Page** - Homepage with current functionality overview

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/kbenavente24/TCSS460-Group5-FrontEnd.git
cd TCSS460-Group5-FrontEnd
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_JWT_TIMEOUT=86400
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier` - Format code with Prettier

## 🔌 API Integration

This front-end application connects to:
- **Group 8's Credentials API** - User authentication and management
- **Group 7's Movies API** - Movie data and search
- **Group 6's TV Show API** - TV show data and search

## 🗺️ Development Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] Project planning
- [x] Mockup design
- [x] Project setup

### Phase 2: Minimum Requirements (In Progress)
- [x] User authentication flow (Register/Login/Forgot Password/Change Password)
- [x] Movies: Search, view (paginated list + individual)
- [ ] Movies: Update functionality
- [ ] TV Shows: Search, view (paginated list + individual)
- [ ] TV Shows: Update functionality
- [x] Basic UI components and layouts

### Phase 3: Top 10 Lists Feature
- [ ] List creation interface
- [ ] List management system
- [ ] Ranking functionality
- [ ] Save and share lists

### Phase 4: Polish & Deploy
- [ ] Responsive design optimization
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] Production deployment

## 👥 Team Contributions

*(To be updated by team members)*

---

**Version:** Beta I
**Last Updated:** November 2025
