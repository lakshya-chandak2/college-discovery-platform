# 🎓 CollegeFinder - Discovery & Comparison Platform

CollegeFinder is a professional, product-ready web application designed to help students discover, compare, and save their favorite educational institutions across India.

## 🚀 Features

- **Advanced Search**: Find colleges by name or city.
- **Dynamic Filters**: Filter institutions by location, maximum fees, and rankings.
- **Side-by-Side Comparison**: Compare multiple colleges across fees, placement rates, ratings, and courses.
- **Personalized Wishlist**: Save colleges to your account for future reference.
- **Comparison History**: Revisit your past comparisons with one click.
- **Secure Authentication**: Traditional Email/Password login and Google One-Tap integration.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, Tailwind CSS 4, React Context API.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: SQLite with Prisma ORM.
- **Auth**: JSON Web Tokens (JWT) & Google OAuth 2.0.

---

## 🏁 Getting Started (For Beginners)

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Ensure you have **Node.js** installed (Version 18 or higher recommended). 
[Download Node.js here](https://nodejs.org/)

### 2. Setup the Server (Backend)

1. Open your terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder and add the following:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_random_secret_key"
   GOOGLE_CLIENT_ID="396619566527-oaksamt5jtdj5tlplhj6muoa18n8hih1.apps.googleusercontent.com"
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   *The server will now be running at `http://localhost:5000`*

### 3. Setup the Client (Frontend)

1. Open a **new terminal window** and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `client` folder and add the following:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="396619566527-oaksamt5jtdj5tlplhj6muoa18n8hih1.apps.googleusercontent.com"
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
/
├── client/           # Next.js frontend
│   ├── src/app/      # Main pages & routing
│   └── src/components/ # Reusable UI components
├── server/           # Node.js backend
│   ├── src/routes/   # API endpoints
│   └── prisma/       # Database schema
└── college.json      # Sample data source
```

## 🤝 Contributing
Feel free to fork this repository and submit pull requests for any improvements!

## 📝 License
This project is licensed under the MIT License.
