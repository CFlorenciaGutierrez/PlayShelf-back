import { PrismaClient } from "../generated/prisma";
// Why ../generated/prisma: That's where prisma generate put the client, as defined in your schema.prisma with output = "../src/generated/prisma".

const prisma = new PrismaClient()

export default prisma

// This file creates one single PrismaClient instance and exports it — all your routes will import from here and share the same connection. 