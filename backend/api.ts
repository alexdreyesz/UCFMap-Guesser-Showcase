import { Request, Response, Router } from "express";
import authRouter from "./auth.js";
export const apiRouter = Router();

// Mount auth routes under "/"
apiRouter.use("/", authRouter);

// Notice the _ lets you NOT use the variable
apiRouter.get("/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from the backend API!" });
});
apiRouter.get("/goodbye", (_req: Request, res: Response) => {
  res.json({ message: "Goodbye from the backend API!" });
});
