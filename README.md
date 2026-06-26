# 🌳 Family Tree

Welcome to **Family Tree** — a little corner of the internet built for preserving what matters most: the people who came before us, the ones beside us, and the ones yet to come. 💛

---

## 📖 The Story Behind This Project

Every family has a story. Names whispered at dinner tables, old photos tucked in dusty albums, birthplaces no one quite remembers anymore. My grandmother knew them all — but memories fade, relatives scatter across cities and countries, and one day you realize that the thread connecting you to your roots is thinner than you thought.

This project started with a simple question: **what if the whole family could build the tree together?**

Not just one person spending hours on a genealogy website, but everyone — cousins adding their branch, aunts uploading old photos, uncles correcting the spelling of a great-grandfather's name. A living document, not a frozen archive.

So here it is. A place where your family's history gets written collectively, one person at a time. 🌿

---

## ✨ What It Does

* 🌲 **Interactive tree view** — explore your family visually across generations, zoom in, click on anyone to see their story
* 👤 **Rich profiles** — name, maiden name, birth date & place, biography, photo, relationships
* 🔗 **Bidirectional relationships** — link parents, spouses, and children; the tree updates automatically
* 📸 **Photo uploads** — each person gets a face, stored safely on Cloudinary
* 🔐 **Invite system** — generate a 7-day link and send it to a relative; they join and start contributing
* 🔎 **Search** — find anyone in the tree instantly by name
* 🎭 **Roles** — admins manage the tree, editors enrich it, viewers explore it

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router) · React · TypeScript |
| Styling | Tailwind CSS · shadcn/ui (Base UI) |
| Backend | Express · TypeScript |
| Database | MongoDB · Mongoose |
| Photos | Cloudinary |
| Auth | JWT · bcryptjs |
| Tree viz | react-d3-tree |

---

## 🗂️ Project Structure

```
family-tree/
├── client/          # Next.js frontend (port 3030)
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Landing page
│       │   ├── auth/login/           # Sign in
│       │   ├── auth/register/        # Create account
│       │   ├── tree/                 # Interactive tree view
│       │   ├── people/               # Member list + search
│       │   ├── people/[id]/          # Person detail
│       │   ├── people/[id]/edit/     # Edit person
│       │   ├── people/new/           # Add person
│       │   └── admin/invite/         # Generate invite links
│       ├── components/
│       │   ├── layout/Navbar.tsx
│       │   └── person/               # PersonCard · PersonForm
│       ├── lib/
│       │   ├── api.ts                # API client
│       │   └── auth-context.tsx      # Auth state
│       └── types/index.ts
│
└── server/          # Express API (port 3035)
    └── src/
        ├── index.ts
        ├── config/                   # DB · Cloudinary
        ├── models/                   # Person · User
        ├── controllers/              # auth · person
        ├── routes/                   # auth · person
        └── middleware/auth.ts        # JWT protect · role guard
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com) account (free tier is plenty)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd family-tree

cd server && npm install
cd ../client && npm install
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=3035
MONGODB_URI=mongodb://localhost:27017/family-tree
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:3030
```

### 3. Configure the client

```bash
cd client
cp .env.local.example .env.local
```

Edit `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3035/api
```

### 4. Run

Open two terminals:

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Then open [http://localhost:3030](http://localhost:3030) and start building. 🌱

---

## 🎬 First Steps

1. **Register** at `/auth/register` — the very first account automatically becomes admin.
2. **Add yourself** and your closest family members at `/people/new`.
3. **Invite relatives** via the avatar menu → *Invite family member* — copy the link and send it over WhatsApp, email, wherever.
4. **Watch the tree grow** as everyone contributes their branch.

---

## 🎭 Who Can Do What

| Role | Powers |
|---|---|
| 👑 **Admin** | Add, edit, delete anyone · invite new members |
| ✏️ **Editor** | Add and edit people · upload photos |
| 👁️ **Viewer** | Explore the tree and profiles (read-only) |

---

## 🔌 API Overview

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/invite          # admin only
POST   /api/auth/accept-invite

GET    /api/people               # all members
GET    /api/people/search?q=     # full-text search
GET    /api/people/:id
POST   /api/people               # editor+, supports photo upload
PATCH  /api/people/:id           # editor+
DELETE /api/people/:id           # admin only

GET    /api/health
```

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start in development mode with hot reload |
| `npm run build` | Production build |
| `npm start` | Start the production build |

---

## 🤝 Joining the Tree

This is a private family project — no public sign-ups. To join, ask whoever manages your family's tree to send you an invite link. It takes 30 seconds to set up and a lifetime to enjoy. 🌳

---

*Built with love, JavaScript, and the quiet hope that one day even the most tech-averse uncle will add his photo.* 💛
