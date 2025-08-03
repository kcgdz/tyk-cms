# TYK CMS - High Performance Content Management System

🚀 **Modern, Fast, and Scalable CMS built with Next.js 15**

## Features

- **⚡ High Performance**: Built with Next.js 15, Turbopack, and optimized caching
- **🔐 Secure Authentication**: NextAuth.js with JWT tokens and secure sessions
- **📝 Rich Editor**: TipTap WYSIWYG editor with full customization
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🖼️ Media Management**: Advanced file upload with Sharp image optimization
- **🔍 SEO Optimized**: Built-in SEO tools and meta tag management
- **📊 Admin Dashboard**: Intuitive admin interface with real-time stats
- **🎨 Theme System**: Customizable themes and layouts
- **💾 Database**: PostgreSQL with Prisma ORM for type safety
- **⚡ Fast Cache**: Advanced caching system for optimal performance

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Editor**: TipTap
- **File Upload**: Sharp for image optimization
- **UI Components**: Radix UI, Lucide Icons
- **Validation**: Zod

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Setup project**
   ```bash
   npm run setup
   ```

2. **Configure environment variables**
   
   Update `.env` with your settings:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/tyk_cms"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Upload settings
   UPLOAD_DIR="./public/uploads"
   MAX_FILE_SIZE=10485760
   ```

3. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Database Studio: `npm run db:studio`

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run setup        # Full setup (install + db setup)
npm run production   # Build and start production
```

## Project Structure

```
tyk-cms/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin panel pages
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Homepage
│   ├── components/
│   │   ├── admin/           # Admin components
│   │   ├── editor/          # Rich text editor
│   │   ├── ui/              # Reusable UI components
│   │   └── upload/          # File upload components
│   └── lib/
│       ├── auth.ts          # Authentication config
│       ├── cache.ts         # Caching utilities
│       ├── prisma.ts        # Database client
│       └── seo.ts           # SEO utilities
├── prisma/
│   └── schema.prisma        # Database schema
└── public/
    └── uploads/             # Uploaded media files
```

## Performance Features

- **Next.js 15** with Turbopack for ultra-fast development
- **Image optimization** with Sharp
- **Advanced caching** with unstable_cache
- **SEO optimization** with structured data
- **Security headers** and CSRF protection
- **TypeScript** for type safety
- **Responsive design** with Tailwind CSS

## Database Setup

1. **Install PostgreSQL** and create a database
2. **Update DATABASE_URL** in .env file
3. **Run database setup**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

## License

This project is private and proprietary. All rights reserved.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
