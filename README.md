# 🚀 Romen Halder — Animated Portfolio v2

A production-ready, highly interactive personal portfolio featuring **Two Advanced Three.js Environments**, **Framer Motion animations**, **Project Screenshot Uploads**, and a **100% JSON-driven content architecture**.

## ✨ What's New in v2
- 🌊 **Ocean Day Theme (Light):** Bright white/sky-blue aesthetic, animated wave surface, floating foam/bubbles, and mouse parallax.
- 🌌 **Deep Space Night Theme (Dark):** 3D Earth with procedural continents/clouds, orbiting Moon with craters, low-poly floating astronaut, and shooting stars.
- 📸 **3D Profile Photo Avatar:** A unique 3D component with orbiting rings and particles that displays your photo or a procedural "RH" placeholder. (Place your photo at `src/assets/profile-photo.jpg`).
- 🖼️ **Project Thumbnails & Screenshot Uploads:** Project cards now display a hero thumbnail.An **Admin Mode (PIN protected)** allows direct drag-and-drop uploading of prototype screenshots for each project.
- 🧑‍💻 **Detail Modal:** Comprehensive project modal with tabs for Screenshot Gallery, Features, Tech Deep Dive, and Architecture diagrams.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## 📁 How to Update Your Content

All personal content lives in `/src/data/` — **never touch React components** for content updates:

| File | What to edit |
|------|-------------|
| `src/data/profile.json` | Name, email, phone, bio, social links |
| `src/data/projects.json` | Projects, GitHub URLs, features, tech stack, architecture data |
| `src/data/experience.json` | Work history, bullet points, dates |
| `src/data/achievements.json` | Certifications, awards |
| `src/data/gallery.json` | Photo gallery entries |
| `src/data/skills.json` | Skills and proficiency levels (0–100) |
| `src/data/config.json` | Global settings (Admin PIN) |

---

## 📸 Profile Photo 

Your profile picture displayed in the 3D Hero avatar MUST be placed here:
```
/src/assets/profile-photo.jpg
``` 
If missing, it gracefully degrades to a procedural Three.js `RH` placeholder.

---

## 🖼️ Upload Project Prototype Screenshots

1. Go to the **Projects** section.
2. Click **Admin** on the right side of the filter bar.
3. Enter PIN: **`1234`**.
4. A green **Camera icon** will appear on all cards. Click it.
5. You can now **drag and drop** prototype screenshots for that specific project.
6. The first screenshot will automatically become the card thumbnail.
7. Click **Export JSON** if you wish to download your screenshot map and hardcode it.

---

## 📸 Add Photos to the Gallery

**Option A (Recommended): Use Admin Mode**
1. Scroll to the Gallery section.
2. Click **"Edit Gallery"** (bottom right of gallery heading).
3. Enter PIN: **`1234`** (if not already unlocked).
4. Click **"+ Add Photo"** to upload from your device.
5. Click **"Export JSON"** to save the updated gallery permanently.

**Option B: Manual**
1. Drop your photo into `/public/gallery/your-photo.jpg`.
2. Add an entry to `/src/data/gallery.json`.

---

## 🔐 Change Admin PIN

Open `/src/data/config.json` and change:
```json
{
  "adminPin": "NEW_PIN"
}
```

---

## 📄 Add Your Resume PDF

1. Export your resume as a PDF.
2. Name it exactly `resume.pdf`.
3. Place it at `/public/resume.pdf`.

The **Download Resume** / **Download CV** buttons will automatically serve this file.

---

## 🌐 Deploy to Vercel

```bash
# One command deploy
npx vercel --prod
```

Or connect your GitHub repo on [vercel.com](https://vercel.com) for automatic deploys. Framework preset: **Vite**.

---

## 📬 Contact Form (Formspree)

To enable the contact form backend to send emails directly to you:
1. Sign up free at [formspree.io](https://formspree.io).
2. Create a new form and copy your Formspree endpoint URL.
3. Create `.env.local` in the project root:
```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```
*(Without this variable, the form automatically falls back to opening the user's email client via `mailto:`).*
