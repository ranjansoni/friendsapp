# Friends Birthday Reminder App

A Next.js application to manage friends' birthdays and send automated reminders.

## Features

- 📋 **Friend Management**: Add, edit, and delete friends with detailed information
- 🎂 **Birthday Tracking**: Track birthdays with optional year (for age calculation)
- 📊 **Dashboard**: View upcoming birthdays in the next 30 days
- 🔍 **Search & Filter**: Easily find friends by name or country
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: MySQL (AWS RDS)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Deployment**: PM2 on Ubuntu server

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ranjansoni/friendsapp.git
cd friendsapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.backup .env.local
```

Then update `.env.local` with your database credentials and other configuration.

4. Push database schema:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3310](http://localhost:3310) in your browser.

## Environment Variables

**IMPORTANT**: Environment variable backups are stored in:
- `.env.backup` - Contains the base environment configuration
- `.env.local.backup` - Contains local/production environment configuration

These backup files are **NOT** committed to Git for security reasons. Keep them safe!

Required environment variables:
- `DATABASE_URL` - MySQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `AUTHORIZED_EMAIL` - Email address allowed to access the app
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_APP_PASSWORD` - Gmail app password
- `TZ` - Timezone (default: America/Los_Angeles)
- `CRON_API_KEY` - API key for cron endpoints

## Deployment

### Production Deployment

The app is deployed at: **https://friends.ranjansoni.com**

To deploy updates:
```bash
./deploy.sh
```

For first-time deployment (includes .env.local):
```bash
./deploy.sh first
```

### Data Migration

To migrate data from local to production:
```bash
./migrate_data.sh
```

## Database Schema

- **Friends**: Store friend information and birthdays
- **Birthday Wishes**: Track birthday wishes sent each year
- **Reminders**: Automated reminder system
- **Users**: User authentication data

## Scripts

- `npm run dev` - Start development server on port 3310
- `npm run build` - Build production bundle
- `npm start` - Start production server on port 3310
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx ts-node scripts/export_data.ts` - Export data to JSON
- `npx tsx scripts/import_data.ts` - Import data from JSON

## License

Private project - All rights reserved

## Author

Ranjan Soni
