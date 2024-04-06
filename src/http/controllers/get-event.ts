import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/event/:eventId",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          details: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new Error("Event not found.");
      }

      return reply.send({
        event: {
          id: event.id,
          title: event.title,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmont: event._count.attendees,
        },
      });
    }
  );
}
