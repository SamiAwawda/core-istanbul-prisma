import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const url = new URL(process.env.DATABASE_URL ?? "");
const schema = url.searchParams.get("schema") ?? "public";
url.search = "";

const adapter = new PrismaPg({ connectionString: url.toString() }, { schema });

const prisma = new PrismaClient({ adapter });

export default prisma;
