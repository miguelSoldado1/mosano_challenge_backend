# Mosano Challenge Backend

A simple TypeScript Express API for user management.

## Setup

```bash
pnpm install
cp .env.example .env
# Edit .env with your MongoDB URI
pnpm run seed
pnpm run dev
```

## API

- `GET /users` - List users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /countries` - List countries

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run seed` - Seed database with countries
