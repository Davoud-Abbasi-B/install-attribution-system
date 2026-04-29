# install-attribution-system

MVP install attribution backend using NestJS + PostgreSQL.

## Run
1. Copy `.env.example` to `.env`
2. Run PostgreSQL: `docker compose up -d`
3. Install deps: `npm install`
4. Run migration: `npm run migration:run`
5. Start app: `npm run start:dev`

Base URL: `http://192.168.3.64:3001`
Swagger: `/docs`
