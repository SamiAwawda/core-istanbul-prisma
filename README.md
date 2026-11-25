# Core Istanbul – Course Management (Prisma + PostgreSQL)

Session 6 hands-on: Prisma 7 migrations on a course-management database
(courses, students, instructors, supervisors, rooms, schedules, hackathons, teams).

## Setup

```bash
npm install
cp .env.example .env      # then put your real DATABASE_URL
npx prisma migrate dev    # apply migrations
npx prisma generate       # generate the client into generated/prisma
```

## Notes
- Each course has exactly one hackathon (`hackathons.course_id` is unique).
- `Untitled.sql` is the original SQL the schema was first imported from (`prisma db pull`).
