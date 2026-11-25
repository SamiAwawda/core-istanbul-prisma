import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { cleanBody } from "../lib/body.ts";
import { HttpError, parseId } from "../lib/errors.ts";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await prisma.courses.findMany({ orderBy: { id: "asc" } }));
});

router.get("/:id", async (req, res) => {
  const room = await prisma.courses.findUnique({ where: { id: parseId(req.params.id) } });
  if (!room) throw new HttpError(404, "Course not found");
  res.json(room);
});

router.post("/", async (req, res) => {
  const room = await prisma.courses.create({ data: cleanBody(req.body, { dates: ["start_date", "end_date"] }) as any });
  res.status(201).json(room);
});

router.patch("/:id", async (req, res) => {
  const room = await prisma.courses.update({
    where: { id: parseId(req.params.id) },
    data: cleanBody(req.body, { dates: ["start_date", "end_date"] }) as any,
  });
  res.json(room);
});

router.delete("/:id", async (req, res) => {
  await prisma.courses.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).end();
});

async function requireCourse(idParam: string): Promise<number> {
  const id = parseId(idParam);
  const course = await prisma.courses.findUnique({ where: { id } });
  if (!course) throw new HttpError(404, "Course not found");
  return id;
}

router.get("/:id/students", async (req, res) => {
  const id = await requireCourse(req.params.id);
  res.json(await prisma.students.findMany({ where: { course_id: id }, orderBy: { id: "asc" } }));
});

router.get("/:id/schedules", async (req, res) => {
  const id = await requireCourse(req.params.id);
  res.json(await prisma.course_schedules.findMany({ where: { course_id: id }, orderBy: { id: "asc" } }));
});

router.get("/:id/hackathon", async (req, res) => {
  const id = await requireCourse(req.params.id);
  const hackathon = await prisma.hackathons.findUnique({ where: { course_id: id } });
  if (!hackathon) throw new HttpError(404, "This course has no hackathon");
  res.json(hackathon);
});

export default router;
