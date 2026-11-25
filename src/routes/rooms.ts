import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { cleanBody } from "../lib/body.ts";
import { HttpError, parseId } from "../lib/errors.ts";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await prisma.rooms.findMany({ orderBy: { id: "asc" } }));
});

router.get("/:id", async (req, res) => {
  const room = await prisma.rooms.findUnique({ where: { id: parseId(req.params.id) } });
  if (!room) throw new HttpError(404, "Room not found");
  res.json(room);
});

router.post("/", async (req, res) => {
  const room = await prisma.rooms.create({ data: cleanBody(req.body) as any });
  res.status(201).json(room);
});

router.patch("/:id", async (req, res) => {
  const room = await prisma.rooms.update({
    where: { id: parseId(req.params.id) },
    data: cleanBody(req.body) as any,
  });
  res.json(room);
});

router.delete("/:id", async (req, res) => {
  await prisma.rooms.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).end();
});

export default router;
