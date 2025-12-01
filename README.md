# 📺 TCSS 460 Group 5 Front-end Version Beta II

Production URL: https://tcss460-group5.vercel.app

This repository contains the Group 5 Front-End application for the TCSS 460 course project. This web interface provides an interactive platform for discovering and ranking TV shows and movies, connecting to our assigned TV show, Movies, and Credentials API backend.

## 🎯 Overview

Our web application allows users to interact with comprehensive TV show and movie information. Users are able to search, filter, and view detailed information all in one place.

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

**Beta Version II** - The application is now nearing the final production stage with core features implemented. Users can browse movies and tv shows, manage authentication, and navigate through a responsive UI.

## ✨ Current Features

### 🎥 Movies and TV Shows
- **Browse** - View paginated grid of movies/show.
- **Navigation** - Cycle through movies/shows using left/right arrows and via a paginated list.
- **Toggle View Modes** - Toggle between single movie/shows view and multi-movie/shows grid.
- **Search Bar and Search Page** - Advanced Searching Features tailored to our assigned apis.

### 🔐 Authentication
- **User Login** - Sign in with email and password
- **User Registration** - Create new accounts
- **Session Management** - Persistent login sessions (1 day duration)
- **Logout** - Secure sign out functionality
- **Password Reset** - Reset password option in profile menu as well as in the login page.

### 🎨 User Interface
- **Responsive Design** - Clean, modern interface
- **Dark/Light Theme** - Toggle between themes from profile menu
- **Custom Branding** - "Group 5's Movie & TV Show App" branding
- **Navigation Header** - Quick access to Home, My Top 10s, Movies, and TV Shows
- **Welcome Page** - Homepage with current functionality overview
  
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

### Phase 2: Minimum Requirements ✅ (Complete)
- [x] User authentication flow (Register/Login/Forgot Password/Change Password)
- [x] Movies: Search, view (paginated list + individual)
- [x] TV Shows: Search, view (paginated list + individual)
- [x] Basic UI components and layouts

### Phase 3: Top 10 Lists Feature ✅ (Complete)
- [x] List creation interface
- [x] List management system
- [x] Ranking functionality
- [x] Save lists

### Phase 4: Polish & Deploy Final Production
- [ ] Responsive design optimization
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] Production deployment

## 👥 Team Contributions

- **MD Khan (Shanto)** - For this sprint, with the help of my team, I built the Create Movie/Show page, including a full form with all required fields based on the 3rd-party Web API, while keeping it UI-only to avoid affecting the live database. I also helped implement the Search page, allowing logged-in users to search Movies and TV Shows in all supported ways and displaying live results using the list component from the previous sprint. In addition, I designed the Delete feature UI/UX, including the delete button and confirmation modal, as a design-only requirement without connecting it to the backend.
- **Kobe Benavente** - 
- **Pham Nguyen** - 
- **Balkirat Singh** -  Worked on getting the credentials API bug where verification wasn't working to resolve. Kobe was a big help and main factor in fixing. All work together on fixing the small bugs such as:
- delete button not being on our front-end
- some linking issues
Updated the README file slightly.


## 📅 Beta Sprint Meetings

### Meeting Overview
The team conducted regular meetings throughout the Beta Sprint II to coordinate development efforts and resolve technical challenges.

**Primary Communication Channel:** Discord

**Meeting Activities:**
- **Role & Responsibility Division** - Team members met to assign development tasks and establish ownership of different features (Movies page, TV Shows page, authentication, UI/UX design)
- **Initial Setup & Configuration** - Coordinated environment setup, API integration planning, and development workflow establishment
- **Bug Resolution** - Collaborated to identify and fix a critical bug in the Credentials API integration affecting user authentication
- **Progress Sync** - Regular check-ins to discuss implementation progress, share code updates, and resolve merge conflicts

**Meeting Format:**
- Platform: Discord voice channels and text chat
- Frequency: Multiple sessions throughout the sprint as needed
- Format: Synchronous discussions for decision-making and asynchronous updates via text channels
---
## Issues We Faced in Beta II

- **API Configuration**: Resolved challenges with configuring credentials for API authentication and integration.
- **Movie Navigation Links**: Fixed an issue where clicking on movies in multi-view and search results wasn't navigating to the correct movie detail page.
- **Next.js Search Crash**: Resolved a critical bug that was causing Next.js to crash when performing search operations.
- **Advanced Search Implementation**: Successfully integrated the advanced search feature to allow filtering by multiple criteria.
- **Top 10 Lists Feature**: Implemented the top 10 movies and TV shows list functionality.
- **Delete Button Inconsistencies**: Addressed UI issues where the delete button had incorrect behavior when selecting specific movies. Newly created movies
  still lack a delete button implementation.
 - **TV Show Creation Backend**: Unable to fully implement the create TV show backend functionality due to missing Group 7 API credentials. The UI button remains
  visible but is not fully functional.

**Version:** Beta II
**Last Updated:** November 2025
