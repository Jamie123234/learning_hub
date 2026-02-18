<div align="center">

<div align="center"><img src="favicon.ico" width="48" height="48" alt="LearnHub"></div>

# LearnHub

**A beautiful, authenticated video course browser — powered by a single HTML file + Supabase.**

[![HTML](https://img.shields.io/badge/HTML-Single%20File-E34F26?style=flat-square&logo=html5&logoColor=white)](https://github.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![CSS](https://img.shields.io/badge/CSS-Glassmorphism-1572B6?style=flat-square&logo=css3&logoColor=white)](https://github.com)
[![JavaScript](https://img.shields.io/badge/JS-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com)
[![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[**Live Demo →**](#) &nbsp;·&nbsp; [Report Bug](issues) &nbsp;·&nbsp; [Request Feature](issues)

</div>

---

## ✨ Features

### 🎓 Courses
- **37 Curated Courses** — hand-picked YouTube courses across web dev, AI/ML, systems, databases, cybersecurity, game dev, and more
- **Instant Search** — filters by title, description, and category in real-time
- **Colour-coded Categories** — each category has a distinct colour applied to sidebar buttons and card tags
- **Collapsible Sidebar** — category filter collapses on mobile into a pill row

### 🔐 Authentication
- **Email & Password Sign-in** — users create an account with email + password; no magic links or external redirects
- **Create Account flow** — sign up with email, password, and confirmation field; includes a live password strength meter
- **Powered by Supabase** — secure, production-grade auth with JWT sessions persisted to `localStorage`
- **Session persistence** — users stay signed in across page reloads and browser restarts; sessions auto-refresh silently for up to 7 days
- **Works on GitHub Pages** — fully static; Supabase handles all backend logic via browser API calls

> **Note:** By default Supabase requires email confirmation on new accounts. To allow instant sign-in without any emails, go to **Authentication → Providers → Email** in your Supabase dashboard and disable **"Confirm email"**.

### 📊 Progress Tracking
- **Per-course status** — mark any course as *In Progress* or *Completed* directly from the card or the video player modal
- **Toggle off** — clicking the same status again removes it
- **Account panel** — slides in from the right with a full progress dashboard including:
  - Overall completion percentage ring
  - Stats: completed, in-progress, and total courses
  - Progress bars broken down by category
  - Lists of currently watching and completed courses
- **Syncs across devices** — progress is stored in Supabase, not the browser
- **Row Level Security** — each user's data is fully private

### 🎨 Design
- **Custom Favicon** — uses `favicon.ico` for the browser tab and all logo placements in the nav and auth modal; logo background is dark navy in dark mode and white in light mode so the purple icon is always clearly visible
- **Split-panel Auth Modal** — atmospheric left panel with animated orbital rings, floating particles, and feature callouts; clean right panel with floating label inputs and a password strength meter
- **Light / Dark Mode** — smooth animated theme toggle
- **Glassmorphism UI** — frosted glass panels, gradient borders, layered depth, grain overlay
- **Smooth Animations** — staggered card entrances, hover lift/scale, thumbnail zoom, spring-bounce modals
- **Responsive** — adaptive layout from mobile to ultrawide; auth modal collapses to single-column on small screens
- **Typography** — Syne (display/headings) + Plus Jakarta Sans (body); open letterforms with comfortable line height
- **Smart Thumbnails** — `maxresdefault` → `hqdefault` fallback chain with a styled emoji placeholder if both fail

---

## 🏗️ Architecture

```
GitHub Pages                    Supabase (free tier)
─────────────────               ─────────────────────────
learnhub.html                   auth.users  (built-in)
  │                               │
  ├── Supabase JS SDK  ──────────▶ course_progress table
  │     auth.signUp()                 user_id  (FK → auth.users)
  │     auth.signInWithPassword()     video_id (TEXT)
  │     auth.getSession()             status   ('in-progress' | 'completed')
  │     auth.onAuthStateChange()      updated_at
  │     from('course_progress')
  │       .select / .upsert / .delete
  │
  └── Everything else is local (no server needed)
```

Row Level Security (RLS) ensures users can only ever read and write their own rows.
The Supabase anon key is safe to expose — it grants no elevated access.

---

## 🚀 Setup Guide

### Prerequisites
- A free [Supabase](https://supabase.com) account
- A GitHub repository with Pages enabled

---

### Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `learnhub`, choose a region close to you, set a database password
3. Wait ~2 minutes for the project to spin up
4. Go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (long JWT string)

---

### Step 2 — Run the database setup SQL

1. In your Supabase project go to **SQL Editor → New query**
2. Paste the contents of [`supabase_setup.sql`](supabase_setup.sql) and click **Run**

This creates the `course_progress` table and all required Row Level Security policies.

```sql
CREATE TABLE course_progress (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id    TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('in-progress', 'completed')),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, video_id)
);
```

---

### Step 3 — Disable email confirmation (recommended)

By default Supabase sends a confirmation email to every new sign-up, and the free tier has a limit of 3 emails per hour. For personal or development use, disable this:

1. In Supabase go to **Authentication → Providers → Email**
2. Toggle off **"Confirm email"**
3. Click **Save**

New accounts will be immediately active with no email required. If you prefer to keep confirmation on (e.g. for a production app), configure a custom SMTP provider under **Authentication → SMTP Settings** using a service like Resend or SendGrid.

---

### Step 4 — Deploy to GitHub Pages

1. Push `learnhub.html` and `favicon.ico` to your repository (root or `/docs` folder)
2. In your repo go to **Settings → Pages**
3. Set the source to your branch and folder, then save
4. Your site will be live at `https://yourusername.github.io/reponame/`

> The Supabase URL and anon key are already embedded in `learnhub.html`. If you fork this repo, replace them with your own project's values at the top of the `<script>` tag.

---

## 👤 User Flow

```
1. User visits the site
2. Clicks "Sign In" in the nav
3. Auth modal opens — split panel with branding on the left, form on the right
4. New user: switches to "Create Account", fills in email + password
5. Returning user: enters email + password on "Sign In" tab
6. On success, modal closes and nav button updates to show their initial + "My Account"
7. Session is saved to localStorage — stays signed in across page reloads
8. User browses courses, marks them In Progress or Completed from cards or the video modal
9. Opens "My Account" to view their full progress dashboard
10. Progress syncs automatically across all their devices
```

---

## ➕ Adding Courses

Open `learnhub.html` and add an entry to the `videos` array in the `<script>` tag:

```js
{
  id: 'YOUTUBE_VIDEO_ID',       // e.g. 'dQw4w9WgXcQ'
  title: 'My Course Title',
  category: 'Web Development',  // existing or new category
  summary: 'A short description of what this course covers.',
  icon: '🎯'                    // any emoji
}
```

New categories automatically appear in the sidebar with a colour assigned from the palette. To customise the colour, add an entry to the `catColors` object in the same file.

---

## 📋 Course Categories

| Category | Colour | Courses |
|---|---|---|
| Web Development | 🩵 Cyan | TypeScript, Next.js 14, Angular, Blazor, Bootstrap 5, CSS Grid |
| Programming | 🟡 Amber | C++, Rust, Go, Modern Techniques |
| Computer Science | 🟣 Violet | Algorithms, Data Structures, Discrete Math, Harvard CS50 |
| Data Science | 🟢 Emerald | ML Roadmap, Neural Networks, Python for Data Science |
| DevOps | 🟠 Orange | Docker & Kubernetes, Cloud Computing, RHCSA |
| Databases | 🔵 Blue | PostgreSQL, Redis |
| Mobile Development | 🩷 Pink | SwiftUI, Flutter, React Native & Expo |
| Software Engineering | 🔷 Indigo | TDD, System Design, Advanced Concepts |
| Cybersecurity | 🔴 Red | Network Security, Ethical Hacking |
| Backend Development | 🩵 Teal | Spring Boot & PostgreSQL API |
| Game Development | 🟣 Purple | Unreal Engine 5 C++ |
| Science | 🩵 Sky | General Chemistry |
| Productivity | 🟢 Lime | Clippy for macOS & AI Workflows |

---

## 📂 Project Structure

```
learnhub/
├── learnhub.html        # The entire app — HTML + CSS + JS in one file
├── favicon.ico          # Site favicon — used in browser tab, nav logo, and auth modal
├── supabase_setup.sql   # Run once in Supabase SQL Editor to set up the DB
└── README.md
```

---

## 🛠️ Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge 88+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Mobile (iOS / Android) | ✅ Full |

> Requires `backdrop-filter` support for glassmorphism. Solid fallback backgrounds are applied automatically where unsupported.

---

## 📄 License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ☕ and too many browser tabs

</div>
