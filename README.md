# Email Phishing Detector 🛡️

A professional Full-Stack web application designed to detect and analyze potential phishing indicators in email content. This project was developed as part of a cybersecurity assignment, demonstrating the implementation of security logic using modern web technologies.

## 🚀 Live Demo
Check out the live application here:  
**[Email Phishing Detector - Live Site](https://email-phishing-detector-alpha.vercel.app/)**

---

## 📖 Overview
The Email Phishing Detector scans email text for common malicious indicators. It uses a custom-built Regex engine on the backend to identify threats while providing a clean, intuitive interface for the user.

### Key Detection Indicators:
- **Suspicious Links:** Identifies URLs containing raw IP addresses instead of legitimate domain names.
- **Typosquatting & Spoofed Senders:** Detects variations of popular brands (e.g., `paypa1.com`, `googl3.com`) using a dynamic configuration system.
- **Urgency Analysis:** Flags psychological triggers and urgent language commonly used in social engineering attacks.

---

## ✨ Features
- **Real-time Scanning:** Paste email content or upload `.txt` files for instant analysis.
- **Visual Risk Report:** Clearly categorized findings (High Risk vs. Safe) with detailed indicator breakdowns.
- **Scalable Architecture:** Built with a decoupled Frontend/Backend structure.
- **Modern UI:** Responsive design using Tailwind CSS with dark/light mode aesthetics.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.
- **Deployment:** Vercel (Serverless Functions for Backend).
- **Version Control:** Git & GitHub.

---

## 📂 Project Structure
This repository is organized as a **Monorepo**:

```text
├── backend/            # Express.js API & Security Logic
│   └── server.js       # Main server entry point
├── frontend/           # React application (Vite)
│   └── src/            # UI Components & Styling
├── vercel.json         # Deployment & Routing configuration
└── README.md           # Project Documentation
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Yahav78/Email-Phishing-Detector.git
cd Email-Phishing-Detector
```

### 2. Setup Backend

```bash
cd backend
npm install
node server.js
```

### 3. Setup Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

---

## ⚠️ Disclaimer
This tool is intended for educational and simulation purposes only. While it uses effective detection patterns, it should not be used as a primary security solution for enterprise environments.

---

## 👤 Author
Yahav Vituri - Computer Science Student @ Ramat Gan Academic College
