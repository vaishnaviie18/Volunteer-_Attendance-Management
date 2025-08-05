<div align="center">
  <br />
    <a href="#" target="_blank">
      <img src="./nonRelatedAssets/preview.png" alt="Volunteer Attendance System">
    </a>
  <br />

  <br />
  <div>
    <img src="https://img.shields.io/badge/React%20JS-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black" alt="reactdotjs" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" alt="javascript" />
    <img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white" alt="html5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6.svg?style=for-the-badge&logo=CSS3&logoColor=white" alt="css3" />
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="nojedotjs" />
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="expressjs" />
    <img src="https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD" alt="nodemon" />
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
  </div>

  <h1 align="center">Volunteer Attendance System - MERN</h1>

   <div align="center">
     The Volunteer Attendance System is a web-based solution designed to track volunteer attendance and working hours efficiently. Built using React.js, HTML, CSS, and JavaScript for the frontend and powered by Node.js for the backend, it ensures seamless performance and scalability. The system supports MongoDB for secure and reliable data storage. Key features include user authentication and role management, volunteer check-in and check-out, automated work hour calculation, real-time attendance tracking, and comprehensive reporting with data visualization, making it a powerful tool for non-profit and event-based volunteer management. 🚀
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)  
2. ⚙️ [Tech Stack](#tech-stack)  
3. 🔋 [Features](#features)  
4. 📁 [Folder Structure](#folder-structure)  
5. 🤸 [Quick Start](#quick-start)  
6. 🚀 [Usage](#usage)  
7. 🔗 [API Endpoints](#api-endpoints)  
8. 🐞 [Troubleshooting](#troubleshooting)  
9. ✨ [Contributing](#contributing)  

## <a name="introduction">🤖 Introduction</a>

The Volunteer Attendance System is built with React.js, Node.js, and MongoDB to track attendance efficiently. Key features include user authentication, role management, check-in/out, automated work hour calculation, real-time tracking, and detailed reports — ensuring seamless volunteer management and reducing manual overhead.

## <a name="tech-stack">⚙️ Tech Stack</a>

- React JS  
- JavaScript  
- HTML5  
- CSS3  
- Node JS  
- Express JS  
- Nodemon  
- MongoDB  

## <a name="features">🔋 Features</a>

### Admin Features:

👉 Add, Edit, and Delete Volunteer Attendance  
👉 View All Attendance Records for a Selected Volunteer  
👉 Monthly Attendance Summary with Present, Absent, and Leave Days  
👉 User Management (Add, View, and Update Volunteer Details)  
👉 Secure Admin Access with Role-Based Authorization  

### Volunteer Features:

👉 View Own Attendance Records  
👉 Attendance Summary by Month and Year  

### General Features:

👉 User Authentication (Login, Registration)  
👉 Protected Routes using JWT Tokens  
👉 Responsive UI for Desktop and Mobile Devices  

## <a name="folder-structure">📁 Folder Structure</a>

```bash
Volunteer-Attendance-System-MERN/
├── backend/                            # Backend Directory (Node.js, Express, MongoDB)
│   ├── middleware/                     # Express Middlewares
│   │   └── auth.js                     # Authentication Middleware
│   ├── models/                         # Mongoose Models
│   │   ├── Attendance.js               # Attendance Schema
│   │   └── User.js                     # User Schema
│   ├── routes/                         # API Routes
│   │   ├── admin.js                    # Admin Routes
│   │   ├── attendance.js               # Attendance Routes
│   │   └── auth.js                     # Authentication Routes
│   ├── .env.example                    # Example Environment Variables
│   ├── .env.local                      # Local Environment Config
│   └── server.js                       # Express Server Entry
├── frontend/                           # Frontend Directory (React.js)
│   ├── public/                         # Public Assets
│   ├── src/                            # Source Code
│   │   ├── assets/                     # Images, Icons
│   │   ├── components/                 # Reusable Components
│   │   ├── pages/                      # Pages (Dashboard, Login, etc.)
│   │   ├── App.js                      # App Entry
│   │   └── index.js                    # React DOM Entry
│   └── package.json                    # Dependencies
├── nonRelatedAssets/                   # Non-Project Assets (like preview images)
