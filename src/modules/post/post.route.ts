import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.createPost,
);

router.get("/", postController.getAllPosts);

router.get("/stats", auth(Role.ADMIN), postController.getPostStats);

router.get(
  "/my-posts",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.getMyPosts,
);

router.get("/:postId", postController.getPostByID);

router.patch(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.updatePost,
);

router.delete(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.deletePost,
);

export const postRoutes = router;
