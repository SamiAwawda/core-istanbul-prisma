import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { cleanBody } from "../lib/body.ts";
import { HttpError, parseId } from "../lib/errors.ts";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await prisma.hackathons.findMany({ orderBy: { id: "asc" } }));
});

router.get("/:id", async (req, res) => {
  const room = await prisma.hackathons.findUnique({ where: { id: parseId(req.params.id) } });
  if (!room) throw new HttpError(404, "Hackathon not found");
  res.json(room);
});

router.post("/", async (req, res) => {
  const room = await prisma.hackathons.create({ data: cleanBody(req.body, { dates: ["event_date"], times: ["start_time", "end_time"] }) as any });
  res.status(201).json(room);
});

router.patch("/:id", async (req, res) => {
  const room = await prisma.hackathons.update({
    where: { id: parseId(req.params.id) },
    data: cleanBody(req.body, { dates: ["event_date"], times: ["start_time", "end_time"] }) as any,
  });
  res.json(room);
});

router.delete("/:id", async (req, res) => {
  await prisma.hackathons.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).end();
});

router.get("/:id/teams", async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await prisma.hackathons.findUnique({ where: { id } }))) throw new HttpError(404, "Hackathon not found");
  res.json(await prisma.hackathon_teams.findMany({ where: { hackathon_id: id }, orderBy: { id: "asc" } }));
});

export default router;
