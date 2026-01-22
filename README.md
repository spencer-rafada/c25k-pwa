# C25K PWA

A Progressive Web App for the Couch-to-5K interval training program with optional cloud sync.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase (Optional - Required for Cloud Sync)

If you want users to be able to sign in and sync progress across devices, follow these steps:

#### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up

#### Run Database Migration

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/001_create_workout_completions.sql`
3. Paste and run the migration in the SQL Editor

#### Configure Authentication Providers

**Google OAuth (Primary):**
1. In Supabase dashboard, go to Authentication → Providers
2. Enable Google provider
3. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com):
   - Create a new project or select an existing one
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
4. Paste credentials into Supabase Google provider settings

**Email (Magic Link):**
1. In Supabase dashboard, go to Authentication → Providers
2. Enable Email provider
3. Disable "Confirm email" (magic link handles verification)
4. Customize email template if desired

#### Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - In Supabase dashboard, go to Project Settings → API
   - Copy the project URL and anon/public key

3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

#### Configure Redirect URLs

1. In Supabase dashboard, go to Authentication → URL Configuration
2. Add the callback URLs to allowed redirect URLs:
   - Production: `https://yourdomain.com/auth/callback`
   - Development: `http://localhost:3000/auth/callback`
3. Also add the root URLs for general redirects:
   - Production: `https://yourdomain.com`
   - Development: `http://localhost:3000`

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## PWA Icons

The app requires PNG icons for PWA installation. To generate icons from the SVG:

You can use an online tool like [Favicon Generator](https://realfavicongenerator.net/) or use ImageMagick:

```bash
# Install ImageMagick if needed
brew install imagemagick

# Convert SVG to PNG icons
convert -background none -resize 192x192 public/icons/icon.svg public/icons/icon-192.png
convert -background none -resize 512x512 public/icons/icon.svg public/icons/icon-512.png
```

Or create your own custom icons and save them as:
- `public/icons/icon-192.png` (192x192px)
- `public/icons/icon-512.png` (512x512px)

## Features

### Core Features
- 9-week C25K program with all 27 workouts
- Interval timer with state machine (idle/running/paused/completed)
- Audio cues: beeps for run/walk transitions
- Optional text-to-speech announcements
- Progress bar and interval tracking
- Large, glanceable UI for outdoor use
- Dark theme optimized for visibility
- Wake Lock API to prevent screen dimming

### Progress Tracking
- **Anonymous mode**: Progress stored in localStorage
- **Signed-in mode**: Progress synced to Supabase cloud
- Automatic migration: Local data syncs when you sign in
- Offline queue: Failed syncs retry automatically
- Cross-device sync when authenticated

### Authentication
- Google OAuth (one-tap sign-in)
- Magic link (passwordless email)
- Non-blocking: Use app anonymously, sign in anytime
- Persistent sessions across app launches
- **iOS Magic Link Flow**: When tapping a magic link on iOS, Safari opens with a smart landing page that:
  - Completes authentication
  - Confirms success with clear visual feedback
  - Guides users back to the installed PWA
  - Session automatically available in PWA via shared cookies

### PWA Capabilities
- Installable on iOS/Android
- Works offline with service worker
- Cached workout data and static assets
- Standalone app mode

## Usage

### Anonymous Usage (Default)
1. Open the app
2. Select a workout from the home screen
3. Complete your workout - progress saved locally
4. Continue using indefinitely without signing in

### With Cloud Sync
1. Click "Sign in" when prompted (or in header)
2. Choose Google or email sign-in
3. Your local progress automatically syncs to cloud
4. Progress accessible from any device
5. Sign out anytime - local progress preserved

## Testing on iOS

1. Build and deploy the app to a public URL
2. Open in Safari on iOS
3. Tap the Share button
4. Select "Add to Home Screen"
5. Launch from home screen to test:
   - Standalone mode
   - Audio cues (may need user interaction first)
   - Wake lock functionality
   - PWA installation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa with service workers
- **Auth & Database**: Supabase (PostgreSQL + Auth)
- **Audio**: Web Audio API + SpeechSynthesis
- **Features**: Wake Lock API, localStorage

## Architecture

### Data Flow
```
Anonymous User:
  Complete Workout → localStorage

Authenticated User:
  Complete Workout → Supabase + localStorage (cache)
  App Load → Fetch from Supabase → Hydrate localStorage

Offline (Authenticated):
  Complete Workout → localStorage + Offline Queue
  Network Returns → Process Queue → Sync to Supabase
```

### File Structure
```
/app
  /auth/callback/       - OAuth/magic link callback handler
  /workout/[id]/        - Timer page for specific workout
  /page.tsx             - Home with workout selector
  /layout.tsx           - Root layout with AuthProvider
/components
  /AuthProvider.tsx     - Auth context and session management
  /AuthModal.tsx        - Sign-in modal (Google + magic link)
  /SignInPrompt.tsx     - Non-blocking sign-in prompt
  /AccountMenu.tsx      - User menu when authenticated
  /Timer.tsx            - Timer state machine
  /IntervalDisplay.tsx  - Interval UI display
  /ProgressTracker.tsx  - Workout grid with completion status
/lib
  /supabase/            - Supabase client (browser + server)
  /auth.ts              - Auth helpers and sync logic
  /storage.ts           - localStorage with offline queue
  /workouts.ts          - C25K program data
  /audio.ts             - Audio cues
/supabase/migrations/   - Database schema
```
