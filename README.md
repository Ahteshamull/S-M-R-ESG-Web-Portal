# S-M-R ESG Web Portal 🍃

An Integrated ESG (Environmental, Social, and Governance) Web Platform designed to help factories and organizations Measure, Manage, Improve, and Sustain their ESG performance.

## 🚀 Key Features

* **Secure Authentication:** MFA & Role-based Access Control (RBAC).
* **Environment Modules:** Energy, Water, Waste, and Carbon tracking.
* **Compliance & Documents:** CAP Tracker, Audits, Policies, and Certifications.
* **Chemical Management:** ZDHC MRSL Compliance & Inventory.
* **Social & CSR:** Worker Committees, Training Calendars, and CSR Activities.
* **Analytics & Reports:** Generate comprehensive PDF/Excel reports instantly.

## 💻 Tech Stack (Frontend)

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **UI Components:** Glassmorphism Design System
* **Icons & Assets:** [Lucide React](https://lucide.dev/)
* **Notifications & Modals:** `react-hot-toast` & Custom Animated Modals

## 🛠️ Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── dashboard/        # All 13 Dashboard Modules (Energy, Water, CSR, etc.)
│   ├── login/            # Secure Login Portal
│   ├── globals.css       # Tailwind & Theme Definitions
│   └── layout.tsx        # Root Layout & Toaster Provider
├── components/
│   ├── layout/           # Sidebar, Topbar
│   └── ui/               # Reusable Components (Modal, ConfirmModal)
└── lib/                  # Utilities and Helpers
```

## 🔒 Planned Backend Integration
This frontend is structurally designed to connect seamlessly with a Node.js/Express.js backend utilizing MongoDB for data persistence and JWT for session management. (See `Project_Flow_Architecture.txt` for detailed mapping).

## 📄 License
Private & Confidential. All rights reserved.
