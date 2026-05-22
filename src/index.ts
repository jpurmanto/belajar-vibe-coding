import { Elysia } from "elysia";
import { userRoutes } from "./routes/users-route";

const app = new Elysia()
  .use(userRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);