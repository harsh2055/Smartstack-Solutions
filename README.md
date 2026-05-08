# Smartstack Solutions 🚀

**Enterprise AI & Automation Platform** — A production-grade SaaS framework built with Next.js, featuring dynamic intelligence layers, precision analytics, and autonomous business workflows.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/harsh2055/Smartstack-Solutions)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Framer Motion |
| **Database** | PostgreSQL (Supabase/Neon) |
| **ORM** | Prisma 6 |
| **Auth** | NextAuth.js (Credentials + Google OAuth) |
| **Email** | Nodemailer (SMTP) |

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/harsh2055/Smartstack-Solutions.git
cd Smartstack-Solutions
npm install
```

### 2. Database Setup
```bash
# Push schema to your database
npx prisma db push
```

### 3. Run Development
```bash
npm run dev
```

---

## 🌍 Environment Variables

Create a `.env.local` file with the following required parameters:

```env
# Database (Supabase recommended)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth Configuration
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"

# Email Configuration (SMTP - for password recovery & leads)
EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
EMAIL_FROM="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
```

---

## 🔐 Advanced Security & Admin Roles

### 1. Elevating a User to Admin
1. Sign up normally via the `/signup` page.
2. Open your database (Supabase/Prisma Studio).
3. Find your user in the `User` table.
4. Change the `role` field from `USER` to `ADMIN`.
5. Re-login to access the **Control Center**.

### 2. Route Protection
- **Client Side**: `middleware.ts` automatically redirects unauthorized users to `/unauthorized`.
- **Server Side**: Admin API routes validate roles via `getServerSession`.
- **UI**: Admin-only links are automatically hidden from regular users in the `Navbar`.

---

## 🚀 Key Premium Features

- **Control Center**: A high-fidelity admin dashboard featuring CSS-based analytics, real-time user activity, and data-driven management.
- **Dynamic Pricing**: Dual-tier (Monthly/Yearly) pricing system manageable via the admin panel.
- **Password Recovery**: Secure SMTP-based "Forgot Password" flow with token expiration.
- **Lead Capture**: Integrated contact form with automated email notifications for administrators.
- **WhatsApp Integration**: Floating action button with interactive "ping" notification for high conversion.
- **Mobile Optimized**: Fluid typography using `clamp()` and responsive component architecture.

---

## 📄 License

MIT © Smartstack Solutions
