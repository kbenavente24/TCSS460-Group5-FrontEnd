# 📺 TCSS 460 Group 5 — Front-End Project
Combined README: Beta I, Beta II, and Front-End Project
---

# Published Front End Production
**Production URL:** https://tcss460-group5.vercel.app
*Due: Sun Dec 7, 2025 11:59pm*

## Web API Connection
All front-end functionality is fully connected to the required 3rd-party APIs.
Our project did not use any Heroku-hosted APIs. All APIs provided to our group were Render-hosted.

### APIs Used
- **TV Shows API (Group 7)** — https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/api-docs
  Their API went down on December 7th 6:30 pm. All our stuff was fully functional. But their render was not loading at all. Update: communicated and got the API back up and running. should be fully functional again. 
- **Movies API (Group 6)** — https://tcss460-api.onrender.com/api-docs
- **Credentials API (Group 8)** — https://credential-api-giuj.onrender.com/

---

## Functionality
Everything on our front end is fully functional with the provided APIs.
All pages are consistent, match our Figma designs, and the application is thoroughly tested.

### Front-End Highlights
- **Advanced Search with Tabbed Interface** — Real-time search with tabs for switching between Movies and TV Shows
- **Multiple Search Filters** — Genre, year, director, actor, studio, network, and status filters for precise results
- **Pagination System** — Handles large datasets with page-based navigation for optimal performance
- **Custom Top 10 Lists Feature** — Create personalized lists with three types: Movies-only, TV Shows-only, or Mixed
- **User-Scoped Data** — All lists are private and securely tied to authenticated users
- **Dark/Light Theme Toggle** — Persistent theme preference using local storage
- **Responsive Navigation** — Adaptive drawer/sidebar with mobile support for seamless experience across devices
- **All Pages Connected to Real API Data** — Live data from all three third-party APIs
- **Clean and Consistent UI** — Matches final Figma design specifications across all pages

---

# Final Sprint Contribution (Production)

## 👥 Group Members & Contributions
### **Kobe Benavente**
Configured and deployed the web application on Vercel. Contributed to final front-end updates and search functionality. Adapted the search feature to work with the TV Show API and assisted with debugging issues related to the Credentials API.

### **Balkirat Singh**
Worked extensively through the Credentials API functionality bugs. Fixed TV Show API filtering issues, specifically where the year filter was not functional. Ensured the final front end was clean, stable, and consistent with both APIs and performed final testing and UI cleanup.

### **MD Khan (Shanto)**
Contributed to final UI adjustments, cleaned up layout components, and assisted with connecting the remaining pages to their respective API endpoints. Helped ensure search results and detail pages rendered uniformly across the application.

### **Pham Nguyen**
Helped polish the final UI, corrected styling inconsistencies, and assisted in preparing the application for production deployment. Contributed to validating API responses and making sure components handled real data cleanly.

---

# Final Sprint Meetings

### **Meeting 1 — Thursday, 7:00pm–7:40pm (Discord)**
**Topics Discussed:**
- Verified the final UI layout and cross-checked with Figma
- Assigned production tasks and prioritized the remaining bugs
- Reviewed API integration behavior for search and detail pages

### **Meeting 2 — Friday, 7:15pm–7:55pm (Discord)**
**Topics Discussed:**
- Re-tested the TV Show API year filtering issue
- Debugged Credentials API interactions and verified login/registration stability
- Synced progress on Top 10 List feature and search consistency

### **Meeting 3 — Saturday, 7:30pm–8:10pm (Discord)**
**Topics Discussed:**
- Final UI cleanup, spacing, and responsive behavior
- Confirmed removal of broken "Forgot Password" feature due to API verification endpoint failures
- Prepared README updates and confirmed production readiness

**Primary Communication:**
Discord (text + voice) throughout the sprint.

---

# Final Sprint Comments

### ⚠️ Performance Note on Loading Times
Our front end is fully functional, but some actions take longer to complete because the APIs we rely on can be slow to respond. Registering an account can take up to about one minute before the verification returns. Logging in may also take noticeably longer than expected. The same delay can happen when navigating to Movies or TV Shows, especially when the TV Shows API is waking up from an inactive state. Everything will load successfully, but you may need to wait a little for the response. This is normal behavior for the Render hosted APIs we are using.


- Our team went extensively back and forth with **Group 8's Credentials API** team to resolve verification and reset-password behavior.
- The verification workflow did not function even after multiple tests using multiple emails.
- Because of this, we removed the **Forgot Password** button from the login page to avoid having a broken feature on the front end.
- All other API features work as expected.
- The **Top 10 Lists feature** is fully functional and integrated with both APIs.
- The search functionality works for both Movie and TV Show endpoints.
- All pages are stable, thoroughly tested, and match the final Figma design.

### Note on Credentials API Development
Before the final sprint, our team implemented our **own custom Credentials API** because Group 8's Credentials API was not functional at the time. We wanted to demonstrate that we fully understood the authentication workflow, including email verification, login, registration, and secure session handling. Our repository contains commits showing a more complete and fully functional verification workflow that we had integrated into the front end. Another thing is that we mentioned to the credentials API team that we require the admin account to further flesh out admin functionality (such as delete) but we did not get a response to that is not a thing.

For the **final production sprint**, we switched back to using **Group 8's third-party Credentials API**, as required by the project specifications. Although the verification endpoint never became functional, we aligned our final implementation with the course requirement to use the provided third-party APIs rather than our personal API.

---

# Beta I Sprint

## 📊 Current Status — Beta Version I
The application entered active development with foundational and core features implemented. Users could browse movies and TV shows via mock data, manage authentication, and navigate the responsive UI.

## ✨ Features Implemented in Beta I

### 🎥 Movies
- Paginated grid
- Single movie view
- Arrow navigation
- Toggle grid/single view
- Search bar UI (functionality pending)

### 📺 TV Shows
- TV shows list and detail pages using mock data
- Pagination and navigation

### 🔐 Authentication
- Login and registration
- Persistent sessions
- Logout
- Password reset

### 🎨 User Interface
- Responsive design
- Light/Dark mode toggle
- Navigation header
- Welcome homepage

### 🔌 API Integration
Connected to:
- Group 8 Credentials API
- Group 7 Movies API
- Group 6 TV Shows API

## 🗺️ Development Roadmap (Beta I)
- Phase 1 — Complete
- Phase 2 — In Progress
- Phase 3 — Planned
- Phase 4 — Upcoming

## 👥 Team Contributions — Beta I
- **MD Khan (Shanto)** — TV shows mock pages, change password UI, fixed env issues
- **Kobe Benavente** — Movies page, pagination, UI redesign, Vercel deployment
- **Pham Nguyen** — Updated forms to match Auth API, integrated login/register
- **Balkirat Singh** — Rebuilt database for Credentials API, assisted with mock data + validation

## 📅 Beta Sprint I Meetings

### **Meeting 1 — Thursday, 7:00pm–7:40pm (Discord)**
**Topics Discussed:**
- Assigned responsibilities for Movies page, TV Shows page, authentication, and UI structure
- Reviewed overall mockups and layout plan
- Established environment setup steps and API integration expectations

### **Meeting 2 — Friday, 7:15pm–7:55pm (Discord)**
**Topics Discussed:**
- Debugged the Credentials API crash caused by database issues
- Synced on mock data for TV shows and movies
- Verified login/registration behavior against the Auth API rules

### **Meeting 3 — Saturday, 7:30pm–8:10pm (Discord)**
**Topics Discussed:**
- Reviewed progress toward Beta I milestones
- Coordinated merging changes and resolving conflicts
- Finalized Beta I documentation updates and confirmed deployment to Vercel

---

# Beta II Sprint

## 📊 Current Status — Beta Version II
The application is nearing final production. It now uses real API data, supports full authentication, and includes the Top 10 lists feature.

## ✨ Features Implemented in Beta II

### 🎥 Movies and TV Shows
- Browse both categories
- Pagination
- Single/multi-view
- Advanced search
- Real-time results rendering

### 🔐 Authentication
- Login, register, logout
- Persistent sessions
- Reset password options

### ⭐ Top 10 Lists
- Create custom list categories
- Add/remove items
- Drag-and-drop ranking
- Save lists

### 🎨 User Interface
- Responsive UI
- Dark/light toggle
- Updated navigation/header

### 🔌 API Connectivity
Integrated with:
- Group 8 Credentials API
- Group 7 Movies API
- Group 6 TV Shows API

## 🗺️ Development Roadmap (Beta II)
- Phase 1 — Complete
- Phase 2 — Complete
- Phase 3 — Complete
- Phase 4 — In Progress

## 👥 Team Contributions — Beta II
- **MD Khan (Shanto)** — Create Movie/Show UI, Search page, Delete UI
- **Kobe Benavente** — Top 10 feature, Credentials API debugging, UI fixes
- **Pham Nguyen** — Movie/show list pages with live API data, detail pages
- **Balkirat Singh** — Helped fix Credentials API verification bug, fixed delete/linking issues, updated README

## 📅 Beta Sprint II Meetings

### **Meeting 1 — Thursday, 7:05pm–7:45pm (Discord)**
**Topics Discussed:**
- Planned Top 10 feature workflow and UI behavior
- Reviewed API endpoints for search and filtering
- Assigned tasks for advanced search and list management

### **Meeting 2 — Friday, 7:20pm–8:00pm (Discord)**
**Topics Discussed:**
- Investigated and fixed the Credentials API email verification failure
- Synced on Movie/Show navigation bugs
- Coordinated work on live search integration and pagination updates

### **Meeting 3 — Saturday, 7:40pm–8:20pm (Discord)**
**Topics Discussed:**
- Finalized UI polish and theme toggle adjustments
- Reviewed incomplete TV Show creation backend due to missing Group 7 credentials
- Confirmed readiness for Beta II submission and updated README sections
