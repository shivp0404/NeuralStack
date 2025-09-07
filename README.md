# NeuralStack 🎓🚀

NeuralStack is an engaging, student-focused web app designed to help you supercharge your learning!  
Store code snippets, journal your progress, schedule revisions, get AI-powered help, and use emojis to make your study journey lively and productive. 😃✨

---

## ✨ Features

- 🗂️ **Save Snippets:** Organize code, notes, and concepts.
- 📅 **Revision Planner:** Schedule study sessions and get reminders.
- 📔 **Learning Journal:** Document your journey and celebrate achievements.
- 🤖 **AI Help:** Get instant explanations and answers to tough concepts.
- 😎 **Emoji Support:** Annotate and react using expressive emojis.
- 🛠️ **Modular Design:** Clear separation between frontend & backend.
- 🗄️ **MongoDB Database:** Secure data storage with Mongoose.
- 🍪 **Cookie Management:** Safe, persistent sessions.
- 🌍 **CORS Enabled:** Use across devices and platforms.

---

## 🗂️ Project Structure

```
NeuralStack/
├── frontend/   # Client application (React, etc.)
└── backend/    # Server API (Express.js, Mongoose)
```

---

## 🚦 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shivp0404/NeuralStack.git
cd NeuralStack
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```
If you need to install core packages manually:
```bash
npm install express mongoose cookie-parser cors
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `backend/` folder with the following content:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
API_KEY=your_ai_api_key
```
- `PORT`: Port for backend server (default: 5000)
- `MONGO_URI`: Connection string for your MongoDB database
- `JWT_SECRET`: Secret key for JWT authentication
- `API_KEY`: Your API key for AI features (if used)

Make sure to keep your secrets safe! 🔒

---

### 4️⃣ Running Locally

> **Run backend and frontend in two separate terminals!**

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

Open a new terminal window/tab:

```bash
cd frontend
npm run dev
```

Default URLs:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Tech Stack

- **Frontend:** React, CSS, Emoji Picker Library
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **AI:** OpenAI API (or your provider)

---

## 🆘 Troubleshooting

- **MongoDB not connecting?**  
  Check your `MONGO_URI` in `.env` and ensure your MongoDB server is running.

- **Port already in use?**  
  Change the `PORT` value in `.env` or stop the conflicting service.


---

## 📬 Contact & Support

Questions or suggestions?  
Email: shivanshpatel1432@gmail.com  

---

## 🤝 Contributing

Pull requests and suggestions are welcome!  
Want to add features, new emoji packs, more study modules, or extra AI tools?  
Open an issue to discuss your ideas. 🎉

---

## 📜 License

MIT License

---

## ✍️ Author

Created by [shivp0404](https://github.com/shivp0404) 🚀
