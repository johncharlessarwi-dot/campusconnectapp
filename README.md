# CampusConnect 🎓

The elite Kenyan university super app for social buzz, safety-verified off-campus housing discovery, student marketplace, course groups, and a smart AI advisor.

CampusConnect is designed as a highly scalable, production-grade web application built using **React (with TypeScript & Tailwind CSS)**, a robust custom **Node/Express backend server with Gemini AI integration**, and fully configured for **Supabase Cloud PostgreSQL Database & Authentication** (supporting direct migration and Vercel deployment).

---

## 🚀 Key Features

- **🗺️ Campus Map & Navigation**: Uses standard Leaflet.js with high-contrast OpenStreetMap and Esri Satellite imagery, incorporating the OpenRouteService (ORS) API for real-time pedestrian/walking route distance and time estimation (including custom university gates like Maseno Siriba Gate).
- **🗣️ Comrade Buzz Feed (Social)**: A secure, server-rendered community microblog feed where students can view posts, leave comments, like articles, and post anonymously or with real profiles.
- **🏠 House Hunt (Hostel Discovery)**: Multi-filter hostel explorer with precise map markers, real landlord listings, reviews, amenities, pricing trackers, and offline storage failovers.
- **🛍️ Student Marketplace**: Product marketplace allowing comrades to list pre-loved products, filter by category and university campus, rate seller reliability (Trust Scores), and start instant chats.
- **📅 Campus Events Calendar**: Integrated event manager for academic sessions, social gigs, career fairs, and hackathons, complete with RSVP status and dynamic calendar bookmarks.
- **🤖 Comrade Companion (AI Advisor)**: Server-side context-aware AI chat integrated with Gemini API via the `@google/genai` TypeScript SDK, providing offline hacks, transit routes, budget advisors, and course survival tips.
- **💬 Direct Messaging**: Realtime instant chat channels between peers with active session logging, unread notifications, and image upload options.
- **🔒 Hidden Admin Moderation Panel**: Protected dashboard enabling authorized admin accounts to manage active users, evaluate reports, verify landlords, and inspect systemic analytics.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite-powered, TSX), Tailwind CSS, Lucide Icons, Framer Motion
- **Backend / Proxy**: Express, TypeScript, tsx, esbuild
- **Database**: Supabase PostgreSQL with fully configured Row Level Security (RLS) policies
- **Auth**: Supabase Authentication (OAuth / Google, Email/Password)
- **AI Engine**: `@google/genai` (Gemini-2.5-flash)

---

## 🗄️ Database Schema & RLS

All tables are defined in `/supabase/migrations/20260625000000_init_schema.sql` with strict foreign key constraints, default timestamps, indices, and Row Level Security policies.

### Main Tables:
- `universities`: Predefined universities with geographic center-points and verified domain lists.
- `users`: Core profile registration, linked with Supabase's `auth.users` schema.
- `posts` / `comments` / `likes`: Microblogging system.
- `hostels` / `hostel_images` / `hostel_reviews` / `saved_hostels`: Off-campus hostel housing directory.
- `marketplace_listings` / `saved_items`: Peer-to-peer student storefront.
- `conversations` / `direct_messages`: Interactive realtime instant messaging.
- `events` / `event_attendees` / `saved_events`: Campus and local student event calendars.
- `notifications`: Activity indicators.
- `reports`: Content flagging for admins.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Gemini API credentials
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# OpenRouteService API (optional for mapping/routing)
VITE_ORS_API_KEY="YOUR_ORS_API_KEY"

# Supabase Credentials (for live cloud database)
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

---

## 💻 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database Migrations
Deploy the database schema to your Supabase instance:
- Go to the **Supabase Dashboard** -> **SQL Editor**.
- Copy the contents of `supabase/migrations/20260625000000_init_schema.sql` and run it.
- To pre-populate initial university data, copy the contents of `supabase/seed.sql` and run it.

### 3. Run Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

---

## 🚀 Deploying to Vercel

CampusConnect can be deployed on Vercel as a full-stack Node + Vite or as a single-page application.

1. **Import Repository**: Connect your repository to Vercel.
2. **Environment Variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as production environment variables.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
