# School Management System

A comprehensive school management system built with Next.js 14, designed to streamline administrative tasks, enhance communication, and provide role-based dashboards for teachers, parents, and students.

## Features

### Core Functionality

- **Role-based Authentication**: Secure login for Admin, Teachers, Students, and Parents using Clerk
- **Dashboard Views**: Customized interfaces for different user roles
- **Attendance Management**: Track and manage student attendance records
- **Announcements System**: Create and view school-wide or class-specific announcements
- **Schedule Management**: Interactive calendar views for lessons and events
- **Exam & Assignment Tracking**: Manage exams, assignments, and student results
- **Student Information**: Comprehensive student profiles with grades, classes, and parent details

### User Roles & Permissions

- **Admin**: Full system access, user management, system configuration
- **Teacher**: View schedules, manage attendance, create assignments, view student performance
- **Parent**: Monitor child's attendance, view announcements, access child's schedule
- **Student**: View personal schedule, check attendance, access assignments and results

### Technical Features

- **Real-time Updates**: Live data synchronization across the platform
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Data Visualization**: Charts and analytics using Recharts

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **Authentication**: Clerk
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel (recommended)

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js 18.x or later
- npm
- MySQL 8.0

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd schoolmanagement-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/school_management"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Note: After creating users in Clerk, set their role in public metadata: roles are admin, teacher, student and parent
   #  example:{
   #   "role": "admin"
   # }

   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Database Setup

1. **Create MySQL Database**

   ```sql
   CREATE DATABASE school_management;
   ```

2. **Run Database Migrations**

   ```bash
   npm run db:migrate
   ```

3. **Generate Prisma Client**

   ```bash
   npm run db:generate
   ```

4. **Seed the Database** (Optional)
   ```bash
   npm run seed
   ```

## Running the Application

1. **Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database
- `npm run db:pull` - Pull database schema
- `npm run db:push` - Push schema changes
- `npm run seed` - Seed database with sample data

## Project Structure

```
schoolmanagement-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── scripts/
│   └── seed.ts               # Database seeding script
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── api/             # API routes
│   │   └── globals.css      # Global styles
│   ├── components/           # Reusable React components
│   ├── generated/            # Generated Prisma client
│   └── lib/                  # Utility functions and configurations
├── .env.local                # Environment variables (create this)
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Database Schema

The application uses the following main entities:

- **Users**: Admin, Teacher, Student, Parent
- **Academic**: Subject, Lesson, Class, Grade
- **Assessment**: Exam, Assignment, Result
- **Tracking**: Attendance, Announcement, Event

---

Built with using Next.js,typescript, Tailwind CSS and modern web technologies.
