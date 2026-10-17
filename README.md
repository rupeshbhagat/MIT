# 🎓 MIT ADT CampusGram — Social & Student Hub

An exclusive, Instagram-style mobile campus network and academic portal built for the students of **MIT Art, Design and Technology University, Pune** ([mituniversity.ac.in](https://mituniversity.ac.in/)), located at the historic Rajbaug Campus, Loni Kalbhor, Pune.

---

## 🌟 Key Features

### 📸 1. Instagram-Style Social Feed & 12 Live Photo Filters
- **Instagram-Style Feed**: Double-tap heart burst animation, threaded comments, bookmarking, location tags (*Rajbaug Central Dome, Swami Vivekananda Block, IOD Design Studio, MakerSpace Block B*).
- **12 Live Photo Filters**: *Clarendon, Juno, Lark, Valencia, Gingham, Cyberpunk, Documentary B&W, Heritage Sepia, Lo-Fi, Dreamy Slumber, Golden Hour Warmth, and Normal*.
- **Filter Studio Modal**: Real-time thumbnail previews of every filter directly on the photo, fine-tuning sliders (*Brightness, Contrast, Saturation, Warmth*), university department watermarks, and campus stickers (*🎓 MIT ADT Pune, 🌅 Dome Sunset, 💻 HackMIT 2026, ✨ Design Wizard, 🤖 Robocon Lead*).
- **Stories Carousel**: Glowing university maroon/gold rings with fullscreen story player, progress bars, quick emoji reactions, and reply fields.

### 🛡️ 2. University Email Verification & Digital Student ID Card
- **Exclusive Access**: Restricts signup/login to official university email addresses (`@mituniversity.ac.in`, `@mitwpu.edu.in`).
- **Digital Student Identity Card**: Official university crest, verified hologram badge, student photo, PRN (Permanent Registration Number), academic validity, and scannable QR code.
- **Fast 1-Click Demo Personas**: Instantly test personas across different university schools (*Computing, Design, Robotics, Bioengineering, Management*).

### 🤝 3. Cross-Department Student Connect & Study Groups
- **Inter-School Matchmaker**: Connect computer science engineers with IOD designers and management strategists for Hackathons, Capstone projects, and Startups.
- **Study Groups**: Browse multidisciplinary study squads, join groups, schedule study sessions, and collaborate via in-app group chats.

### 🏆 4. Academic Portal & Cumulative GPA Progression Tracker
- **Cumulative GPA Curve Chart**: Dynamic interactive SVG graph displaying semester-by-semester trajectory alongside the **First Class with Distinction benchmark (8.5/10)**.
- **Semester Grade Cards**: Complete course grades breakdown (*Course Code, Course Name, Credits, Letter Grade O/A+/A, Grade Points, and SGPA*).
- **Target GPA Simulator**: Enter your desired graduation honors CGPA (e.g. 9.20) to compute the required upcoming semester SGPA.
- **Future Course Calculator**: Test hypothetical future grades to view their impact on overall CGPA.

### 🔔 5. Campus Events & Live Countdown
- Announcements for flagship university events: **PERSONA FEST 2026**, **HackMIT ADT 36-hr Hackathon**, and **IOD Graduate Degree Show**.
- Real-time countdown timer to the upcoming festival.
- Instant RSVP with digital gate passes.

### 📱 6. Dual Mobile View (iOS & Android)
- **iPhone 16 Pro Frame**: Dynamic Island notification pill, iOS status bar, bottom home swipe indicator.
- **Google Pixel / Android Frame**: Center camera punch-hole, Android status bar, and gesture navigation.
- **Responsive Fullscreen**: Adapts seamlessly to standard browser screens and tablets.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** (comes with Node.js) or **bun** / **yarn** / **pnpm**

### Step-by-Step Instructions

1. **Clone or Navigate to the Project Directory**:
   ```bash
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(Firebase credentials are already configured in `firebase-applet-config.json`)*.

4. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```
   The application will start immediately at:
   ```
   http://localhost:3000
   ```

5. **Open in Your Browser**:
   Visit `http://localhost:3000` in Google Chrome, Safari, Firefox, or Edge. You can click the device switcher at the top to toggle between **iOS iPhone**, **Android Pixel**, or **Fullscreen Web**.

---

## 🛠️ Build for Production

To create an optimized production build:
```bash
npm run build
```

To preview the built production app locally:
```bash
npm run preview
```

To run typecheck and verify linting:
```bash
npm run lint
```

---

## 🗂️ Project Architecture

```
├── firebase-applet-config.json # Firebase connection credentials
├── firebase-blueprint.json    # Firestore Intermediate Schema (IR)
├── firestore.rules            # Hardened Zero-Trust Firestore Security Rules
├── index.html                 # HTML Entry point with university branding
├── package.json               # Node packages and scripts
├── src/
│   ├── App.tsx                # Main App component wiring all views
│   ├── index.css              # Global styles, Tailwind imports, CSS photo filters
│   ├── main.tsx               # React 19 root bootstrap
│   ├── components/
│   │   ├── AcademicsView.tsx         # Semester grade cards & GPA trend chart
│   │   ├── CampusVibePoll.tsx        # Fun daily campus poll & cheer button
│   │   ├── DeviceFrame.tsx           # iOS iPhone & Android Pixel mobile shells
│   │   ├── DirectMessagesModal.tsx   # Real-time student chat
│   │   ├── EmailVerificationModal.tsx# University email OTP & Digital ID card
│   │   ├── EventsView.tsx            # Campus fests, countdown & RSVP passes
│   │   ├── ExploreConnectView.tsx    # Cross-department student discovery
│   │   ├── FeedPost.tsx              # Instagram card with live filters & reactions
│   │   ├── FilterStudioModal.tsx     # 12 photo filters, sliders & campus stickers
│   │   ├── Header.tsx                # Logo, verified pill, notifications, switcher
│   │   ├── LoginView.tsx             # University email login & 1-click personas
│   │   ├── Logo.tsx                  # MIT ADT Vishwashanti Dome SVG crest
│   │   ├── Navbar.tsx                # Mobile bottom navigation bar
│   │   ├── ProfileView.tsx           # Student profile, posts grid & saved posts
│   │   ├── StoriesBar.tsx            # Instagram stories tray & fullscreen player
│   │   └── StudyGroupsView.tsx       # Cross-dept study squads & group chat
│   ├── data/
│   │   └── mockData.ts        # Authentic student, course, and event records
│   ├── firebase/
│   │   └── config.ts          # Firebase SDK initialization & error handlers
│   ├── types/
│   │   └── index.ts           # Complete TypeScript domain interfaces
│   └── utils/
│       └── audio.ts           # Web Audio API sound synthesizer
```

---

## 🎨 Visual Identity & Colors

Based on **MIT Art, Design and Technology University, Pune** ([mituniversity.ac.in](https://mituniversity.ac.in/)):
- **Primary Maroon**: `#8B0000` / `#9B111E`
- **Deep Navy**: `#0B2545`
- **Amber Gold**: `#F59E0B`
- **Emblem**: World Peace Vishwashanti Dome with educational pillars and torch of knowledge.

---

## 📄 License
Apache-2.0. Built for MIT ADT University Campus Community.
