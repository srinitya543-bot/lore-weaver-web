# LoreWeaver - AI World-Building & Narrative Knowledge Engine

LoreWeaver is a next-generation knowledge-synthesis and narrative companion for Creative Writers, World-Builders, Game Masters (TTRPGs), and Narrative Designers.

---

## 🚀 Quick Start in Visual Studio Code

### 1. Prerequisites
- **Node.js** (v18, v20, or v22 recommended)
- **npm** (comes with Node.js)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) (Free tier available)

---

### 2. Setup & Installation
Open the project folder in VS Code, open a terminal (`Ctrl + \`` or `Cmd + \``), and run:

```bash
# Install dependencies
npm install
```

---

### 3. Configure Your Gemini API Key
Create a `.env` file in the root folder:

```bash
# On Mac/Linux:
cp .env.example .env

# On Windows (PowerShell):
copy .env.example .env
```

Open `.env` and insert your Gemini API Key:
```env
GEMINI_API_KEY="AIzaSy..."
```

---

### 4. Run the Application

You have two easy ways to run LoreWeaver:

#### Option A: Full-Stack Mode (Recommended - with Gemini Backend)
```bash
npm run dev
```
- Starts the Express backend on port `3000` with the live Vite client mounted.
- Open your browser to: **http://localhost:3000**

#### Option B: Standalone Vite Mode (Instant Client Preview)
```bash
npm run dev:vite
```
- Starts standard Vite client on port `3000` (uses smart deterministic heuristic engine).
- Open your browser to: **http://localhost:3000**

---

### 5. Production Build & Static Deployment (GitHub Pages / Vercel)
```bash
npm run build
```
The output will be placed in the `/dist` directory with relative asset paths ready to deploy to GitHub Pages, Vercel, Netlify, or any static hosting service.

---

## 🌟 Key Features
- **Feature A: The Lore Consistency Guard:** Real-time plot-hole and world-rule contradiction detector with one-click rewrites.
- **Feature B: In-Character Audio/Text Briefings:** Spoken in-character by chosen personas with Web Speech API audio synthesis and visualizer.
- **Feature C: Dynamic Relationship Matrix:** Interactive SVG network topology with temporal era slider and faction tension heatmaps.
- **Feature D: "What-If" Scenario Simulator:** Multi-tier causal ripple simulator (1st, 2nd, and 3rd order systemic consequences).
- **Grounded Lore Oracle:** Grounded canon Q&A citing source documents with confidence ratings.
