import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  commentController.createComment,
);

export const commentRoutes = router;
