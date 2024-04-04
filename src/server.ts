import fastify from "fastify";

import { createEvent } from "@/http/controllers/create-event";

export const app = fastify();

app.register(createEvent);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("http server running");
  });
