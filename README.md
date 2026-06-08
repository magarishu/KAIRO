<div align="center">
  <img src="/public/logo.jpg" alt="KAIRO Banner" width="1280" height="auto" />

  # KAIRO
  
  **Institutional-grade cloud trade copier built for prop firm traders, fund managers, and retail traders.**

  *Cloud Trade Copier Protocol • MetaTrader • Futures • Risk Engine*
</div>

---

Kairo enables lightning-fast trade replication across multiple broker accounts while enforcing advanced risk controls and providing real-time analytics.

## Features

- **Multi-account trade replication**: Sync trades across unlimited MetaTrader 4 and 5 accounts instantly.
- **Real-time trade synchronization**: Sub-millisecond latency for precise execution.
- **Institutional risk management**: Enforce strict parameters across all connected accounts.
- **Daily loss limits**: Automatically halt trading to protect capital.
- **Weekly profit targets**: Secure gains when objectives are met.
- **Trailing drawdown protection**: Institutional-grade risk gates.
- **Real-time account analytics**: Telemetry and execution metrics.
- **Subscription billing**: Automated SaaS billing with Razorpay.
- **Modern responsive dashboard**: Beautiful, intuitive, and highly functional.

## Tech Stack

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Next.js Server Actions
- Prisma ORM
- PostgreSQL
- Supabase

**Authentication:**
- Clerk

**Trading Infrastructure:**
- MetaApi

**Payments:**
- Razorpay

**Deployment:**
- Vercel

## Architecture

```
User → Kairo Dashboard → Backend Services → MetaApi → Broker Accounts
```

## Screenshots

*(See the `docs/` folder for UI mockups and architectural diagrams)*

## Getting Started

1. Clone repository
2. Install dependencies (`npm install`)
3. Configure environment variables (see `.env.example`)
4. Run database migrations (`npx prisma db push`)
5. Start development server (`npm run dev`)

## Security

Please report security vulnerabilities responsibly. See [SECURITY.md](SECURITY.md) for our disclosure policy.

## Roadmap

- Trade execution engine
- Real-time telemetry
- Futures broker integrations
- Advanced analytics
- Mobile application

## License

Proprietary Software © Kairo. All Rights Reserved.
