# Core Istanbul – Course Management API

A small REST API for managing courses, students, instructors, rooms, schedules and hackathons.
Built with **Express + Prisma + PostgreSQL**.

<div dir="rtl">

## نظام إدارة الدورات – Core Istanbul

واجهة API بسيطة لإدارة الدورات والطلاب والأساتذة والقاعات والمواعيد والهاكاثون.
مبنية بـ **Express + Prisma + PostgreSQL**.

</div>

---

## Quick start | تشغيل سريع

```bash
npm install
cp .env.example .env          # put your DATABASE_URL | ضع رابط قاعدة البيانات
npx prisma migrate deploy     # create the tables | إنشاء الجداول
npx prisma generate           # generate Prisma Client | توليد Prisma Client
npm run dev                   # http://localhost:3000
```

## Endpoints | المسارات

Each one supports `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`
<br>كل مسار يدعم: عرض الكل، عرض واحد، إضافة، تعديل، حذف.

| Path | Table | الجدول |
|---|---|---|
| `/courses` | courses | الدورات |
| `/students` | students | الطلاب |
| `/instructors` | instructors | الأساتذة |
| `/supervisors` | supervisors | المشرفون |
| `/rooms` | rooms | القاعات |
| `/course-schedules` | course schedules | مواعيد الدورات |
| `/hackathons` | hackathons | الهاكاثون |
| `/hackathon-teams` | teams | الفرق |
| `/hackathon-team-members` | team members | أعضاء الفرق |

Extra read-only routes | مسارات إضافية للعرض فقط:
`/courses/:id/students` · `/courses/:id/schedules` · `/courses/:id/hackathon` · `/hackathons/:id/teams` · `/hackathon-teams/:id/members`

## Example | مثال

```bash
curl -X POST localhost:3000/courses \
  -H 'content-type: application/json' \
  -d '{"name":"Backend","start_date":"2026-10-01"}'
```

## Rules | القواعد

- One hackathon per course. | لكل دورة هاكاثون واحد.
- Dates: `YYYY-MM-DD`, times: `HH:MM`. | التاريخ والوقت بهذا الشكل.
- Errors: `{ "error": "..." }` (400 / 404 / 409).
