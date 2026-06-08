# KAIRO: Project Documentation

This document serves as the central source of truth for the Kairo Trade Copier platform, encompassing product requirements, technical architecture, user flows, UI/UX guidelines, database schema, and the implementation roadmap.

---

## 1. Product Requirements Document (PRD)

### Overview
Kairo is a next-generation, cross-market cloud trade copier protocol designed to bridge the gap between retail platforms and institutional execution. It allows traders to instantaneously mirror trades from a single "Master" account to unlimited "Slave" accounts across various brokers and platforms (Forex and Futures).

### Target Audience
- **Prop Firm Traders**: Managing multiple evaluation or funded accounts simultaneously.
- **Fund Managers**: Distributing trades across a pool of investor accounts.
- **Retail Traders**: Diversifying risk across different brokers.

### Core Features
1. **Multi-Platform Connections**: Securely link MT4, MT5, Tradovate, and Rithmic accounts.
2. **Trade Replication Engine**: Lightning-fast mirroring with customizable lot size multipliers, and toggleable Stop Loss (SL) / Take Profit (TP) copying.
3. **Institutional Risk Manager**: Global and per-account risk constraints (Daily Loss limits, Weekly Profit targets, Trailing Drawdowns) that automatically halt trading to protect capital.
4. **Analytics & Telemetry**: Real-time equity tracking, win-rate analysis, and live system status monitoring.
5. **Subscription Billing**: Tiered access (Free, Pro, Flex) managed via Razorpay.

---

## 2. Technical Requirements Document (TRD)

### Architecture & Tech Stack
- **Framework**: Next.js 14 (App Router) for Server-Side Rendering (SSR), Server Actions, and API routes.
- **Language**: TypeScript (Strict mode).
- **Authentication**: Clerk (Next.js Middleware protected routes).
- **Database**: PostgreSQL hosted on Supabase.
- **ORM**: Prisma (`@prisma/client` and `@prisma/adapter-pg`).
- **State Management**: Zustand (Client-side global state for UI toggles).
- **Styling**: Tailwind CSS (Utility-first), with custom global CSS for strict Light/Dark mode overrides.
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Payment Gateway**: Razorpay.
- **Trading APIs**: MetaApi (for MetaTrader integration).

### Infrastructure
- Deployed on Vercel (or similar Node.js edge environment).
- Database connection pooling managed via Supavisor (`pooler.supabase.com`).

---

## 3. Application Flow

1. **Discovery & Onboarding**:
   - User lands on the marketing homepage viewing telemetry, pricing, and testimonials.
   - Clicks "Sign Up" and is routed through Clerk Authentication.
2. **Dashboard Initialization**:
   - Post-login, user lands on `/dashboard`. The system checks subscription status.
3. **Connecting Accounts**:
   - User navigates to `/connections` -> Clicks "Add Connection".
   - Inputs broker credentials or API tokens (e.g., MetaApi token). The system validates and saves the connection.
4. **Configuring Risk**:
   - User navigates to `/risk` -> Selects a connection.
   - Sets Daily Loss and Max Drawdown limits.
5. **Setting up Copy Trading**:
   - User navigates to `/groups` -> Clicks "Create Group".
   - Selects a "Master" account from their connections.
   - Adds multiple "Slave" accounts, configuring lot size multipliers (e.g., 0.5x, 2.0x) for each.
6. **Monitoring**:
   - User uses `/analytics` to view aggregated PnL and equity curves.

---

## 4. UI/UX Brief

### Design Philosophy
"Cyber-Institutional." The interface must feel highly professional, technical, and premium—akin to proprietary trading terminal software (like Bloomberg Terminal or TradingView). 

### Visual Identity
- **Dark Mode (Primary)**: Deep blacks (`#050505`), stark whites for high contrast, and subtle neon emerald/purple accents.
- **Light Mode (Secondary)**: Clean whites (`#ffffff`) and soft grays (`#f3f4f6`), maintaining strict visibility of critical metrics.
- **Typography**: 
  - *Headings*: Poppins (Bold/Black) for impact.
  - *Body*: Inter for readability.
  - *Metrics/Data*: Roboto Mono for tabular data and telemetry.

### Key UX Principles
- **Micro-animations**: Use Framer Motion for smooth modal entrances, hover states, and data population.
- **Data Density**: High data density but clearly separated using subtle borders (`border-white/5`) and glassmorphism.
- **Non-blocking UI**: Settings and theme toggles are tucked away in a collapsible sidebar.

---

## 5. Backend Schema

The database is managed via Prisma. Below is the simplified relational structure:

* **User**: 
  - Fields: `id` (Clerk ID), `email`, `subscriptionTier`, `razorpayCustomerId`.
  - Relations: Has many `Connections` and `Groups`.

* **Connection**: 
  - Fields: `broker`, `accountId`, `metaApiAccountId`, `status`, `equity`.
  - Relations: Belongs to `User`. Has one `RiskRule`.

* **RiskRule**: 
  - Fields: `wpLimit` (Weekly Profit), `dlLimit` (Daily Loss), `trailingDd`.
  - Relations: Belongs to `Connection`.

* **Group**: 
  - Fields: `name`, `accountId` (Master Account ID), `status`.
  - Relations: Belongs to `User`. Has many `SlaveAccounts`.

* **SlaveAccount**: 
  - Fields: `accountId`, `multiplier`, `copySl`, `copyTp`, `status`.
  - Relations: Belongs to `Group`.

---

## 6. Implementation Plan & Roadmap

### Phase 1: Foundation (Completed)
- [x] Next.js App Router setup.
- [x] Tailwind CSS and custom theme system integration.
- [x] Clerk Authentication middleware implementation.
- [x] Prisma schema design and Supabase database connection.

### Phase 2: Frontend Modules (Completed)
- [x] High-conversion Landing Page.
- [x] Dashboard Layout with collapsible Sidebar.
- [x] Connections management UI.
- [x] Groups and Master/Slave configuration UI.
- [x] Risk Manager UI.

### Phase 3: Trading API Integration (Current Phase)
- [ ] Implement Server Actions to create MetaApi accounts.
- [ ] Build background worker/webhook listener to intercept Master trades.
- [ ] Execute replication logic based on Slave account multipliers.
- [ ] Enforce RiskRule limits (disconnect API if limits breached).

### Phase 4: Billing & Subscriptions
- [ ] Integrate Razorpay Checkout.
- [ ] Create Webhook endpoints to listen for subscription successes/failures.
- [ ] Update `User.subscriptionStatus` in Prisma based on webhooks.

### Phase 5: Analytics & Polish
- [ ] Connect `/analytics` charts to live historical trade data.
- [ ] Implement Websockets for real-time Dashboard telemetry.
- [ ] Final end-to-end testing across Light and Dark modes.
