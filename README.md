# Install Attribution System (MVP)

سیستم داخلی Attribution نصب اپلیکیشن قبضینو با تمرکز روی **first open**.

---

## Table of Contents
- [1) Project Overview](#1-project-overview)
- [2) MVP Goal](#2-mvp-goal)
- [3) Scope](#3-scope)
- [4) Tech Stack](#4-tech-stack)
- [5) Service URLs](#5-service-urls)
- [6) Database](#6-database)
- [7) Attribution Flow](#7-attribution-flow)
- [8) Attribution Rules](#8-attribution-rules)
- [9) API Endpoints](#9-api-endpoints)
- [10) Quick Start](#10-quick-start)
- [11) Environment Variables](#11-environment-variables)
- [12) Migration](#12-migration)
- [13) Test Scenarios](#13-test-scenarios)
- [14) Reporting (Power BI)](#14-reporting-power-bi)
- [15) Security Notes](#15-security-notes)
- [16) Roadmap](#16-roadmap)

---

## 1) Project Overview

هدف این سرویس این است که مشخص شود هر نصب اپ قبضینو از کدام لینک/کمپین/سورس اتفاق افتاده است.

در فاز MVP فقط یک event دریافت می‌شود:
- `install_open` (یا first open)

---

## 2) MVP Goal

مسیر MVP:

`Install Link Click` → `Install Click ثبت شود` → `Redirect با install_click_id` → `App Install` → `First Open` → `Install Open ثبت شود` → `Attribution` → `Report`

---

## 3) Scope

### In Scope
- ساخت لینک نصب کمپین
- ثبت کلیک نصب (`install_click`)
- ساخت `install_click_id`
- Redirect به مارکت همراه query/referrer params
- دریافت `install_open` از اپ
- Attribution ساده (`attributed`, `organic`, `invalid_click`, `duplicate`)
- گزارش خلاصه API
- Swagger
- PostgreSQL schema برای گزارش‌گیری Power BI

### Out of Scope
- رویدادهای بعدی (signup, login, payment)
- CPI/CPA/ROAS
- anti-fraud پیشرفته
- retention cohort
- multi-touch/view-through attribution
- iOS attribution

---

## 4) Tech Stack

- **Backend:** NestJS (TypeScript)
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **DB Client:** `pg`
- **Config:** `.env` + `@nestjs/config`
- **API Docs:** Swagger (`/docs`)
- **Local DB:** Docker Compose

---

## 5) Service URLs

- Base URL: `http://192.168.3.64:3001`
- Swagger: `http://192.168.3.64:3001/docs`
- API Base: `http://192.168.3.64:3001/api/v1`
- Health: `GET /api/v1/health`
- Ready: `GET /api/v1/ready`
- Install Click Link Pattern: `GET /i/:token`

نمونه:
- `http://192.168.3.64:3001/i/gzb1405`

---

## 6) Database

سه جدول اصلی MVP:
- `install_links`
- `install_clicks`
- `install_opens`

Migration file:
- `migrations/001_create_install_attribution_schema.sql`

DB local defaults:
- Host: `localhost`
- Port: `5434`
- DB: `install_tracking`
- User: `install_tracking`
- Password: `install_tracking`

---

## 7) Attribution Flow

1. کمپین یک `install link` دارد.
2. کاربر روی `GET /i/:token` کلیک می‌کند.
3. سیستم یک `install_click_id` می‌سازد و رکورد click را ذخیره می‌کند.
4. کاربر با `302` به مقصد مارکت redirect می‌شود (همراه `ayanco_install_click_id` و `ayanco_token`).
5. اپ در first open، referrer/query را می‌خواند.
6. اپ `POST /api/v1/install-opens` را صدا می‌زند.
7. سیستم وضعیت attribution را مشخص می‌کند و رکورد `install_open` ثبت می‌شود.

---

## 8) Attribution Rules

- `duplicate`: اگر برای `product_name + device_id` قبلاً install open ثبت شده باشد.
- `organic`: اگر `install_click_id` ارسال نشود.
- `attributed`: اگر `install_click_id` ارسال شده و در `install_clicks` وجود داشته باشد.
- `invalid_click`: اگر `install_click_id` ارسال شود ولی در `install_clicks` پیدا نشود.

---

## 9) API Endpoints

## Public APIs

### 9.1 Health
`GET /api/v1/health`

Response:
```json
{
  "success": true,
  "service": "install-attribution-system",
  "status": "ok"
}
```

### 9.2 Ready
`GET /api/v1/ready`

Response:
```json
{
  "success": true,
  "database": "ok"
}
```

### 9.3 Click + Redirect
`GET /i/:token`

Behavior:
- Validate token and active link
- Create/install click
- Build redirect url with attribution params
- Redirect `302`

---

## Protected APIs (x-api-key)

Header:
```http
x-api-key: dev-install-api-key
```

### 9.4 Create Install Link
`POST /api/v1/install-links`

Request:
```json
{
  "product_name": "ghabzino",
  "package_name": "com.ayanco.ghabzino",
  "campaign_name": "car_transfer_launch",
  "media_source": "tapsell",
  "channel": "paid",
  "destination_store": "cafebazaar",
  "destination_url": "https://cafebazaar.ir/app/com.ayanco.ghabzino"
}
```

### 9.5 Create Install Open
`POST /api/v1/install-opens`

Request:
```json
{
  "Identity": {
    "Token": "E61165CBE2B74373B90EBA23C6805412"
  },
  "Parameters": {
    "product_name": "ghabzino",
    "package_name": "com.ayanco.ghabzino",
    "device_id": "device_123",
    "store": "cafebazaar",
    "install_click_id": "2a4162fa-264e-4db5-93dd-9d9b87cefc78",
    "token": "gzb1405",
    "referrer_raw": "ayanco_token=gzb1405&ayanco_install_click_id=2a4162fa-264e-4db5-93dd-9d9b87cefc78&utm_source=tapsell&utm_campaign=car_transfer_launch",
    "app_version": "5.2.0",
    "os_version": "Android 14"
  }
}
```

### 9.6 Summary Report
`GET /api/v1/install-reports/summary`

Response example:
```json
{
  "success": true,
  "summary": {
    "clicks": 1000,
    "install_opens": 250,
    "attributed_installs": 220,
    "organic_installs": 30,
    "invalid_click_installs": 0,
    "duplicate_opens": 10,
    "click_to_install_rate": 22
  }
}
```

---

## 10) Quick Start

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

Open:
- Swagger: `http://localhost:3001/docs`

---

## 11) Environment Variables

See `.env.example`.

Important keys:
- `PORT=3001`
- `API_KEY=dev-install-api-key`
- `PUBLIC_BASE_URL=http://192.168.3.64:3001`
- `DATABASE_PORT=5434`

---

## 12) Migration

Run schema migration:
```bash
npm run migration:run
```

File:
- `migrations/001_create_install_attribution_schema.sql`

---

## 13) Test Scenarios

1. `GET /api/v1/health` → `status=ok`
2. `GET /api/v1/ready` → `database=ok`
3. `POST /api/v1/install-links` → install_url ساخته شود
4. `GET /i/:token` → click ثبت + redirect انجام شود
5. `POST /api/v1/install-opens` با click معتبر → `attributed`
6. `POST /api/v1/install-opens` بدون click → `organic`
7. `POST /api/v1/install-opens` با click ناموجود → `invalid_click`
8. ارسال مجدد same `product_name + device_id` → `duplicate`

---

## 14) Reporting (Power BI)

اتصال مستقیم Power BI به PostgreSQL پیشنهاد می‌شود.

Core KPIs:
- Clicks
- Install Opens
- Attributed Installs
- Organic Installs
- Invalid Click Installs
- Duplicate Opens
- Click to Install Rate

Primary relations:
- `install_links.id` → `install_clicks.install_link_id`
- `install_clicks.install_click_id` → `install_opens.attributed_install_click_id`

---

## 15) Security Notes

- APIهای مدیریتی با `x-api-key` محافظت شوند.
- `GET /i/:token`, `GET /health`, `GET /ready` public هستند.
- کلیدها فقط از `.env` خوانده شوند.
- مقدار API key در کد hardcode نشود.

---

## 16) Roadmap

- بهبود validation/typing
- automated tests (unit/integration/e2e)
- rate limiting
- richer dashboard queries
- support for advanced attribution windows

---

## License

Internal project (Ayanco).
