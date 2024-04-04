import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/utils/generate-slug";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function createEvent(app: FastifyInstance) {
  app.post("/event", async (request, reply) => {
    const createEventSchema = z.object({
      title: z.string().min(4),
      details: z.string().nullable(),
      maximumAttendees: z.number().int().positive().nullable(),
    });

    const { title, details, maximumAttendees } = createEventSchema.parse(
      request.body
    );

    const slug = generateSlug(title);

    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      },
    });

    if (eventWithSameSlug) {
      throw new Error("Another event with same title already exists.");
    }

    const event = await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendees,
        slug,
      },
    });

    return reply.status(201).send({
      eventId: event.id,
    });
  });
}
