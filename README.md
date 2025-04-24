# 📋 Simple Project Management App (MERN Stack)

This is a basic project management application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It supports features like task assignment, comment tracking, and group-based task organization.

---

## 🚀 Getting Started

### 📁 Backend Setup
```bash
cd root
npm install
npm run dev
```

### 💻 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```
PORT=your_port_number
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
```

> 💡 *Example:*
> ```
> PORT=5000
> MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/your-db
> JWT_SECRET=yourSuperSecretKey123
> ```

You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to host your database online.

---

## 📂 Folder Structure
```
root
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
├── frontend
│   ├── pages
│   ├── App.jsx
│   └── index.js
├── .env
├── package.json
└── README.md
```

---

## 📌 Features
- ✅ User Authentication & Authorization (JWT based)
- 🧑‍🤝‍🧑 Group-based task creation
- 📋 Assign tasks to users
- 💬 Add comments to tasks
- 🔄 Real-time update of task and comment UI (via React Query)

---

## 🧪 API Endpoints (Sample)

### Authentication
- `POST /api/auth/signup` – Register user
- `POST /api/auth/login` – Login user

### Tasks
- `GET /api/tasks/allTasks/:groupId` – Get all tasks for a group
- `POST /api/tasks/:groupId/createTasks` – Create a new task
- `POST /api/tasks/:groupId/comment/:taskId` – Add a comment to a task

---

## 🛡️ Tech Stack
- **Frontend:** React, Tailwind CSS, React Query, daisyUI
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT (JSON Web Tokens)

---

## 📃 License
This project is licensed under the MIT License.

---

## 🙋‍♂️ Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📞 Contact
Created by [Aayush Thapa] – feel free to reach out for collaboration!
email: aayushthapa640@gmail.com

---
