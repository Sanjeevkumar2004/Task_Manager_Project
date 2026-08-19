# 🤖 AI Task Management System

A full-stack, AI-powered task management web application with both a **frontend** and **backend** in a single monorepo. It helps users efficiently create, organize, prioritize, and track their tasks — powered by an intelligent backend API and a dataset for AI-driven features.

🔗 **Live Demo:** [task-manager-project-ashen.vercel.app](https://task-manager-project-ashen.vercel.app)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🧠 About the Project

The **AI Task Management System** is a monorepo containing a complete full-stack application. The `backend/` folder handles all API logic, authentication, and data management, while the `frontend/` folder provides a responsive, user-friendly interface. The `dataset/` directory supports AI/ML capabilities such as smart task classification or priority prediction.

---

## ✨ Features

- ✅ Create, read, update, and delete (CRUD) tasks
- 🏷️ Categorize and prioritize tasks
- 🤖 AI-powered task classification using a built-in dataset
- 📊 Dashboard for visualizing task progress
- 🔐 User authentication and authorization (JWT)
- 📱 Responsive design — works on desktop and mobile
- ☁️ Deployed and accessible online via Vercel

---

## 📁 Project Structure

```
Task_Manager_Project/
├── backend/              # Node.js/Express REST API
│   ├── routes/           # API route definitions
│   ├── controllers/      # Business logic handlers
│   ├── models/           # Database models/schemas
│   ├── middleware/       # Auth and error middleware
│   ├── .env              # Backend environment variables
│   └── package.json
│
├── frontend/             # React.js client application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages/views
│   │   ├── services/     # API call functions
│   │   └── App.js        # Root component
│   ├── public/
│   └── package.json
│
├── dataset/              # Data files for AI/ML features
├── package-lock.json
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| HTML / CSS / JavaScript | Markup, styling, and interactivity |
| Axios | HTTP requests to backend API |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework / REST API |
| MongoDB / MySQL | Database |
| JWT | Authentication |
| dotenv | Environment configuration |

> **Note:** Update the table with the exact libraries used in your project.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- A running database (MongoDB Atlas or local MySQL/MongoDB)

### Clone the Repository

```bash
git clone https://github.com/Sanjeevkumar2004/Task_Manager_Project.git
cd Task_Manager_Project
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm start
```

The backend API will run at: `http://localhost:5000`

---

### Frontend Setup

Open a **new terminal**, then:

```bash
cd frontend
npm install
npm start
```

The frontend will run at: `http://localhost:3000`

> Make sure the backend is running before starting the frontend.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

> ⚠️ Never commit your `.env` file to version control. Ensure it is listed in `.gitignore`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/tasks` | Get all tasks for the user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task by ID |
| DELETE | `/api/tasks/:id` | Delete a task by ID |

> Update this table to match the actual routes defined in your `backend/routes/` folder.

---

## ☁️ Deployment

This project is deployed on **Vercel**.

To deploy your own instance:

1. Push the repository to GitHub.
2. Import it in [Vercel](https://vercel.com/).
3. Set the **root directory** to `frontend/` for the frontend deployment.
4. Deploy the backend separately (e.g., on Railway, Render, or a VPS).
5. Add all environment variables in Vercel project settings.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use and modify it. Please give appropriate credit to the original author if redistributed.

---

> ⭐ If you found this project helpful, consider giving it a star on GitHub!
