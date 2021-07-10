import { Express, Request, Response } from "express";
import { createUsersessionHandler, getUserSessionHandler, invalidateUserSerssionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateRequest from "./middleware/validateRequest";
import { createUserSchema, createUserSessionSchema } from "./schema/user.schema";

export default function (app: Express) {

    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

    app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

    app.post("/api/sessions", validateRequest(createUserSessionSchema), createUsersessionHandler);

    app.get("/api/sessions", requireUser, getUserSessionHandler);

    app.delete("/api/sessions", requireUser, invalidateUserSerssionHandler);
}