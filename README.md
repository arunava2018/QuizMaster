<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,typescript,tailwind,mongodb,vercel,shadcn" alt="Tech Stack" />
  <h1>🧠 QuizMaster</h1>
  <p>A modern, full-stack quiz platform built with <b>Next.js</b>, <b>TypeScript</b>, and <b>MongoDB</b> — offering real-time quiz experiences, progress tracking, and time-based submissions.</p>
</div>

---

## 🚀 Features

- 🔐 **Authentication with Clerk**
- 🧩 **Dynamic Quiz System** (fetches questions from MongoDB)
- ⏱️ **Real-Time Timer** that auto-submits on expiry
- 📊 **Progress Tracker** for answered, marked, and remaining questions
- 📱 **Responsive UI** (mobile-first with Tailwind)
- 💾 **Attempt Recording** and quiz submission time tracking
- 🌗 **Dark/Light Theme Support**

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | MongoDB with Mongoose |
| **Authentication** | Clerk |
| **UI Components** | shadcn/ui, lucide-react |
| **Notifications** | Sonner (toast notifications) |
| **Deployment** | Vercel |

---

## ⚙️ Environment Setup

### 1️⃣ Create a `.env` file in the root directory with the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_sk_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
CLERK_WEBHOOK_SECRET=your_webhook_secret
```
---
## 📁 Folder Structure
```
quizmaster/
├── app/ # Next.js App Router directory
│ ├── (auth)/ # Authentication routes (Clerk)
│ │ ├── sign-in/
│ │ │ └── page.tsx
│ │ └── sign-up/
│ │ └── page.tsx
│ │
│ ├── admin/ # Admin dashboard pages
│ │ ├── questions/
│ │ │ └── page.tsx
│ │ ├── topics/
│ │ │ └── page.tsx
│ │ ├── layout.tsx
│ │ └── page.tsx
│ │
│ ├── api/ # Next.js API routes
│ │ ├── admin/
│ │ ├── profile/
│ │ ├── questions/
│ │ ├── quiz/
│ │ ├── topics/
│ │ ├── users/
│ │ └── webhooks/
│ │
│ ├── profile/
│ │ └── [clerkUserId]/ # Dynamic user profile page
│ │ └── page.tsx
│ │
│ ├── quiz/ # Quiz-related pages
│ │ ├── [topicId]/ # Dynamic topic quizzes
│ │ │ └── page.tsx
│ │ ├── disclaimer/
│ │ │ └── page.tsx
│ │ ├── result/
│ │ │ └── page.tsx
│ │ ├── review/
│ │ │ └── page.tsx
│ │ ├── layout.tsx
│ │ └── page.tsx
│ │
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx # Root layout file
│ └── page.tsx # Homepage
│
├── components/ # Reusable UI and page components
│ ├── admin/ # Admin dashboard components
│ ├── profile/ # User profile components
│ ├── quiz/ # Quiz components (Header, Footer, etc.)
│ ├── ui/ # Generic UI elements (shadcn/ui)
│ │ ├── FAQ.tsx
│ │ ├── Features.tsx
│ │ ├── Footer.tsx
│ │ ├── Hero.tsx
│ │ ├── How-It-Works.tsx
│ │ ├── Navbar.tsx
│ │ ├── Testimonials.tsx
│ │ └── theme-provider.tsx
│
├── lib/ # Utility and config files
│ ├── db.ts # MongoDB connection
│ └── utils.ts # Common utility functions
│
├── models/ # Mongoose schema definitions
│ ├── AdminUser.ts
│ ├── Question.ts
│ ├── TestInformation.ts
│ ├── Topics.ts
│ └── User.ts
│
├── public/ # Static assets
│ ├── quizmaster-preview.png
│ └── icons/
│
├── styles/ # Global styles (if separate)
│ └── globals.css
│
├── .env # Environment variables
├── .gitignore # Ignored files
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json # TypeScript configuration
├── package.json # Dependencies and scripts

```
---
## 💻 Installation & Running Locally
```
# Clone the repository
git clone https://github.com/yourusername/quizmaster.git

# Navigate to the project
cd quizmaster

# Install dependencies
npm install

# Run the development server
npm run dev
```
---

## 🧩 How It Works

The **QuizMaster** platform provides a smooth, real-time quiz-taking experience with a clear workflow from login to result viewing.  

### 🔄 User Flow

1. **Sign In / Sign Up**
   - Users authenticate securely through **Clerk**.
   - After login, they are redirected to the dashboard displaying available quiz topics.

2. **Select a Quiz**
   - Each quiz topic is dynamically fetched from **MongoDB**.
   - Upon starting, the quiz timer initializes (default: 20 minutes).

3. **Take the Quiz**
   - Questions are displayed one by one with multiple-choice options.
   - The user can:
     - Select an option  
     - Save an answer  
     - Move to the next question  
     - Mark a question for review  

4. **Track Progress**
   - The **Quiz Navigator** on the right shows:
     - ✅ Answered questions (green)  
     - ⚠️ Marked for review (yellow)  
     - ❌ Not attempted (gray)
   - A real-time countdown timer is displayed in the quiz header.

5. **Submit the Quiz**
   - The user can submit manually or it auto-submits when time expires.
   - Responses and time taken are securely recorded in the database.

6. **View Results**
   - After submission, users are redirected to a detailed **Result Page**, showing:
     - Score obtained  
     - Time taken  
     - Attempted vs. unattempted questions  

---
## 🧑‍💻 Author

**👋 Arunava Banerjee**  
 

- 🌐 [Portfolio](https://arunava-banerjee.vercel.app/)  
- 💼 [LinkedIn](https://linkedin.com/in/arunava-banerjee)  
- 🐙 [GitHub](https://github.com/arunava2018)  
- ✉️ arunava@example.com  



