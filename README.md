# Install Attribution System (MVP)

سیستم داخلی Attribution نصب اپلیکیشن قبضینو با تمرکز روی **first open**.

## Table of Contents
- [Project Overview](#project-overview)
- [MVP Goal](#mvp-goal)
- [Scope](#scope)
- [Tech Stack](#tech-stack)
- [Service URLs](#service-urls)
- [Database](#database)
- [Attribution Rules](#attribution-rules)
- [API Endpoints](#api-endpoints)
- [Quick Start](#quick-start)

## Project Overview
هدف سرویس: مشخص کردن منبع هر نصب اپ (لینک/کمپین/سورس) و ذخیره first open.

## MVP Goal
Flow:
`Install Link Click -> Install Click -> Redirect with install_click_id -> App First Open -> Install Open -> Attribution -> Report`

## Scope
### In Scope
- Create install link
- Save install click + redirect
- Receive first_open/install_open
- Attribution status: `attributed | organic | invalid_click | duplicate`
- Summary reporting API
- Swagger + PostgreSQL schema

### Out of Scope
- Signup/login/payment events
- CPI/CPA/ROAS
- Advanced anti-fraud/retention/multi-touch
- iOS attribution

## Tech Stack
- NestJS (TypeScript)
- Node.js
- PostgreSQL + `pg`
- Swagger
- Docker Compose

## Service URLs
- Base URL: `http://192.168.3.64:3001`
- Swagger: `http://192.168.3.64:3001/docs`
- API Base: `http://192.168.3.64:3001/api/v1`
- Health: `GET /api/v1/health`
- Ready: `GET /api/v1/ready`
- Install click endpoint: `GET /i/:token`

## Database
Main tables:
- `install_links`
- `install_clicks`
- `install_opens`

Migration:
- `migrations/001_create_install_attribution_schema.sql`

Default local DB:
- Host: `localhost`
- Port: `5434`
- DB: `install_tracking`
- User: `install_tracking`
- Password: `install_tracking`

## Attribution Rules
- `duplicate`: already have install_open for `product_name + device_id`
- `organic`: no `install_click_id`
- `attributed`: valid `install_click_id` found in `install_clicks`
- `invalid_click`: `install_click_id` sent but not found

## API Endpoints
### Public
- `GET /api/v1/health`
- `GET /api/v1/ready`
- `GET /i/:token`

### Protected (`x-api-key`)
- `POST /api/v1/install-links`
- `POST /api/v1/install-opens`
- `GET /api/v1/install-reports/summary`

## Quick Start
### Prerequisites
- Node.js 20+
- npm 10+
- Docker + Docker Compose

### Setup
```bash
cp .env.example .env
docker compose up -d
npm install
npm run migration:run
npm run start:dev
```

Open Swagger:
- `http://localhost:3001/docs`

## License
Internal project (Ayanco).
