import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import authRouter from "./auth";
import notesRouter from "./notes";

const router = Router();

router.use("/auth", authRouter);
router.use(authMiddleware);
router.use("/notes", notesRouter);

export default router;