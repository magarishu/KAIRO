# Database Schema

## Core Entities

### User
Managed via Clerk Authentication.

### Subscription
Tracks the user's active billing status via Razorpay.

### Connection
Represents a connected MetaTrader Broker account.
- **id**: String (UUID)
- **userId**: String
- **name**: String (e.g., "Main Fund")
- **brokerName**: String
- **accountId**: String
- **status**: Enum (ONLINE, OFFLINE)
- **equity**: Float
- *Tokens are encrypted and stripped from network payloads.*

### Group
Represents a collection of connections grouped for copy trading.
- **id**: String (UUID)
- **userId**: String
- **name**: String
- **status**: Enum (ACTIVE, INACTIVE)
