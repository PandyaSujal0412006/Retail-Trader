# 📈 TradeMudra

> A beautiful, modern, and highly-secure SaaS platform built for Retail Traders to analyze their trading history, calculate advanced equity curves, and manage risk parameters. 


TradeMudra bridges the gap between raw broker data and actionable insights. Built with a stunning dark-mode UI inspired by modern cyber-aesthetics, this application allows traders to easily drag-and-drop their broker CSV files and instantly see their performance metrics visualized in real-time.

## ✨ Features

- **🔒 Secure Authentication:** Powered by Firebase Auth, featuring mandatory email verification to keep user data strictly isolated.
- **📊 Advanced Analytics Engine:** Parses raw broker CSV/XLSX files entirely client-side to calculate Win Rates, Total P&L, Max Drawdown, and generate interactive Equity Curves using Recharts.
- **💸 3-Tier Subscription Model:** 
  - **Free Tier:** Limited to 1 file import.
  - **Plus Tier (₹10):** Up to 10 file imports.
  - **Pro Tier (₹300):** Unlimited data analysis.
- **📱 Manual UPI Payment Flow:** Integrated BHIM/GPay QR Code generation. Users upload their UPI Transaction ID directly from the dashboard.
- **🛡️ Isolated Admin Command Center:** A completely detached, highly secure Admin Portal (bypassing standard auth rules via session storage) that allows the owner to verify UPI payments, track total revenue, and instantly upgrade user accounts.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Firebase (Firestore & Firebase Auth)](https://firebase.google.com/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **File Parsing:** [Papaparse](https://www.papaparse.com/) & [XLSX](https://sheetjs.com/)

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

Next, you will need to set up your Firebase Environment Variables. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👨‍💻 Admin Access
The admin panel is securely isolated at `/admin`. It requires authorized hardcoded credentials to access the financial analytics and verification queue.

---
### ⚖️ Legal & Copyright
**© 2024 TradeMudra.** All rights of this website, design, and source code are strictly reserved and owned by **Sujal Pandya**.
- **Email:** sujal.pandya0412006@gmail.com
- **Phone:** +91 87994 67476

*Unauthorized distribution or copying of this material is prohibited.*
