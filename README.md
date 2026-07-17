# 🌟 Thoughts - Modern Blogging Platform

**🔗 Live Demo:** [https://thoughts-blogging-app.vercel.app/](https://thoughts-blogging-app.vercel.app/)

A premium, full-stack blogging platform that lets users share stories, ideas, and expertise with the world. Built with a focus on high-end aesthetics and a seamless reading experience.

## ✨ Key Features

- **Melting UI Synergy**: Dynamic, fluid, and borderless design with beautiful curvy wave headers that eliminate rigid boxy structures.
- **User Authentication**: Secure Login & Signup that seamlessly "melts" into the page flow.
- **Story Management**: Full CRUD functionality (Create, Read, Edit, Delete) for your blog posts using a Rich Text Editor.
- **Personalized Feed**: Content tailored to what you follow and your favorite tags.
- **Social Features**: 
  - Bookmark your favorite stories.
  - Follow other writers.
  - Hide posts you aren't interested in.
- **Profile Dashboard**: Manage your personal bio, interests, and view your published stories.
- **Enhanced Reading Experience**: Includes a responsive reading progress bar, estimated reading times, and quick-share copy links.

## 🛠️ Tech Stack

**Frontend:**
- **React.js** (Vite)
- **Tailwind CSS** (for all styling, animations, and the "Melting UI" layout)
- **React Router Dom** (for navigation)
- **Redux Toolkit** (for state management)
- **React Hook Form** (for form handling)

**Backend:**
- **Node.js & Express.js**
- **MongoDB**
- **JWT** 


## 📦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance

### 1. Setup the Frontend (Client)
```bash
cd client
npm install
```
Rename `.env-example` to `.env` and fill in your credentials:
```env
VITE_BACKEND_URL=""
```
Start the development server:
```bash
npm run dev
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install
```
Rename `.env-example` to `.env` and fill in your environment variables:
```env
PORT=""       
MONGODB_URI=""
JWT_SECRET=""
FRONTEND_URL=""
```
Start the backend server:
```bash
npm run dev
```

---
*Built for writing captivating stories & blogs and designed for a fluid user reading experience.*
