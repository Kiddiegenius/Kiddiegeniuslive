# Kiddie Genius World API (foundation)

Node.js 20+, Express 5, PostgreSQL.

## Local setup

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET` (32+ random characters), and `CORS_ORIGINS`.
3. Run the SQL files in `migrations/` in numerical order.
4. Run `npm install`, then `npm run check`, then `npm start`.
5. Check `GET /health`.

## Endpoints

- `POST /api/v1/auth/register` — parent registration; requires explicit adult confirmation and 12+ character password.
- `POST /api/v1/auth/login` — parent login.
- `GET /api/v1/children` — list profiles owned by authenticated parent.
- `POST /api/v1/children` — create a nickname/grade profile.
- `GET /api/v1/children/:childId/progress` — progress for a profile owned by the authenticated parent.
- `POST /api/v1/children/:childId/progress` — record a published lesson's progress.
- `GET /api/v1/curriculum/grades` and `GET /api/v1/curriculum/lessons?grade=K&subject=math`.

Send parent access tokens in `Authorization: Bearer <token>`.

## Security and child-privacy boundary

This is an API foundation, not a launch-ready child-data system. It intentionally stores only a parent email, password hash, adult confirmation timestamp, child nickname, grade, and learning progress. Do not add a child's full name, birth date, school, precise location, photo, voice recording, or contact details without a documented necessity and privacy review.

Adult confirmation is **not** a substitute for legally valid verifiable parental consent. Before enabling real child accounts, public sign-up, analytics, advertising, or collecting personal information from children, complete a COPPA/FERPA and Florida privacy review, implement an appropriate parent notice and consent flow, access/deletion/retention controls, incident response, and security testing. Use counsel to confirm applicability.

JWTs are short-lived bearer credentials. For a production browser app, prefer a secure, HttpOnly, SameSite cookie with CSRF protection or a reviewed token-storage strategy; do not persist bearer tokens in localStorage. Add email verification, password reset, MFA option, account lockout/abuse monitoring, audit events, and key rotation before launch.

## Curriculum status

Migration 002 contains seven original starter lessons mapped to selected Florida B.E.S.T. benchmark codes. It is not a complete or state-approved curriculum. Benchmark mapping and lesson quality need review by a qualified Florida elementary educator before marketing the platform as standards-aligned.
