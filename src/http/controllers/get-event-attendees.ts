import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { eventNames } from "process";
import { z } from "zod";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Get event attendees",
        tags: ["attendees"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable(),
              })
            ),
            total: z.number().int(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { query, pageIndex } = request.query;

      const [attendees, total] = await Promise.all([
        prisma.attendee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                },
              }
            : {
                eventId,
              },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.attendee.count({
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                },
              }
            : { eventId },
        }),
      ]);

      return reply.send({
        attendees: attendees.map((attendee) => ({
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createdAt: attendee.createdAt,
          checkInAt: attendee.checkIn?.createdAt ?? null,
        })),
        total,
      });
    }
  );
}
