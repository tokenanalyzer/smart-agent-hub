import { Router, type IRouter, type Request, type Response } from "express";
import { verifyCredentials, signToken } from "../lib/auth";
import { requireAuth } from "../middleware/requireAuth";

const router: IRouter = Router();

router.post("/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "username and password are required" });
    return;
  }
  if (!verifyCredentials(username, password)) {
    req.log.warn({ username }, "Failed admin login attempt");
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  req.log.info({ username }, "Admin login successful");
  const token = signToken();
  res.json({ token });
});

router.get("/auth/verify", requireAuth, (_req: Request, res: Response) => {
  res.json({ valid: true });
});

export default router;
