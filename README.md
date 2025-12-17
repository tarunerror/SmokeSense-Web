# SmokeSense

A supportive, judgment-free smoking awareness and reduction web application.

## 🌿 Overview

SmokeSense helps users understand, control, and optionally reduce their smoking behavior through three optional phases:

- **Awareness**: Track your habits without pressure
- **Control**: Take charge of your choices
- **Reduction**: Reduce at your own pace

## ✨ Features

- 📱 **One-click logging** - Quick cigarette tracking with optional mood/activity/location
- 📊 **Smart analytics** - Daily/weekly trends, time-of-day patterns, trigger analysis
- 💚 **Delay-not-deny** - Gentle waiting periods with breathing exercises
- 💰 **Financial tracking** - See spending impact with relatable alternatives
- 🔒 **Privacy first** - App disguise, PIN protection, user data isolation
- ⚡ **Real-time sync** - Updates across devices instantly
- 📴 **Offline support** - Log even without connection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Setup

1. **Clone and install**
   ```bash
   cd smoke-s-web
   npm install
   ```

2. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be ready

3. **Run database migration**
   - In Supabase dashboard, go to SQL Editor
   - Copy contents from `supabase/migrations/001_initial_schema.sql`
   - Run the SQL to create tables and enable RLS

4. **Configure environment**
   - Create `.env.local` in project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - Find these values in Supabase: Settings > API

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Login/Signup
│   ├── dashboard/          # Main dashboard
│   ├── analytics/          # Charts & insights
│   └── settings/           # User preferences
├── components/
│   ├── dashboard/          # Dashboard widgets
│   ├── logging/            # Log button & forms
│   ├── analytics/          # Charts & visualizations
│   └── wellness/           # Breathing exercises, timers
├── lib/
│   └── supabase/           # Supabase clients
├── stores/                 # Zustand state management
└── types/                  # TypeScript definitions
```

## 🔐 Privacy

- All data encrypted in transit and at rest
- Row-Level Security ensures users only see their own data
- Optional app disguise to show different app name
- No data shared with third parties

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Backend**: Supabase (Auth, Database, Real-time)
- **Styling**: Custom CSS with CSS variables
- **State**: Zustand
- **Charts**: Custom implementations

## 📄 License

MIT - Free to use and modify.

---

**Your journey. Your pace. No judgment.** 💚
