import { HttpError } from "./errors.ts";

type Opts = { dates?: string[]; times?: string[] };

const bad = (field: string) => new HttpError(400, `Invalid value for "${field}"`);

function toDate(field: string, value: unknown): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw bad(field);
  const date = new Date(`${value}T00:00:00Z`);
  // Date silently rolls 2026-02-30 over to March; reject that.
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw bad(field);
  return date;
}

function toTime(field: string, value: unknown): Date {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw bad(field);
  return new Date(`1970-01-01T${value}:00Z`);
}

// Prepares a request body for Prisma: drops id/created_at, converts date/time strings.
export function cleanBody(body: unknown, opts: Opts = {}): Record<string, unknown> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }
  const data: Record<string, unknown> = { ...(body as Record<string, unknown>) };
  delete data.id;
  delete data.created_at;

  for (const field of opts.dates ?? []) {
    if (data[field] != null) data[field] = toDate(field, data[field]);
  }
  for (const field of opts.times ?? []) {
    if (data[field] != null) data[field] = toTime(field, data[field]);
  }
  return data;
}
