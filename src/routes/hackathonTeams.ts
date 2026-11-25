import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { cleanBody } from "../lib/body.ts";
import { HttpError, parseId } from "../lib/errors.ts";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await prisma.hackathon_teams.findMany({ orderBy: { id: "asc" } }));
});

router.get("/:id", async (req, res) => {
  const room = await prisma.hackathon_teams.findUnique({ where: { id: parseId(req.params.id) } });
  if (!room) throw new HttpError(404, "Team not found");
  res.json(room);
});

router.post("/", async (req, res) => {
  const room = await prisma.hackathon_teams.create({ data: cleanBody(req.body) as any });
  res.status(201).json(room);
});

router.patch("/:id", async (req, res) => {
  const room = await prisma.hackathon_teams.update({
    where: { id: parseId(req.params.id) },
    data: cleanBody(req.body) as any,
  });
  res.json(room);
});

router.delete("/:id", async (req, res) => {
  await prisma.hackathon_teams.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).end();
});

router.get("/:id/members", async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await prisma.hackathon_teams.findUnique({ where: { id } }))) throw new HttpError(404, "Team not found");
  res.json(await prisma.hackathon_team_members.findMany({ where: { team_id: id }, orderBy: { id: "asc" } }));
});

export default router;
