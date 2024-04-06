import fastify from "fastify";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import { createEvent } from "@/http/controllers/create-event";
import { registerForEvent } from "@/http/controllers/register-for-event";
import { getEvent } from "@/http/controllers/get-event";
import { getAttendeeBadge } from "@/http/controllers/get-attendee-badge";
import { checkIn } from "@/http/controllers/check-in";
import { getEventAttendees } from "@/http/controllers/get-event-attendees";
import { errorHandler } from "@/error-handler";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifySwagger, {
  swagger: {
    produces: ["application/json"],
    consumes: ["application/json"],
    info: {
      title: "pass.in",
      description:
        "Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  prefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("http server running");
  });
