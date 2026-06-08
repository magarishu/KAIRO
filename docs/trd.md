# Technical Requirements Document (TRD)

## Architecture Overview
Kairo utilizes a serverless, highly-scalable architecture leveraging Next.js App Router for both the frontend and API layer.

## Technology Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: PostgreSQL (managed by Supabase)
- **ORM**: Prisma
- **Authentication**: Clerk
- **Trading API**: MetaApi Cloud SDK
- **Styling**: Tailwind CSS & Framer Motion

## Infrastructure Requirements
- **Hosting**: Vercel
- **Database**: Supabase Pro Tier (required for 24/7 uptime)
- **Security**: Environment variables managed via Vercel Secrets.
