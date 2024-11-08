# 中文学习 (Chinese Learning Platform)

An interactive web application for learning Chinese through AI-powered translations and word breakdowns. This platform helps English speakers learn Mandarin Chinese by providing detailed word-by-word translations, pinyin pronunciation, and meaning explanations for each character.

## Key Features

- 🔤 English to Chinese translation with pinyin
- 💡 Detailed word-by-word breakdowns with meanings
- 📚 Personal translation history tracking
- 🎯 Progress tracking for known words
- 🌙 Dark mode support
- 🔐 User authentication and personal progress saving

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Chinese Learning App

A Next.js application for learning Chinese through translations, with word breakdowns and progress tracking.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Once your project is created, go to Project Settings > API to find your:
   - Project URL
   - Project API Key (anon public)

3. In the SQL editor, run the following migrations:

```sql
-- Create users table (if not using default auth.users)
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create translations table
create table if not exists translations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id),
  input_text text not null,
  translated_text text not null,
  pinyin text not null,
  word_breakdown jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create known_words table (optional)
create table if not exists known_words (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id),
  word text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, word)
);
```

### 3. Environment Setup

1. Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:
```
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

NEXTAUTH_SECRET=your-random-secret-key

# Translation API keys
DEEPL_API_KEY=your-deepl-api-key
OPENAI_API_KEY=your-openai-api-key
```

Generate a random secret for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

- User authentication (sign up/sign in)
- English to Chinese translation
- Word breakdown with pinyin and meanings
- Translation history
- Dark mode support

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/             # Utility libraries
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── public/              # Static assets
└── migrations/          # SQL migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
