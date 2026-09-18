# Project Operations

## MongoDB Atlas setup

1. Create an Atlas cluster and a database user with read/write access to the application database.
2. Add the deployment host or Vercel integration to Atlas Network Access. Avoid `0.0.0.0/0` in production.
3. Copy the SRV connection string into `MONGODB_URI` in `.env.local` or your deployment secret store.
4. Set `MONGODB_DB` (default: `ai_mockinterview`).
5. Set a long random `CRON_SECRET` to protect cleanup requests.

`MONGODB_URI` is server-only. It must never use a `NEXT_PUBLIC_` prefix or be sent to the browser. The application creates the `jobs` collection and its indexes on first database use.

## Runtime architecture

The browser calls Next.js route handlers. Route handlers use `lib/jobs-repository.ts`, which uses the cached native MongoDB driver from `lib/mongodb.ts`. MongoDB documents keep `ObjectId` as `_id`; API responses expose it as a string `id`.

Indexes:

- `{ is_active: 1, created_at: -1 }` for the public active-jobs feed
- `{ created_at: 1 }` for expiry cleanup

## Job API

- `GET /api/jobs` lists all jobs for the admin console.
- `POST /api/jobs` validates and creates an active job.
- `GET /api/jobs/:id` returns one job.
- `PUT /api/jobs/:id` validates and updates one job.
- `DELETE /api/jobs/:id` deletes one job.
- `POST /api/jobs/cleanup` deletes jobs older than 20 days.

Cleanup accepts `Authorization: Bearer <CRON_SECRET>` when `CRON_SECRET` is configured. Schedule it with the hosting provider's protected cron facility.

## Deployment checklist

- Use a separate Atlas database user and database for each environment.
- Store `MONGODB_URI`, `MONGODB_DB`, `GEMINI_API_KEY`, and `CRON_SECRET` in the deployment secret manager.
- Restrict Atlas Network Access to known application egress addresses where possible.
- Enable Atlas backups and alerts before production traffic.
- Run `npm run build` in CI and test the job CRUD flow against a staging database.
