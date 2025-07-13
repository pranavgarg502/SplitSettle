# 💸 SplitSettle

**SplitSettle** is a full-stack expense settlement app that helps groups manage shared payments and reduce redundant transactions automatically. Built with the MERN stack and powered by graph-based optimization, SplitSettle simplifies who-pays-whom in group scenarios like trips, events, or shared living.

## 🌟 Features

- 🔁 Auto-minimized settlements (graph-based logic)
- 🧾 Add, edit, and delete transactions
- 👥 Supports both guest and registered users
- 🔒 JWT authentication for users
- 🧠 Persistent guest sessions with `localStorage`
- 📊 Graph visualization of optimized payments (React Flow)
- 📱 Mobile responsive and works on modern browsers
- 💻 RESTful backend APIs

## 🧑‍💻 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Auth**: JWT for users, localStorage tokens for guests
- **Visualization**: React Flow

## 🌐 Live Demo

[https://split-settle.vercel.app](https://split-settle.vercel.app)

## 📦 GitHub Repository

[https://github.com/pranavgarg502/SplitSettle](https://github.com/pranavgarg502/SplitSettle)

## 🚀 Getting Started

```bash
git clone https://github.com/pranavgarg502/SplitSettle
cd splitsettle

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Configure Environment Variables

Create a `.env` file in the `server` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create a `.env` file in the `client` folder:

```
VITE_API_URL=http://localhost:5000/api
```

### Run the App

```bash
# In one terminal (Backend)
cd server
npm run dev

# In another terminal (Frontend)
cd client
npm run dev
```

Then visit: [http://localhost:5173](http://localhost:5173)

## ⚙️ How It Works

SplitSettle models users and debts as a directed graph. It applies a greedy graph-based minimization algorithm to reduce the number of transactions.

Example:
```
A → B ₹500  
B → C ₹500  
→ Becomes: A → C ₹500
```

This reduces redundant payments by up to 60%.

## 🧾 Guest Session Logic

- Guests receive a `guest_token` stored in localStorage
- Session persists across refresh, logout, and backend restarts
- Middleware handles both guest and registered tokens

## 🗺 Future Enhancements

- [ ] PDF export for settlements
- [ ] Group roles & permissions
- [ ] Notifications via email/SMS
- [ ] Enhanced React Flow layout

## 🙌 Acknowledgements

- [Shadcn UI](https://ui.shadcn.com)
- [React Flow](https://reactflow.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MongoDB](https://www.mongodb.com)
- [Render](https://render.com)
- [Vercel](https://vercel.com)

---

> Built with ❤️ by [Pranav Garg](https://www.linkedin.com/in/pranav-garg-dev)
