# Smart Job Tracker

A sleek, modern full-stack application built to systematically track job applications, manage professional skills, and prepare for interviews. Built with the MERN stack and styled with a minimal, SaaS-like aesthetic using Tailwind CSS.

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)

##  Features

-  **Secure Authentication**: JWT-based login and registration system.
-  **Interactive Analytics Dashboard**: Visualizes your application funnel using visually appealing Recharts (Pie & Bar charts).
-  **Drag-and-Drop Kanban Board**: Seamlessly update job statuses using native HTML5 drag and drop across custom columns.
-  **Intelligent Date Tracking**: Precise tracking of application dates and conditionally rendered, highlighted interview dates.
-  **Gamified Skill Roadmap**: Track your learning progress with dynamic mastery badges (Novice to Expert) and a one-click "+10%" quick level-up feature.
- **Context-Aware AI Guide Bot**: Animated, floating mock chatbot that provides context-aware assistance depending on the page you're viewing.
-  **CSV Export**: Extract and backup all your job hunting data with a single click.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Recharts (Data Visualization)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)

##  Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarshavardhanJagiru/Track-smart.git
   cd Track-smart
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Open Application:**
   Visit `http://localhost:5173` in your browser.


## License

This project is open source and available under the [MIT License](LICENSE).
