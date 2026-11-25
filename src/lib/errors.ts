import type { ErrorRequestHandler } from "express";
import { Prisma } from "../../generated/prisma/client.ts";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Only positive whole numbers are valid ids; anything else is "not found".
export function parseId(value: string): number {
  const id = /^[1-9]\d*$/.test(value) ? Number(value) : NaN;
  // ids are 32-bit integers in PostgreSQL; anything bigger cannot exist
  if (!Number.isInteger(id) || id > 2147483647) throw new HttpError(404, "Not found");
  return id;
}

export function mapError(err: unknown, method: string): { status: number; message: string } {
  if (err instanceof HttpError) return { status: err.status, message: err.message };

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        return { status: 404, message: "Record not found" };
      case "P2002":
        return { status: 409, message: "Duplicate value: this record already exists" };
      case "P2003":
        return method === "DELETE"
          ? { status: 409, message: "Cannot delete: other records still depend on this one" }
          : { status: 400, message: "Related record does not exist" };
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return { status: 400, message: "Invalid or missing data" };
  }

  // body-parser (malformed JSON, too large...) sets a 4xx status on the error
  const status = (err as { status?: unknown })?.status;
  if (typeof status === "number" && status >= 400 && status < 500) {
    return { status, message: status === 400 ? "Malformed request body" : "Bad request" };
  }

  return { status: 500, message: "Internal server error" };
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { status, message } = mapError(err, req.method);
  if (status === 500) console.error(err);
  res.status(status).json({ error: message });
};
