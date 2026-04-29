# 🌐 CollegeFinder - Frontend

This is the frontend of the CollegeFinder platform, built with **Next.js** and **Tailwind CSS**.

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="396619566527-oaksamt5jtdj5tlplhj6muoa18n8hih1.apps.googleusercontent.com"
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🏗️ Architecture
- **Next.js App Router**: For optimized routing and server-side rendering.
- **Tailwind CSS 4**: For high-performance, modern styling.
- **React Context**: Used for Global Authentication state management.
- **API Lib**: Standardized `fetch` wrapper in `src/lib/api.ts`.

For full project setup instructions (including backend), please refer to the [Main README](../README.md).
