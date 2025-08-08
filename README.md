# 📚 Online Exam Application

This project is a **React-based exam application** designed for **TYT, AYT, and LGS** exams, allowing users to solve questions, track time, and view a detailed analysis on the results screen.

---

## 🚀 Features

- **📋 Exam Selection**
  - TYT (165 min)
  - AYT (180 min)
  - LGS (155 min)

- **⏳ Live Countdown Timer**
  - Automatically starts according to the selected exam
  - Ends the exam automatically when the time is up

- **🔀 Section Navigation**
  - "Next Section" and "Previous Section" buttons
  - "Go Up" button in each section

- **📊 Results Screen**
  - Number of correct, incorrect, and unanswered questions per section
  - Correct/incorrect options for each question
  - Explanations
  - **Sections Panel** on the right for direct question navigation

- **🎨 Modern UI**
  - Bootstrap 5 + Custom CSS styles
  - Responsive design
  - Animated buttons and icons

---

## 🛠 Technologies Used

- **React.js**
- **Bootstrap 5**
- **React Hooks** (`useState`, `useEffect`, `useRef`)
- **Custom CSS**
- **JavaScript (ES6)**

---

## 📦 Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/username/project-name.git
   cd project-name
2. **Install Dependencies**
   ```bash
   touch .env
  # Example content of .env
  VITE_GEMINI_API_KEY=your_api_key_here
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
3. **Create .env file**
   ```bash
   npm install
4. **Run project**
   ```bash
   npm run dev
