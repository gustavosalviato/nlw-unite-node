import fastify from "fastify";

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { createEvent } from "@/http/controllers/create-event";
import { registerForEvent } from "@/http/controllers/register-for-event";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("http server running");
  });
